'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { getCurrentCompanyProfile } from "./get-current-company-profile";

export async function getTenderRequestsByCompanyProfileId(page = 0, pageSize = 9) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const companyProfile = await getCurrentCompanyProfile();

  if (!companyProfile) {
    return { success: false, error: "Company profile not found" };
  }

  try {
    const { data, error, count } = await supabase
      .from('tender_requests')
      .select(`
        *,
        tender:tenders(
          tender_id,
          id,
          title,
          summary,
          pdf_url,
          end_date,
          status,
          average_price,
          maximum_price,
          minimum_price,
          created_at,
          updated_at,
          terms,
          scope_of_works,
          isEnabled,
          tender_sectors
        )
      `, { count: 'exact' })
      .eq('company_profile_id', companyProfile.company_profile_id)
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error("Supabase error details:", error);
      return { success: false, error: `Error fetching tender requests: ${error.message}` };
    }

    return { 
      success: true, 
      data,
      totalCount: count,
      nextPage: data.length === pageSize ? page + 1 : null
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}