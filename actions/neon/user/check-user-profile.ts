'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getUserDetails } from './get-user-details'

export async function checkUserProfileAndRedirect() {
  try {
    const userDetails = await getUserDetails()

    if (!userDetails) {
      redirect('/login')
    }

    const profile = await prisma.userProfile.findUnique({
      where: { clerkUserId: userDetails.id },
    })

    if (profile) {
      redirect('/profile/myprofile')
    } else {
      redirect('/profile/create')
    }
  } catch (error) {
    console.error('Error checking user profile:', error)
    redirect('/error')
  }
}
