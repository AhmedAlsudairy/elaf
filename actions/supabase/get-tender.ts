'use server'

import { createClient } from "@/lib/utils/supabase/server";

export async function fetchTenderData(tenderId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tenders')
    .select(`
      *,
      company_profiles:company_profile_id (
        company_profile_id,
        company_title,
        company_email,
        profile_image
      )
    `)
    .eq('tender_id', tenderId)
    .single();

  if (error) {
    console.error('Error fetching tender data:', error);
    throw new Error('Failed to fetch tender data');
  }

  if (!data) {
    throw new Error('Tender not found');
  }

  const companyProfile = data.company_profiles;

  return {
    tender: {
      tender_id: data.tender_id,
      title: data.title,
      summary: data.summary,
      pdf_url: data.pdf_url,
      end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
      status: data.status,
      terms: data.terms,
      scope_of_works: data.scope_of_works,
      tender_sectors: data.tender_sectors,
      created_at: data.created_at ? new Date(data.created_at).toISOString() : null,
      average_price: data.average_price,
      maximum_price: data.maximum_price,
      minimum_price: data.minimum_price,
      currency: data.currency, // Add this line to include the currency
    },
    company: companyProfile ? {
      company_profile_id: companyProfile.company_profile_id,
      company_title: companyProfile.company_title,
      company_email: companyProfile.company_email,
      profile_image: companyProfile.profile_image,
    } : null,
  };
}