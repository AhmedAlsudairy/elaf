'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { UserProfile } from "@/types";
import { redirect } from 'next/navigation';

export async function updateUserProfile(formData: UserProfile) {
  const supabase = createClient()

  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Authentication error:', userError);
    throw new Error('User not authenticated');
  }

  // Prepare the data to be upserted
  const profileData = {
    user_id: user.id,
    name: formData.name,
    email: formData.email,
    bio: formData.bio,
    phone_number: formData.phone_number,
    address: formData.address,
    profile_image: formData.profile_image,
    role: formData.role,
    company_that_worked_with: formData.company_that_worked_with,
    updated_at: new Date().toISOString(),
  };

  // Perform the upsert operation
  const { error: upsertError } = await supabase
    .from('user_profiles')
    .upsert(profileData)
    .eq('user_id', user.id);

  if (upsertError) {
    console.error('Failed to update profile:', upsertError);
    throw new Error('Failed to update profile');
  }

  // Redirect to the profile page
  redirect('/profile/myprofile');
}