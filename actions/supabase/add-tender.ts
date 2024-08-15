'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyProfile } from "./get-current-company-profile";
import { z } from "zod";
import { SectorEnum } from "@/constant/text";

const stepOneSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string(),
  end_date: z.date({
    required_error: "A date is required",
  }),
  terms: z.string(),
  scope_of_works: z.string(),
  Tender_sectors: z.array(z.nativeEnum(SectorEnum)),
});

type StepOneData = z.infer<typeof stepOneSchema>;

export async function addTenderStepOne(formData: StepOneData) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const companyProfile = await getCurrentCompanyProfile();

  if (!companyProfile) {
    throw new Error("Company profile not found");
  }

  try {
    // Validate the form data
    const validatedData = stepOneSchema.parse(formData);

    // Insert new tender into the database
    const { data, error } = await supabase
      .from('tenders')
      .upsert({
        company_profile_id: companyProfile.company_profile_id,
        title: validatedData.title,
        summary: validatedData.summary,
        Tender_sectors: validatedData.Tender_sectors,
        end_date: validatedData.end_date.toISOString(),
        terms: validatedData.terms,
        scope_of_works: validatedData.scope_of_works,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error details:", error);
      throw new Error(`Error adding new tender: ${error.message}`);
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