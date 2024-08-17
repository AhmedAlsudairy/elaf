"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { companySchema } from '@/schema';
import { revalidatePath } from "next/cache";

export async function addCompany(formData: FormData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const rawFormData = Object.fromEntries(formData.entries());
  
  // Parse the sectors field if it's a string
  let sectors = [];
  if (typeof rawFormData.sectors === 'string') {
    try {
      sectors = JSON.parse(rawFormData.sectors);
    } catch (error) {
      console.error("Error parsing sectors:", error);
      // Keep sectors as an empty array if parsing fails
    }
  }

  // Create a new object with parsed sectors
  const parsedFormData = {
    ...rawFormData,
    sectors: sectors
  };

  const validatedData = companySchema.parse(parsedFormData);

  const { data, error } = await supabase
    .from("company_profiles")
    .insert({
      ...validatedData,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding company profile:", error);
    throw new Error("Failed to add company profile");
  }

  // Revalidate the specific company profile path
  revalidatePath(`/profile/companyprofiles/${data.company_profile_id}`);

  // Also revalidate the dashboard path
  
  return { success: true, data };
}