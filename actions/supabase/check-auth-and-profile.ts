'use server'

import { prisma } from '@/lib/prisma'

export async function checkAuthAndProfiles(userId: string) {
  try {
    if (!userId) {
      return {
        isAuthenticated: false,
        userProfile: null,
        companyProfile: null,
      }
    }

    // Fetch user profile and company profile in parallel
    const [userProfile, companyProfile] = await Promise.all([
      prisma.userProfile.findUnique({
        where: { id: userId },
      }),
      prisma.company.findFirst({
        where: { companyEmail: { not: null } }, // Adjust condition if needed
      }),
    ])

    return {
      isAuthenticated: true,
      userProfile,
      companyProfile,
    }
  } catch (error) {
    console.error('Error in checkAuthAndProfiles:', error)
    return {
      isAuthenticated: false,
      userProfile: null,
      companyProfile: null,
    }
  }
}
