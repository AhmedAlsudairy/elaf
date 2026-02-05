'use server'

import { sendEmail } from "@/lib/utils/resend/send-emails"
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from "zod"

const stepTwoSchema = z.object({
  pdfUrl: z.string().url("Invalid PDF URL"),
  tenderId: z.string(),
})

type StepTwoData = z.infer<typeof stepTwoSchema>

export async function updateTenderStepTwo(formData: StepTwoData) {
  try {
    const validatedData = stepTwoSchema.parse(formData)

    const updatedTender = await prisma.tender.update({
      where: { id: validatedData.tenderId },
      data: { pdfUrl: validatedData.pdfUrl },
      select: {
        id: true,
        title: true,
        tenderSectors: true,
        company: {
          select: {
            users: {
              select: { email: true }
            }
          }
        }
      }
    })

    // Get companies with matching sectors
    const relatedCompanies = await prisma.company.findMany({
      where: {
        sectors: { hasSome: updatedTender.tenderSectors }
      },
      select: {
        users: { select: { email: true } }
      }
    })

    // Send emails
    const emails = relatedCompanies.flatMap(c => c.users.map(u => u.email))
    
    if (emails.length > 0) {
      const tenderLink = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/tenders/${updatedTender.id}`
      
      await sendEmail({
        to: emails,
        title: `New Tender: ${updatedTender.title}`,
        body: `A new tender has been posted in: ${updatedTender.tenderSectors.join(', ')}. View: ${tenderLink}`
      })
    }

    revalidatePath('/tenders')
    return { success: true, id: updatedTender.id }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Invalid form data: " + JSON.stringify(error.errors))
    }
    throw error
  }
}