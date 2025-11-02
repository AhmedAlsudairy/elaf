"use server"

import { prisma } from '@/lib/prisma'
import { companySchema } from '@/schema'
import { revalidatePath } from 'next/cache'
import { auth, currentUser } from '@clerk/nextjs/server'
import { z } from 'zod'

type CompanyFormData = z.infer<typeof companySchema>

export async function addCompany(data: CompanyFormData) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    const userEmail = user.emailAddresses[0]?.emailAddress
    if (!userEmail) {
      return { success: false, error: 'User email not found' }
    }

    // ✅ Normalize sector values before validation
    if (Array.isArray(data.sectors)) {
      data.sectors = data.sectors.map(
        (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
      )
    }

    // ✅ Validate the data
    const validatedData = companySchema.parse(data)

    // Check if company with this email already exists
    const existingCompany = await prisma.company.findUnique({
      where: { companyEmail: validatedData.companyEmail },
    })

    if (existingCompany) {
      return { success: false, error: 'A company with this email already exists' }
    }

    // ✅ Create company and link to user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          companyTitle: validatedData.companyTitle,
          companyEmail: validatedData.companyEmail,
          companyWebsite: validatedData.companyWebsite || null,
          companyNumber: validatedData.companyNumber || null,
          bio: validatedData.bio || null,
          sectors: validatedData.sectors || [],
          phoneNumber: validatedData.phoneNumber || null,
          address: validatedData.address || null,
          profileImage: validatedData.profileImage || null,
          companyProfileId: userId,
        },
      })

      let userProfile = await tx.userProfile.findUnique({
        where: { clerkUserId: userId },
      })

      if (!userProfile) {
        userProfile = await tx.userProfile.create({
          data: {
            clerkUserId: userId,
            email: userEmail,
            name:
              `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
              userEmail,
            profileImage: user.imageUrl || null,
            companyId: company.id,
          },
        })
      } else {
        await tx.userProfile.update({
          where: { id: userProfile.id },
          data: { companyId: company.id },
        })
      }

      return company
    })

    revalidatePath('/')
    revalidatePath('/profile')
    revalidatePath('/chats')

    return { success: true, data: result }
  } catch (error) {
    console.error('Error creating company:', error)

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          'Invalid form data: ' +
          error.errors.map((e) => e.message).join(', '),
      }
    }

    return { success: false, error: 'Failed to create company profile' }
  }
}
