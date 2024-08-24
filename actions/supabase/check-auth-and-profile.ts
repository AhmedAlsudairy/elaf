'use server'

import { createClient } from "@/lib/utils/supabase/server";

export async function checkAuthAndProfiles() {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { isAuthenticated: false, userProfile: null, companyProfile: null };
    }

    const [userProfileResult, companyProfileResult] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
    ]);

    return {
      isAuthenticated: true,
      userProfile: userProfileResult.data || null,
      companyProfile: companyProfileResult.data || null
    };
  } catch (error) {
    console.error('Error in checkAuthAndProfiles:', error);
    return { isAuthenticated: false, userProfile: null, companyProfile: null };
  }
}