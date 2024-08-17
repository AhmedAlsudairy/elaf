'use server'
import { createClient } from "@/lib/utils/supabase/server";

interface DatabaseRequestSummary {
  id: string;
  bid_price: number;
  pdf_url: string | null;
  company_profiles: {
    company_title: string;
  }[];
}

export interface RequestSummary {
  id: string;
  company_title: string;
  bid_price: number;
  pdf_url: string | null;
}

export async function getRequestSummaries(tenderId: string, page: number, pageSize: number = 10): Promise<RequestSummary[]> {
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
    return [];
  }

  console.log("Fetched request summaries:", data);

  return (data as DatabaseRequestSummary[]).map(item => ({
    id: item.id,
    company_title: item.company_profiles[0]?.company_title || 'Unknown Company',
    bid_price: item.bid_price,
    pdf_url: item.pdf_url
  }));
}