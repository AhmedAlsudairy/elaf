"use server";
import { createClient } from "@/lib/utils/supabase/server";

export async function getCompanyProfileById(companyId:string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("company_profiles")
    .select("company_profile_id, profile_image, company_title, bio, company_number, company_website, company_email, phone_number, address, sectors")
    .eq("company_profile_id", companyId)
    .single();

  if (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }

  if (!data) {
    console.log("Company profile not found");
    return null;
  }

  return data;
}