import supabaseClient from "@/lib/utils/supabase/supabase-call-client";
import supabaseServer from "@/lib/utils/supabase/supabase-call-server";

export const IsLoggedIn=async () => {
    
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    // If the user object is not null, the user is logged in
    console.log(user)
    return !!user ;
    
  } catch (error) {
    console.error('Error checking user login status:', error);
    return false;
  }
}
