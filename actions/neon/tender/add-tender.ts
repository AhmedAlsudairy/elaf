'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getCurrentCompanyProfile } from "../company/get-current-company-profile"
import { z } from "zod"
import { SectorEnum, Currency } from "@prisma/client"

const stepOneSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string(),
  endDate: z.date({ required_error: "A date is required" }),
  terms: z.string(),
  scopeOfWorks: z.string(),
  tenderSectors: z.array(z.nativeEnum(SectorEnum)),
  currency: z.nativeEnum(Currency),
})

type StepOneData = z.infer<typeof stepOneSchema>

export async function addTenderStepOne(formData: StepOneData) {
  const companyProfile = await getCurrentCompanyProfile()

  if (!companyProfile) {
    throw new Error("Company profile not found")
  }

  try {
    const validatedData = stepOneSchema.parse(formData)

    const tender = await prisma.tender.create({
      data: {
        companyId: companyProfile.id,
        title: validatedData.title,
        summary: validatedData.summary,
        tenderSectors: validatedData.tenderSectors,
        endDate: validatedData.endDate,
        terms: validatedData.terms,
        scopeOfWorks: validatedData.scopeOfWorks,
        currency: validatedData.currency,
        pdfUrl: '', // Will be updated in step 2
        pdfChoice: 'upload' // Default value
      },
      select: {
        id: true,
      }
    })

    revalidatePath('/tenders')
    return { id: tender.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid form data: " + JSON.stringify(error.errors))
    }
    throw error
  }
}