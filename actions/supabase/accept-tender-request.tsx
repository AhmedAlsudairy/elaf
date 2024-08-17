'use server'

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

    revalidatePath('/tenders');
    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}