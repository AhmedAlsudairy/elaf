'use server'

import { createClient } from "@/lib/utils/supabase/server";

interface CompanyProfile {
  company_profile_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  company_title: string;
  company_number: string;
  company_website: string;
  bio: string;
  phone_number: string;
  address: string;
  profile_image: string;
  company_email: string;
  sectors: string[];
}

interface CompanyProfilesSuccess {
  success: true;
  data: CompanyProfile[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
}

interface CompanyProfilesError {
  success: false;
  error: string;
}

type CompanyProfilesResult = CompanyProfilesSuccess | CompanyProfilesError;

export async function getCompanyProfiles(
  formData: FormData
): Promise<CompanyProfilesResult> {
  const supabase = createClient();

  const searchTerm = formData.get('searchTerm')?.toString() || '';
  const page = parseInt(formData.get('page')?.toString() || '1', 10);
  const pageSize = parseInt(formData.get('pageSize')?.toString() || '10', 10);

  try {
    const { data, error } = await supabase.rpc('get_company_profiles', {
      search_term: searchTerm,
      page_number: page,
      page_size: pageSize
    });

    if (error) throw new Error(error.message);

    if (!data || !('success' in data) || !data.success) {
      throw new Error('Invalid response from server');
    }

    return data as CompanyProfilesSuccess;
  } catch (error) {
    console.error('Error fetching company profiles:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    };
  }
}