'use server'

import { sendEmail } from "@/lib/utils/resend/send-emails";
import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';
import { z } from "zod";

const stepTwoSchema = z.object({
  pdf_url: z.string().url("Invalid PDF URL"),
  tender_id: z.string().optional(),
});

type StepTwoData = z.infer<typeof stepTwoSchema>;

export async function updateTenderStepTwo(formData: StepTwoData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    // Validate the form data
    const validatedData = stepTwoSchema.parse(formData);

    // Update the tender in the database
    const { data: updatedTender, error } = await supabase
      .from('tenders')
      .update({
        pdf_url: validatedData.pdf_url,
        isEnabled: true,
      })
      .eq('tender_id', validatedData.tender_id)
      .select('tender_id, title, tender_sectors')
      .single();

    if (error) {
      console.error("Supabase error details:", error);
      throw new Error(`Error updating tender: ${error.message}`);
    }

    // Get companies in the same sectors
    const { data: relatedCompanies, error: companiesError } = await supabase
      .from('company_profiles')
      .select('user_id')
      .contains('sectors', updatedTender.tender_sectors);

    if (companiesError) {
      console.error("Error fetching related companies:", companiesError);
    }

    if (relatedCompanies && relatedCompanies.length > 0) {
      // Get users associated with these companies
      const userIds = relatedCompanies.map(company => company.user_id);
      const { data: relatedUsers, error: usersError } = await supabase
        .from('users')
        .select('email')
        .in('id', userIds);

      if (usersError) {
        console.error("Error fetching related users:", usersError);
      }

      if (relatedUsers && relatedUsers.length > 0) {
        // Send email to related users
        const emails = relatedUsers.map(user => user.email);
        const tenderLink = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/tenders/${updatedTender.tender_id}`;
        
        await sendEmail({
          to: emails,
          title: `New Tender: ${updatedTender.title}`,
          body: `A new tender has been posted in the following sector(s): ${updatedTender.tender_sectors.join(', ')}. 
                 View it here: ${tenderLink}`
        });
      }
    }

    revalidatePath('/tenders'); // Adjust this path as needed
    return updatedTender;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      throw new Error("Invalid form data: " + JSON.stringify(error.errors));
    }
    console.error("Unexpected error:", error);
    throw error;
  }
}