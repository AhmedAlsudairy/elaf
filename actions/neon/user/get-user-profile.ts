// app/actions/getUserProfile.ts
'use server'

import { prisma } from '@/lib/prisma'

export const getUserProfile = async (userId: string) => {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { id: userId },
      include: {
        tenders: true, // optional — include if you want related tenders too
      },
    })

    if (!userProfile) {
      console.log('User profile not found')
      return null
    }

    return userProfile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}
