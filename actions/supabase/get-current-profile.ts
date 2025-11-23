'use server'
import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server';

export async function getCurrentProfiles() {
  const user = await currentUser();

  if (!user) {
    console.error('No authenticated user found');
    return { userProfile: null, companyProfile: null };
  }

  // Get user profile from Prisma
  const userProfileData = await prisma.userProfile.findUnique({
    where: {
      clerkUserId: user.id,
    },
  });

  if (!userProfileData) {
    return { userProfile: null, companyProfile: null };
  }

  // Create userProfile in the expected format
  const userProfile = {
    id: userProfileData.id,
    email: userProfileData.email,
    name: userProfileData.name,
    profile_image: userProfileData.profileImage,
    role: userProfileData.role,
    phone_number: userProfileData.phoneNumber,
    address: userProfileData.address,
    bio: userProfileData.bio,
    company_that_worked_with: userProfileData.companyThatWorkedWith,
  };

  // Fetch company profile - try by companyId first, then by email
  let companyProfile = null;
  let company = null;

  if (userProfileData.companyId) {
    company = await prisma.company.findUnique({
      where: {
        id: userProfileData.companyId,
      },
    });
  }

  // If not found by companyId, try by email (matching getCurrentCompanyProfile logic)
  if (!company && user.emailAddresses[0]?.emailAddress) {
    company = await prisma.company.findFirst({
      where: {
        companyEmail: user.emailAddresses[0].emailAddress,
      },
    });
  }

  if (company) {
    // Return company with both id and company_profile_id for compatibility
    companyProfile = {
      id: company.id,
      company_profile_id: company.id, // Use id as company_profile_id for compatibility
      company_title: company.companyTitle,
    };
  }

  return { userProfile, companyProfile };
}