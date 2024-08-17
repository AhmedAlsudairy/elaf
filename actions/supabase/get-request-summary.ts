'use server'
import { createClient } from "@/lib/utils/supabase/server";

export interface RequestSummary {
  id: string;
  company_title: string;
  bid_price: number;
  pdf_url: string | null;
  created_at?: string;
}

export async function getRequestSummaries(tenderId: string, page: number, pageSize: number = 10): Promise<{ success: boolean; data: RequestSummary[]; error: string | null }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tender_requests')
    .select(`
      id,
      bid_price,
      pdf_url,
      company_profiles:company_profile_id (company_title)
    `)
    .eq('tender_id', tenderId)
    .range(page * pageSize, (page + 1) * pageSize - 1)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching request summaries:", error);
    return { success: false, data: [], error: error.message };
  }

  try {
    const summaries: RequestSummary[] = (data || []).map((item: any) => ({
      id: item.id,
      company_title: item.company_profiles?.company_title || 'Unknown Company',
      bid_price: item.bid_price,
      pdf_url: item.pdf_url,
      created_at: item.created_at
    }));

    return { success: true, data: summaries, error: null };
  } catch (err) {
    console.error("Error processing request summaries:", err);
    return { success: false, data: [], error: 'Failed to process request summaries' };
  }
}