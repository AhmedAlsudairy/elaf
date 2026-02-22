// actions/neon/company/get-suggested-companies.ts
"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getSuggestedCompanies() {
  const user = await currentUser();
  if (!user) return [];

  const userProfile = await prisma.userProfile.findUnique({
    where: { clerkUserId: user.id }, // 👈 clerkUserId not clerkId
    select: { 
      id: true,
      companyId: true,
      following: {
        select: { followingId: true }
      }
    },
  });

  // IDs of companies already followed
  const followedIds = userProfile?.following.map((f) => f.followingId) ?? [];

  const companies = await prisma.company.findMany({
    where: {
      AND: [
        // Exclude user's own company
        userProfile?.companyId ? { id: { not: userProfile.companyId } } : {},
        // Exclude already followed companies
        followedIds.length > 0 ? { id: { notIn: followedIds } } : {},
      ],
    },
    select: {
      id: true,
      companyTitle: true,
      profileImage: true,
      sectors: true,
    },
    take: 20,
  });

  return companies
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);
}