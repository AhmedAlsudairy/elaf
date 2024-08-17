"use server";
import { createClient } from "@/lib/utils/supabase/server";

export async function getCurrentCompanyProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("company_profiles")
    .select("*")
    .eq("user_id", user?.id)
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