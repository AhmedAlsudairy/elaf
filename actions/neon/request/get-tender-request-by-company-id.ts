'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentCompanyProfile } from "../company/get-current-company-profile";

export async function getTenderRequestsByCompanyProfileId(page = 0, pageSize = 9) {
  try {
    const companyProfile = await getCurrentCompanyProfile();

    if (!companyProfile) {
      return { success: false, error: "Company profile not found" };
    }
    
    // Check if companyProfileId is valid (it should be, if returned from getCurrentCompanyProfile)

    const [tenderRequests, count] = await prisma.$transaction([
      prisma.tenderRequest.findMany({
        where: {
          companyId: companyProfile.id,
        },
        include: {
          tender: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: page * pageSize,
        take: pageSize,
      }),
      prisma.tenderRequest.count({
        where: {
          companyId: companyProfile.id,
        },
      }),
    ]);

    return { 
      success: true, 
      data: tenderRequests,
      totalCount: count,
      nextPage: tenderRequests.length === pageSize ? page + 1 : null
    };
  } catch (error) {
      console.error("Error details:", error);
      return { success: false, error: `Error fetching tender requests` };
  }
}