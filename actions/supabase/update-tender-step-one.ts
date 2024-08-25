"use server";
import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyProfile } from "./get-current-company-profile";
import { z } from "zod";
import { SectorEnum } from "@/constant/text";
import { currencyEnum } from "@/types";

const stepOneSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string(),
  tender_sectors: z.array(z.nativeEnum(SectorEnum)),
  end_date: z.date({
    required_error: "A date is required",
  }),
  terms: z.string(),
  scope_of_works: z.string(),
  currency: currencyEnum, // Add the currency field

});

type StepOneData = z.infer<typeof stepOneSchema>;

export async function updateTenderStepOne(tenderId: string, formData: StepOneData) {
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

    // Update existing tender in the database
    const { data, error } = await supabase
      .from('tenders')
      .update({
        title: validatedData.title,
        summary: validatedData.summary,
        tender_sectors: validatedData.tender_sectors,
        end_date: validatedData.end_date.toISOString(),
        terms: validatedData.terms,
        scope_of_works: validatedData.scope_of_works,
        currency: validatedData.currency, // Add the currency field

      })
      .eq('tender_id', tenderId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Error updating tender: ${error.message}`);
    }

    if (!data) {
      throw new Error("No data returned after update");
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