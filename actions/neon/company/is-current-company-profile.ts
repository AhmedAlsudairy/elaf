"use server";

import { prisma } from '@/lib/prisma'
import { auth } from "@clerk/nextjs/server";

export async function isCurrentUserCompanyProfile(companyId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return false;
    }

    // Check if companyId matches Company.id (UUID)
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { companyProfileId: true },
    });

    if (company) {
      return company.companyProfileId === userId;
    }

    // Check if companyId matches Company.companyProfileId (Clerk ID)
    const companyByProfileId = await prisma.company.findUnique({
      where: { companyProfileId: companyId },
      select: { companyProfileId: true },
    });

    if (companyByProfileId) {
      return companyByProfileId.companyProfileId === userId;
    }

    return false;
  } catch (error) {
    console.error("Error checking isCurrentUserCompanyProfile:", error);
    return false;
  }
}