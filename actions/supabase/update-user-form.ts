'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from 'next/navigation';

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
  const supabase = createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Authentication error:', userError);
    throw new Error('User not authenticated');
  }

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

  // Redirect to the profile page
  redirect('/profile/myprofile');
}