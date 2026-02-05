

'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { currentUser } from '@clerk/nextjs/server';

interface AddRatingParams {
  tenderId: string;
  tenderRequestId: string;
  ratingCompanyId: string;
  ratedCompanyId: string;
  quality: number;
  communication: number;
  experience: number;
  deadline: number;
  comment: string;
  isAnonymous: boolean;
}

export async function addRating({
  tenderId,
  tenderRequestId,
  ratingCompanyId,
  ratedCompanyId,
  quality,
  communication,
  experience,
  deadline,
  comment,
  isAnonymous
}: AddRatingParams) {
  const user = await currentUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Calculate overall rating
      const overallRating = (quality + communication + experience + deadline) / 4;

      // 2. Create Rating
      await tx.companyRating.create({
        data: {
          tenderId,
          tenderRequestId,
          ratingCompanyId,
          ratedCompanyId,
          quality,
          communication,
          experience,
          deadline,
          overallRating,
          comment,
          isAnonymous
        }
      });

      // 3. Update Tender Request Status
      // Assuming 'COMPLETED' is the desired status after rating
      await tx.tenderRequest.update({
        where: { id: tenderRequestId },
        data: { status: 'COMPLETED' }
      });

      // 4. Update Company Averages
      const company = await tx.company.findUnique({
        where: { id: ratedCompanyId },
        select: {
          avgQuality: true,
          avgCommunication: true,
          avgExperience: true,
          avgDeadline: true,
          avgOverallRating: true,
          numberOfRatings: true
        }
      });

      if (company) {
        const count = company.numberOfRatings;
        const newCount = count + 1;

        // Calculate new moving averages
        // Formula: newAvg = ((oldAvg * oldCount) + newValue) / newCount
        const newAvgQuality = ((company.avgQuality * count) + quality) / newCount;
        const newAvgCommunication = ((company.avgCommunication * count) + communication) / newCount;
        const newAvgExperience = ((company.avgExperience * count) + experience) / newCount;
        const newAvgDeadline = ((company.avgDeadline * count) + deadline) / newCount;
        
        // Recalculate overall from the new component averages
        const newOverallFromAvg = (newAvgQuality + newAvgCommunication + newAvgExperience + newAvgDeadline) / 4;

        await tx.company.update({
          where: { id: ratedCompanyId },
          data: {
            numberOfRatings: newCount,
            avgQuality: newAvgQuality,
            avgCommunication: newAvgCommunication,
            avgExperience: newAvgExperience,
            avgDeadline: newAvgDeadline,
            avgOverallRating: newOverallFromAvg
          }
        });
      }
      
      return "Rating added successfully";
    });

    // Revalidate paths
    revalidatePath('/tenders');
    return { success: true, message: result };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { 
      success: false, 
      error: "An unexpected error occurred",
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function getCompanyRatings(companyProfileId: string) {
  try {
    const data = await prisma.company.findUnique({
      where: { id: companyProfileId },
      select: {
        avgQuality: true,
        avgCommunication: true,
        avgExperience: true,
        avgDeadline: true,
        avgOverallRating: true,
        numberOfRatings: true
      }
    });

    if (!data) {
      console.log("Company ratings not found");
      return null;
    }

    return {
      avg_quality: data.avgQuality,
      avg_communication: data.avgCommunication,
      avg_experience: data.avgExperience,
      avg_deadline: data.avgDeadline,
      avg_overall_rating: data.avgOverallRating,
      number_of_ratings: data.numberOfRatings
    };
  } catch (error) {
    console.error("Error fetching company ratings:", error);
    return null;
  }
}

interface RatingWithProfile {
  id: string;
  rating_company_id: string;
  quality: number;
  communication: number;
  experience: number;
  deadline: number;
  overall_rating: number;
  comment: string;
  created_at: string;
  anonymous: boolean;
  company_title: string;
  profile_image: string;
}

export async function getCompanyRatingsWithProfiles(
  ratedCompanyId: string,
  page: number = 0,
  limit: number = 10
): Promise<RatingWithProfile[] | null> {
  try {
    const ratings = await prisma.companyRating.findMany({
      where: { ratedCompanyId: ratedCompanyId },
      include: {
        ratingCompany: {
          select: {
            id: true,
            companyTitle: true,
            profileImage: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: page * limit,
      take: limit
    });

    if (!ratings || ratings.length === 0) {
      console.log("No ratings found for this company");
      return null;
    }

    const ratingsWithProfiles: RatingWithProfile[] = ratings.map(rating => ({
      id: rating.id,
      rating_company_id: rating.ratingCompanyId,
      quality: rating.quality,
      communication: rating.communication,
      experience: rating.experience,
      deadline: rating.deadline,
      overall_rating: rating.overallRating,
      comment: rating.comment || "",
      created_at: rating.createdAt.toISOString(),
      anonymous: rating.isAnonymous,
      company_title: rating.isAnonymous ? "Anonymous Company" : (rating.ratingCompany?.companyTitle || "Unknown Company"),
      profile_image: rating.isAnonymous ? "" : (rating.ratingCompany?.profileImage || "")
    }));

    return ratingsWithProfiles;
  } catch (error) {
    console.error("Error fetching company ratings:", error);
    return null;
  }
}