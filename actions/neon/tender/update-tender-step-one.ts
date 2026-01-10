"use server";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyProfile } from "@/actions/neon/company/get-current-company-profile";
import { z } from "zod";
import { SectorEnum } from "@/constant/text";
import { currencyEnum } from "@/types";
import { auth } from '@clerk/nextjs/server';

const stepOneSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string(),
  tenderSectors: z.array(z.nativeEnum(SectorEnum)),
  endDate: z.date({
    required_error: "A date is required",
  }),
  terms: z.string(),
  scopeOfWorks: z.string(),
  currency: currencyEnum, 
});

type StepOneData = z.infer<typeof stepOneSchema>;

export async function updateTenderStepOne(tenderId: string, formData: StepOneData) {
  try {
    const { userId } = await auth();
  
    if (!userId) {
      throw new Error("User not authenticated");
    }
  
    const companyProfile = await getCurrentCompanyProfile();
  
    if (!companyProfile) {
      throw new Error("Company profile not found");
    }

    // Validate the form data
    const validatedData = stepOneSchema.parse(formData);

    const updatedTender = await prisma.tender.update({
        where: { id: tenderId },
        data: {
            title: validatedData.title,
            summary: validatedData.summary,
            tenderSectors: validatedData.tenderSectors,
            endDate: validatedData.endDate,
            terms: validatedData.terms,
            scopeOfWorks: validatedData.scopeOfWorks,
            currency: validatedData.currency,
        }
    });

    revalidatePath('/tenders');

    return updatedTender;

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      throw new Error("Invalid form data: " + JSON.stringify(error.errors));
    }
    console.error("Error updating tender step one:", error);
    throw new Error("Failed to update tender");
  }
}
