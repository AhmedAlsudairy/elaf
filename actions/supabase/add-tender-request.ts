'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyProfile } from "./get-current-company-profile";
import { TenderRequestFormValues } from "@/components/pages/user/tenders/requesttender/request-tender-form";
import { sendEmail } from "@/lib/utils/resend/send-emails";

export async function addTenderRequest(tender_Id: string, formData: TenderRequestFormValues) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const currentCompanyProfile = await getCurrentCompanyProfile();

  if (!currentCompanyProfile) {
    return { success: false, error: "Company profile not found" };
  }

  try {
    // Call the Supabase function
    const { data, error } = await supabase.rpc('add_tender_request', {
      p_tender_id: tender_Id,
      p_company_profile_id: currentCompanyProfile.company_profile_id,
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

    // Fetch tender details
    const { data: tenderData, error: tenderError } = await supabase
      .from('tenders')
      .select(`
        title,
        company_profile_id
      `)
      .eq('tender_id', tender_Id)
      .single();

    if (tenderError) {
      console.error("Error fetching tender details:", tenderError);
      return { success: false, error: "Error fetching tender details" };
    }

    // Fetch owner's email using the company_profile_id
    const { data: companyProfileData, error: companyProfileError } = await supabase
      .from('company_profiles')
      .select('user_id')
      .eq('company_profile_id', tenderData.company_profile_id)
      .single();

    if (companyProfileError) {
      console.error("Error fetching company profile:", companyProfileError);
      return { success: false, error: "Error fetching company profile" };
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', companyProfileData.user_id)
      .single();

    if (userError) {
      console.error("Error fetching owner's email:", userError);
      return { success: false, error: "Error fetching owner's email" };
    }

    // Send email to tender owner
    const tenderLink = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/tenders/${tender_Id}`;
    await sendEmail({
      to: [userData.email],
      title: `New Bid for Your Tender: ${tenderData.title}`,
      body: `You have received a new bid for your tender "${tenderData.title}". 
             View the tender and its bids here: ${tenderLink}`
    });

    revalidatePath('/tenders');
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}