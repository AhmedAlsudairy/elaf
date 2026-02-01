'use server'

import { z } from 'zod'
import { userProfileSchema, companySchema } from '@/schema'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

type UserProfileData = z.infer<typeof userProfileSchema>
type CompanyData = z.infer<typeof companySchema>

interface RegistrationResult {
  success: boolean
  message: string
  userId?: string
  companyId?: string
  error?: string
}

export async function submitFinalForm(
  userProfile: UserProfileData,
  company: CompanyData | null
): Promise<RegistrationResult> {
  const user = await currentUser();
  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    console.log('Starting submitFinalForm...');

    // Validate the data
    const validatedUserProfile = userProfileSchema.parse(userProfile)
    const validatedCompany = company ? companySchema.parse(company) : null

    console.log('Data validated successfully');

    // Use Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User Profile
      // Check if profile exists for this Clerk ID
      const existingProfile = await tx.userProfile.findUnique({
        where: { clerkUserId: user.id }
      });

      let newUserProfile;

      if (existingProfile) {
        // Update
        newUserProfile = await tx.userProfile.update({
            where: { id: existingProfile.id },
            data: {
                name: validatedUserProfile.name,
                email: validatedUserProfile.email,
                role: validatedUserProfile.role,
                bio: validatedUserProfile.bio,
                phoneNumber: validatedUserProfile.phoneNumber,
                address: validatedUserProfile.address,
                profileImage: validatedUserProfile.profileImage,
                companyThatWorkedWith: validatedUserProfile.companyThatWorkedWith,
            }
        });
      } else {
        // Create
        newUserProfile = await tx.userProfile.create({
            data: {
                clerkUserId: user.id,
                name: validatedUserProfile.name,
                email: validatedUserProfile.email,
                role: validatedUserProfile.role,
                bio: validatedUserProfile.bio,
                phoneNumber: validatedUserProfile.phoneNumber,
                address: validatedUserProfile.address,
                profileImage: validatedUserProfile.profileImage,
                companyThatWorkedWith: validatedUserProfile.companyThatWorkedWith,
            }
        });
      }

      let newCompany = null;

      // 2. Create Company if provided
      if (validatedCompany) {
         newCompany = await tx.company.create({
            data: {
                companyTitle: validatedCompany.companyTitle,
                companyEmail: validatedCompany.companyEmail,
                companyWebsite: validatedCompany.companyWebsite ?? undefined,
                companyNumber: validatedCompany.companyNumber ?? undefined,
                sectors: validatedCompany.sectors ?? undefined,
                bio: validatedCompany.bio ?? undefined,
                phoneNumber: validatedCompany.phoneNumber ?? undefined,
                address: validatedCompany.address ?? undefined,
                profileImage: validatedCompany.profileImage ?? undefined,
            }
         });
         
         // Link user to company if needed
         await tx.userProfile.update({
            where: { id: newUserProfile.id },
            data: { companyId: newCompany.id }
         });
      }

      return { userProfile: newUserProfile, company: newCompany };
    });

    console.log('Registration successful, data:', result);

    return {
      success: true,
      message: 'Registration completed successfully',
      userId: result.userProfile.id,
      companyId: result.company?.id
    }
  } catch (error) {
    console.error('Unexpected error during registration:', error)
    return {
      success: false,
      message: 'An unexpected error occurred during registration',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}