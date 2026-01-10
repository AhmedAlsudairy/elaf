'use server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server';

export async function getUserDetails() {
  try {
    const user = await currentUser();
  
    if (user) {
      const id = user.id
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '';
      const email = user.emailAddresses[0]?.emailAddress || '';
      const avatarUrl = user.imageUrl;
  
      return { id, name, email, avatarUrl };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
}