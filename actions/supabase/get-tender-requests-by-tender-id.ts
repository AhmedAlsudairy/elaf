'use server'

import { TenderRequest } from "@/components/pages/user/tenders/requesttender/tender-req-main-card";
import { prisma } from '@/lib/prisma'
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
          profile_image,
          company_title,
          avg_overall_rating,
          number_of_ratings
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

    // Ensure that avg_overall_rating and number_of_ratings are numbers
    const processedData = data.map(item => ({
      ...item,
      company_profile: {
        ...item.company_profile,
        avg_overall_rating: Number(item.company_profile.avg_overall_rating) || 0,
        number_of_ratings: Number(item.company_profile.number_of_ratings) || 0
      }
    }));

    return { 
      success: true, 
      data: processedData as TenderRequest[],
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