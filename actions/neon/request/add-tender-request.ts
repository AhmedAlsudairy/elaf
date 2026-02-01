"use server";

import { prisma } from '@/lib/prisma'
import { revalidatePath } from "next/cache";
import { getCurrentCompanyProfile } from "../company/get-current-company-profile";
import { TenderRequestFormValues } from "@/components/pages/user/tenders/requesttender/request-tender-form";
import { sendEmail } from "@/lib/utils/resend/send-emails";
import { auth } from "@clerk/nextjs/server";

export async function addTenderRequest(
  tender_Id: string,
  formData: TenderRequestFormValues
) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  const currentCompanyProfile = await getCurrentCompanyProfile();

  if (!currentCompanyProfile) {
    return { success: false, error: "Company profile not found" };
  }

  try {
    // Check if request already exists
    const existingRequest = await prisma.tenderRequest.findFirst({
        where: {
            tenderId: tender_Id,
            companyId: currentCompanyProfile.id 
        }
    });

    if (existingRequest) {
        return {
          success: false,
          error: "You already have a request for this tender",
        };
    }

    // Create Request
    const tenderRequest = await prisma.tenderRequest.create({
      data: {
        tenderId: tender_Id,
        companyId: currentCompanyProfile.id,
        price: formData.bid_price,
        description: formData.summary,
        // pdf_url: formData.pdf_url,
        // title: formData.title,
      },
      include: {
        tender: {
          include: {
             company: true
          }
        }
      }
    });

    // Notify Owner
    if (tenderRequest.tender.company?.companyEmail) {
       const tenderLink = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/tenders/${tender_Id}`;
       await sendEmail({
         to: [tenderRequest.tender.company.companyEmail],
         title: `New Bid for Your Tender: ${tenderRequest.tender.title}`,
         body: `You have received a new bid for your tender "${tenderRequest.tender.title}". 
             View the tender and its bids here: ${tenderLink}`
       });
    }

    revalidatePath("/tenders");
    return { success: true };

  } catch (error) {
    console.error("Error adding tender request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error adding new tender request",
    };
  }
}
