"use server";
import { prisma } from '@/lib/prisma'

export async function getCompanyProfileById(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      console.log("Company profile not found");
      return null;
    }

    // Return Prisma model directly (matches CompanyProfile structure)
    return {
      id: company.id,
      companyProfileId: company.companyProfileId || undefined,
      companyTitle: company.companyTitle,
      companyNumber: company.companyNumber || undefined,
      companyWebsite: company.companyWebsite || undefined,
      companyEmail: company.companyEmail,
      sectors: company.sectors || undefined,
      bio: company.bio || undefined,
      phoneNumber: company.phoneNumber || undefined,
      address: company.address || undefined,
      profileImage: company.profileImage || undefined,
    };
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }
}