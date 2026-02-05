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

    // 1. Create or Update User Profile
    const existingProfile = await prisma.userProfile.findUnique({
      where: { clerkUserId: user.id }
    });

    let newUserProfile;

    if (existingProfile) {
      // Update existing profile
      newUserProfile = await prisma.userProfile.update({
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
      // Create new profile
      newUserProfile = await prisma.userProfile.create({
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
      newCompany = await prisma.company.create({
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
      
      // Link user to company
      await prisma.userProfile.update({
        where: { id: newUserProfile.id },
        data: { companyId: newCompany.id }
      });
    }

    console.log('Registration successful');

    return {
      success: true,
      message: 'Registration completed successfully',
      userId: newUserProfile.id,
      companyId: newCompany?.id
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