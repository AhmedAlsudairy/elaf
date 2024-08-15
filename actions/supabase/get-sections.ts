// app/actions/getSections.ts
'use server'

import { createClient } from "@/lib/utils/supabase/server";

export interface Section {
  id: string;
  title: string;
  description: string;
  file_url: string;
  tab_name: string;
  company_profile_id: string;
}

export async function getSections(companyProfileId: string): Promise<Section[]> {
  const supabase = createClient();

  // First, fetch the company profile to ensure it exists
  const { data: companyProfile, error: companyError } = await supabase
    .from('company_profiles')
    .select('company_profile_id')
    .eq('company_profile_id', companyProfileId)
    .single();

  if (companyError) {
    console.error("Error fetching company profile:", companyError);
    throw new Error("Error fetching company profile");
  }

  if (!companyProfile) {
    console.log("No company profile found for ID:", companyProfileId);
    return [];
  }

  // Now fetch the sections using the company's primary key
  const { data: sections, error: sectionsError } = await supabase
    .from('custom_sections')
    .select('*')
    .eq('company_profile_id', companyProfile.company_profile_id);

  if (sectionsError) {
    console.error("Error fetching sections:", sectionsError);
    throw new Error("Error fetching sections");
  }

  if (!sections || sections.length === 0) {
    console.log("No sections found for company ID:", companyProfile.company_profile_id);
    return [];
  }

  return sections as Section[];
}