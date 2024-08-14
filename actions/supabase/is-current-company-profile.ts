"use server";

import { createClient } from "@/lib/utils/supabase/server";

export async function isCurrentUserCompanyProfile(companyId: string) {
  const supabase = createClient();

  try {
    // Fetch the company profile
    const { data: companyProfile, error: companyError } = await supabase
      .from("company_profiles")
      .select("user_id")
      .eq("company_profile_id", companyId)
      .single();

    if (companyError || !companyProfile) {
      console.error("Error fetching company profile:", companyError);
      return false;
    }

    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error fetching current user:", userError);
      return false;
    }

    // Compare the user IDs
    return user.id === companyProfile.user_id;

  } catch (error) {
    console.error("Error in isCurrentUserCompanyProfile:", error);
    return false;
  }
}