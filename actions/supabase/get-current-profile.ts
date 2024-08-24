'use server'
import { createClient } from "@/lib/utils/supabase/server";

export async function getCurrentProfiles() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('No authenticated user found');
    return { userProfile: null, companyProfile: null };
  }

  // Create userProfile directly from user data
  const userProfile = {
    id: user.id,
    email: user.email,
    name: user.user_metadata.full_name,
    profile_image: user.user_metadata.avatar_url,
    role: user.user_metadata.role,
    phone_number: user.user_metadata.phone_number,
    address: user.user_metadata.address,
    bio: user.user_metadata.bio,
    company_that_worked_with: user.user_metadata.company_that_worked_with,
    // Add any other fields you need from user_metadata
  };

  // Fetch company profile
  const { data: companyProfile, error: companyProfileError } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (companyProfileError) {
    console.error('Error fetching company profile:', companyProfileError);
  }

  return { userProfile, companyProfile };
}