'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';

interface AddRatingParams {
  tenderId: string;
  tenderRequestId: string;
  companyProfileId: string;
  quality: number;
  communication: number;
  experience: number;
  deadline: number;
  comment: string;
  isAnonymous: boolean;
}

export async function addRating({
  tenderId,
  tenderRequestId,
  companyProfileId,
  quality,
  communication,
  experience,
  deadline,
  comment,
  isAnonymous
}: AddRatingParams) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const { data, error } = await supabase.rpc('add_rating_and_update_statuses', {
      p_tender_id: tenderId,
      p_tender_request_id: tenderRequestId,
      p_company_profile_id: companyProfileId,
      p_quality: quality,
      p_communication: communication,
      p_experience: experience,
      p_deadline: deadline,
      p_comment: comment,
      p_anonymous: isAnonymous
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return { 
        success: false, 
        error: `Error calling function: ${error.message}`,
        details: error.details,
        hint: error.hint
      };
    }

    // Check the return value from the PostgreSQL function
    if (data && data.startsWith('ERROR:')) {
      console.error("PostgreSQL function error:", data);
      return {
        success: false,
        error: "Error in database operation",
        details: data
      };
    }

    console.log("PostgreSQL function result:", data);

    revalidatePath('/tenders');
    return { success: true, message: data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred",
      details: error instanceof Error ? error.message : String(error)
    };
  }
}