'use server'

import { sendEmail } from "@/lib/utils/resend/send-emails";
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

export async function acceptTenderRequest(requestId: string, tenderId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update the request to ACCEPTED
      const updatedRequest = await tx.tenderRequest.update({
        where: { id: requestId },
        data: { status: 'accepted' },
        include: {
          company: true, 
          tender: true
        }
      });
      
      return updatedRequest;
    });

    if (result.company.companyEmail) {
        // Send email notification
        await sendEmail({
             to: [result.company.companyEmail],
             title: `Start chat with ${result.tender.title} Owner`,
             body: `Your request has been accepted. You can now chat with the owner.`
        });
    }

    revalidatePath('/tenders');
    revalidatePath(`/tenders/${tenderId}`);

    return { success: true };

  } catch (error) {
    console.error("Error accepting tender request:", error);
    return { success: false, error: error instanceof Error ? error.message : "Error accepting tender request" };
  }
}