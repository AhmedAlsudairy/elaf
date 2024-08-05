'use server'
import { createClient } from "@/lib/utils/supabase/server";
import supabaseServer from "@/lib/utils/supabase/supabase-call-server";

export async function getCurrentUserProfile() {
  const supabase = createClient()
      
    const { data: { user } } = await supabase.auth.getUser();
  
    const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  if (!data) {
    console.log('User profile not found')
    return null
  }

  return data


  }