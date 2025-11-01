"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentCompanyProfile() {
  const user = await currentUser();
  if (!user) {
    console.error("No authenticated user found.");
    return null;
  }

  const companyProfile = await prisma.company.findFirst({
    where: {
      companyEmail: user.emailAddresses[0]?.emailAddress,
    },
  });

  if (!companyProfile) {
    console.log("Company profile not found for:", user.emailAddresses[0]?.emailAddress);
    return null;
  }

  return companyProfile;
}
