'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyProfile } from "./get-current-company-profile";
import { TenderRequestFormValues } from "@/components/pages/user/tenders/requesttender/request-tender-form";

export async function addTenderRequest(tender_Id: string, formData: TenderRequestFormValues) {
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
    // Call the Supabase function
    const { data, error } = await supabase.rpc('add_tender_request', {
      p_tender_id: tender_Id,
      p_company_profile_id: companyProfile.company_profile_id,
      p_title: formData.title,
      p_bid_price: formData.bid_price,
      p_summary: formData.summary,
      p_pdf_url: formData.pdf_url
    });

    if (error) {
      console.error("Supabase error details:", error);
      if (error.message.includes("A request for this tender already exists")) {
        return { success: false, error: "You already have a request for this tender" };
      }
      return { success: false, error: `Error adding new tender request: ${error.message}` };
    }

    revalidatePath('/tenders');
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}