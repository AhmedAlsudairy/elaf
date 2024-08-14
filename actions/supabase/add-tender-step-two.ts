'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';
import { z } from "zod";

const stepTwoSchema = z.object({
  pdf_url: z.string().url("Invalid PDF URL"),
  tender_id: z.string()
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
    const { data, error } = await supabase
      .from('tenders')
      .update({
        pdf_url: validatedData.pdf_url,
        isEnabled: true,
      })
      .eq('tender_id', validatedData.tender_id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error details:", error);
      throw new Error(`Error updating tender: ${error.message}`);
    }

    revalidatePath('/tenders'); // Adjust this path as needed
    return data;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      throw new Error("Invalid form data: " + JSON.stringify(error.errors));
    }
    console.error("Unexpected error:", error);
    throw error;
  }
}