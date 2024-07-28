'use server'
import { createClient } from "@/lib/utils/supabase/server";
import supabaseServer from "@/lib/utils/supabase/supabase-call-server";

export async function getUserDetails() {
  const supabase = createClient()
      
    const { data: { user } } = await supabase.auth.getUser();
  
    if (user) {
      const name = user.user_metadata.full_name;
      const email = user.user_metadata.email;
      const avatarUrl = user.user_metadata.avatar_url;
  
      return { name, email, avatarUrl };
    } else {
      throw new Error("User not found");
    }
  }
  