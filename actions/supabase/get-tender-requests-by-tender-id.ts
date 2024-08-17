'use server'

import { TenderRequest } from "@/components/pages/user/tenders/request_tender/tender-req-main-card";
import { createClient } from "@/lib/utils/supabase/server";

export async function getRequestsByTenderId(tenderId: string, page = 0, pageSize = 9): Promise<{ 
  success: boolean; 
  error?: string; 
  data: TenderRequest[];
  nextPage: number | null;
}> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated", data: [], nextPage: null };
  }

  try {
    const { data, error, count } = await supabase
      .from('tender_requests')
      .select(`
        *,
        company_profile:company_profiles(
          company_profile_id,
          id,
          user_id,
          created_at,
          updated_at,
          company_title,
          company_number,
          company_website,
          bio,
          phone_number,
          address,
          profile_image,
          company_email,
          sectors
        )
      `, { count: 'exact' })
      .eq('tender_id', tenderId)
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      console.error("Supabase error details:", error);
      return { 
        success: false, 
        error: `Error fetching tender requests: ${error.message}`, 
        data: [],
        nextPage: null
      };
    }

    const nextPage = (count && (page + 1) * pageSize < count) ? page + 1 : null;

    return { 
      success: true, 
      data: data as TenderRequest[],
      nextPage
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred", 
      data: [],
      nextPage: null
    };
  }
}