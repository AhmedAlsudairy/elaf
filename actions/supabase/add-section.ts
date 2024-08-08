'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyProfile } from "./get-current-company-profile";

export async function addSection(formData: FormData) {
    const supabase = createClient();
  
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      throw new Error("User not authenticated");
    }
  
    const companyProfile = await getCurrentCompanyProfile();
  
    if (!companyProfile) {
      throw new Error("Company profile not found");
    }
  
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fileUrl = formData.get('fileUrl') as string;
  
    if (!title || !description || !fileUrl) {
      throw new Error("Missing required fields");
    }
  
    // Insert new section into the database
    const { data, error } = await supabase
      .from('company_profile_sections')
      .insert({
        company_profile_id: companyProfile.id,
        title,
        description,
        file_url: fileUrl,
        tab_name: title.toLowerCase().replace(/\s+/g, '-')
      })
      .select()
      .single();
  
    if (error) {
      throw new Error("Error adding new section");
    }
  
    revalidatePath('/company-profile');
    return data;
  }