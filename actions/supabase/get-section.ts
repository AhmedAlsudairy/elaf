// app/actions/getSections.ts
'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { getCurrentCompanyProfile } from "./get-current-company-profile";

export interface Section {
  id: string;
  title: string;
  description: string;
  file_url: string;
  tab_name: string;
  company_profile_id: string;
}

export async function getSections(): Promise<Section[]> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const companyProfile = await getCurrentCompanyProfile();

  if (!companyProfile) {
    throw new Error("Company profile not found");
  }

  const { data, error } = await supabase
    .from('company_profile_sections')
    .select('*')
    .eq('company_profile_id', companyProfile.id);

  if (error) {
    console.error("Error fetching sections:", error);
    throw new Error("Error fetching sections");
  }

  return data as Section[];
}