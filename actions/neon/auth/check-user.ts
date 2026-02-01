'use server'

import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export const checkUser = async () => {
  try {
    const user = await currentUser()
    
    if (!user) return null

    // Check if user exists
    const existing = await prisma.userProfile.findUnique({
      where: { clerkUserId: user.id },
    })

    if (existing) return existing

    // Create new user
    const newUser = await prisma.userProfile.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.emailAddresses[0]?.emailAddress || '',
        profileImage: user.imageUrl,
      },
    })

    return newUser
  } catch (error) {
    console.error('Error in checkUser:', error)
    // Don't throw - return null to prevent layout crashes
    return null
  }
}