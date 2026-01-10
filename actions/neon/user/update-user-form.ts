'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

interface UserProfile {
  id?: string;
  name: string;
  email: string;
  bio?: string;
  phone_number?: string;
  address?: string;
  profile_image?: string;
  role?: string;
  company_that_worked_with?: string;
  avatar_url?: string;
  picture?: string;
}

export async function updateUserProfile(formData: UserProfile) {
  const { userId } = await auth();

  if (!userId) {
    console.error('Authentication error: User not authenticated');
    throw new Error('User not authenticated');
  }

  // Update logic using Prisma
  // Note: The original code likely updated a 'user_profiles' table or similar.
  // We should check the schema to map fields correctly.
  
  try {
      await prisma.userProfile.update({
          where: { clerkUserId: userId },
          data: {
             name: formData.name,
             email: formData.email, // Can we generic update email? Typically synced from Clerk
             bio: formData.bio,
             phoneNumber: formData.phone_number,
             address: formData.address,
             profileImage: formData.profile_image,
             role: formData.role,
             companyThatWorkedWith: formData.company_that_worked_with
             // companyId logic was likely elsewhere or implicit
          }
      });
  } catch (e) {
      console.error("Error updating user profile:", e);
      throw new Error("Failed to update profile");
  }

  /*
  // Update user data in auth.users
  const { error: updateUserError } = await supabase.auth.updateUser({
    email: formData.email,
    data: {
      full_name: formData.name,
      avatar_url: formData.profile_image,
      picture: formData.picture,
      bio: formData.bio,
      phone_number: formData.phone_number,
      address: formData.address,
      role: formData.role,
      company_that_worked_with: formData.company_that_worked_with
    }
  });

  if (updateUserError) {
    console.error('Failed to update user:', updateUserError);
    throw new Error('Failed to update user');
  }
  */

  // Redirect to the profile page
  redirect('/profile/myprofile');
}