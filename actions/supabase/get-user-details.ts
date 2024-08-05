'use server'
import { createClient } from "@/lib/utils/supabase/server";

export async function getUserDetails() {
  const supabase = createClient()
      
  try {
    const { data: { user } } = await supabase.auth.getUser();
  
    if (user) {
      const id = user.id
      const name = user.user_metadata?.full_name;
      const email = user.user_metadata?.email;
      const avatarUrl = user.user_metadata?.avatar_url;
  
      return { id, name, email, avatarUrl };
    } else {
      return null; // or throw new Error("User not authenticated");
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
}