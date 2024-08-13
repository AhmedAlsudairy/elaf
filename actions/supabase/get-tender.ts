'use server'

import { createClient } from "@/lib/utils/supabase/server";

export async function fetchTenderData(tenderId:string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('tenders')
    .select('*')
    .eq('tender_id', tenderId)
    .single();

  if (error) {
    console.error('Error fetching tender data:', error);
    throw new Error('Failed to fetch tender data');
  }

  return {
    ...data,
    end_date: new Date(data.end_date), // Convert string to Date object
    custom_fields: data.custom_fields || [{ title: '', description: '' }],
  };
}