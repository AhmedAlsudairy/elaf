"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentCompanyProfile() {
  const user = await currentUser();
  if (!user) {
    console.error("No authenticated user found.");
    return null;
  }

  // First, try to find company via user's companyId relation
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      clerkUserId: user.id,
    },
    include: {
      company: true,
    },
  });

  if (userProfile?.company) {
    console.log("Company found via userProfile.companyId:", userProfile.company.id);
    return userProfile.company;
  }

  // Fallback: try to find by email
  const companyProfile = await prisma.company.findFirst({
    where: {
      companyEmail: user.emailAddresses[0]?.emailAddress,
    },
  });

  if (companyProfile) {
    console.log("Company found via email:", companyProfile.id);
    return companyProfile;
  }

  console.log("Company profile not found for user:", user.emailAddresses[0]?.emailAddress);
  return null;
}
