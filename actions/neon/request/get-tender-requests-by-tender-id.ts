'use server'

import { TenderRequest } from "@/components/pages/user/tenders/requesttender/tender-req-main-card";
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server';

export async function getRequestsByTenderId(tenderId: string, page = 0, pageSize = 9): Promise<{ 
  success: boolean; 
  error?: string; 
  data: TenderRequest[];
  nextPage: number | null;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "User not authenticated", data: [], nextPage: null };
  }

  try {
    const requests = await prisma.tenderRequest.findMany({
        where: { tenderId: tenderId },
        include: {
            company: true
        },
        skip: page * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
    });

    const totalCount = await prisma.tenderRequest.count({
        where: { tenderId: tenderId }
    });

    const mappedRequests: TenderRequest[] = requests.map(req => ({
        id: req.id,
        tender_id: req.tenderId, // Mapped from camelCase to snake_case
        company_profile_id: req.companyId,
        created_at: req.createdAt.toISOString(),
        updated_at: req.updatedAt.toISOString(),
        status: req.status as any,
        bid_price: req.price || 0,
        days: req.days || 0,
        description: req.description || "",
        title:  "",
        summary: "",
        company_profile: {
            company_title: req.company.companyTitle,
            profile_image: req.company.profileImage || "",
            avg_overall_rating: req.company.avgOverallRating,
            number_of_ratings: req.company.numberOfRatings
        }
    }));
      
    const hasMore = (page + 1) * pageSize < totalCount;

    return { 
        success: true, 
        data: mappedRequests, 
        nextPage: hasMore ? page + 1 : null 
    };

  } catch (error) {
    console.error("Error fetching requests:", error);
    return { success: false, error: "Error fetching requests", data: [], nextPage: null };
  }
}