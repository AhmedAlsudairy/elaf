'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from 'next/cache';

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
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    const { data, error } = await supabase.rpc('add_rating_and_update_statuses', {
      p_tender_id: tenderId,
      p_tender_request_id: tenderRequestId,
      p_rating_company_id: ratingCompanyId,
      p_rated_company_id: ratedCompanyId,
      p_quality: quality,
      p_communication: communication,
      p_experience: experience,
      p_deadline: deadline,
      p_comment: comment,
      p_anonymous: isAnonymous
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return { 
        success: false, 
        error: `Error calling function: ${error.message}`,
        details: error.details,
        hint: error.hint
      };
    }

    // Check the return value from the PostgreSQL function
    if (data && typeof data === 'string' && data.startsWith('ERROR:')) {
      console.error("PostgreSQL function error:", data);
      return {
        success: false,
        error: "Error in database operation",
        details: data
      };
    }

    console.log("PostgreSQL function result:", data);

    revalidatePath('/tenders');
    return { success: true, message: data };
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
  const supabase = createClient();

  const { data, error } = await supabase
    .from("company_profiles")
    .select(`
      avg_quality,
      avg_communication,
      avg_experience,
      avg_deadline,
      avg_overall_rating,
      number_of_ratings
    `)
    .eq("company_profile_id", companyProfileId)
    .single();

  if (error) {
    console.error("Error fetching company ratings:", error);
    return null;
  }

  if (!data) {
    console.log("Company ratings not found");
    return null;
  }

  return data;
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
  const supabase = createClient();

  // Fetch ratings
  const { data: ratings, error: ratingsError } = await supabase
    .from("company_ratings")
    .select("*")
    .eq("rated_company_id", ratedCompanyId)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (ratingsError) {
    console.error("Error fetching company ratings:", ratingsError);
    return null;
  }

  if (!ratings || ratings.length === 0) {
    console.log("No ratings found for this company");
    return null;
  }

  // Fetch company profiles for the rating companies
  const ratingCompanyIds = ratings.map(rating => rating.rating_company_id);
  const { data: companyProfiles, error: profilesError } = await supabase
    .from("company_profiles")
    .select("company_profile_id, company_title, profile_image")
    .in("company_profile_id", ratingCompanyIds);

  if (profilesError) {
    console.error("Error fetching company profiles:", profilesError);
    return null;
  }
console.log()
  // Create a map of company profiles for easy lookup
  const profileMap = new Map(companyProfiles?.map(profile => [profile.company_profile_id, profile]));

  // Combine ratings with company profiles
  const ratingsWithProfiles: RatingWithProfile[] = ratings.map(rating => ({
    ...rating,
    company_title: rating.anonymous ? "Anonymous Company" : (profileMap.get(rating.rating_company_id)?.company_title || "Unknown Company"),
    profile_image: rating.anonymous ? "" : (profileMap.get(rating.rating_company_id)?.profile_image || "")
  }));

  return ratingsWithProfiles;
}