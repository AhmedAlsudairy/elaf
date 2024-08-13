'use server'
import { createClient } from "@/lib/utils/supabase/client";
import { CompanyProfile } from "@/types";
import { revalidatePath } from "next/cache";

export async function updateProfile(profile: CompanyProfile) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from('company_profiles')
      .update({
        company_title: profile.company_title,
        company_number: profile.company_number,
        company_website: profile.company_website,
        company_email: profile.company_email,
        phone_number: profile.phone_number,
        address: profile.address,
        bio: profile.bio,
        profile_image: profile.profile_image
      })
      .eq('id', profile.id)
      .select()
      .single();
  
    if (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }
  
    revalidatePath('/company-profile');
    return data;
  }
  