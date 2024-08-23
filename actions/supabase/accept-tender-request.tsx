'use server'

import { sendEmail } from "@/lib/utils/resend/send-emails";
import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';

export async function acceptTenderRequest(requestId: string, tenderId: string) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    // Start a Supabase transaction
    const { data, error } = await supabase.rpc('accept_tender_request', {
      p_request_id: requestId,
      p_tender_id: tenderId
    });

    if (error) {
      console.error("Supabase error details:", error);
      return { success: false, error: `Error accepting tender request: ${error.message}` };
    }

    // Fetch tender details
    const { data: tenderData, error: tenderError } = await supabase
      .from('tenders')
      .select('title')
      .eq('tender_id', tenderId)
      .single();

    if (tenderError) {
      console.error("Error fetching tender details:", tenderError);
      return { success: false, error: "Error fetching tender details" };
    }

    // Fetch accepted company's user email
    const { data: acceptedRequestData, error: acceptedRequestError } = await supabase
      .from('tender_requests')
      .select('company_profile_id')
      .eq('id', requestId)
      .single();

    if (acceptedRequestError) {
      console.error("Error fetching accepted request details:", acceptedRequestError);
      return { success: false, error: "Error fetching accepted request details" };
    }

    const { data: acceptedCompanyData, error: companyError } = await supabase
      .from('company_profiles')
      .select('user_id')
      .eq('company_profile_id', acceptedRequestData.company_profile_id)
      .single();

    if (companyError) {
      console.error("Error fetching accepted company data:", companyError);
      return { success: false, error: "Error fetching accepted company data" };
    }

    const { data: acceptedUserData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', acceptedCompanyData.user_id)
      .single();

    if (userError) {
      console.error("Error fetching accepted user email:", userError);
      return { success: false, error: "Error fetching accepted user email" };
    }

    // Send acceptance email
    await sendEmail({
      to: [acceptedUserData.email],
      title: `Congratulations! Your tender request has been accepted`,
      body: `Your tender request for "${tenderData.title}" has been accepted. Visit ${process.env.NEXT_PUBLIC_WEBSITE_URL}/tender/${tenderId} for more details.`
    });

    // Fetch and email rejected companies' users
    const { data: rejectedRequests, error: rejectedRequestsError } = await supabase
      .from('tender_requests')
      .select('company_profile_id')
      .eq('tender_id', tenderId)
      .neq('id', requestId);

    if (rejectedRequestsError) {
      console.error("Error fetching rejected requests:", rejectedRequestsError);
    } else {
      for (const rejectedRequest of rejectedRequests) {
        const { data: rejectedCompanyData } = await supabase
          .from('company_profiles')
          .select('user_id')
          .eq('company_profile_id', rejectedRequest.company_profile_id)
          .single();

        if (rejectedCompanyData) {
          const { data: rejectedUserData } = await supabase
            .from('users')
            .select('email')
            .eq('id', rejectedCompanyData.user_id)
            .single();

          if (rejectedUserData) {
            await sendEmail({
              to: [rejectedUserData.email],
              title: `Update on your tender request`,
              body: `We regret to inform you that your tender request for "${tenderData.title}" was not accepted. Visit ${process.env.NEXT_PUBLIC_WEBSITE_URL}/tender/${tenderId} for more information.`
            });
          }
        }
      }
    }

    revalidatePath('/tenders');
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}