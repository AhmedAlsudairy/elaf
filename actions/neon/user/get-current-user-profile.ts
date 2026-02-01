'use server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'

export async function getCurrentUserProfile() {
  try {
    const user = await currentUser();

    if (!user) {
      return null;
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (!userProfile) {
      console.log('User profile not found')
      return null
    }

    // Return matching UserProfile schema (camelCase)
    // Map nulls to undefined to match Zod optional()
    return {
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      bio: userProfile.bio || undefined,
      phoneNumber: userProfile.phoneNumber || undefined,
      address: userProfile.address || undefined,
      profileImage: userProfile.profileImage || undefined,
      role: userProfile.role || undefined,
      companyThatWorkedWith: userProfile.companyThatWorkedWith || undefined,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}