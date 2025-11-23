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

    // Transform Prisma model to match expected CompanyProfile type
    return {
      company_profile_id: company.id, // Use id as company_profile_id for compatibility
      profile_image: company.profileImage,
      company_title: company.companyTitle,
      bio: company.bio,
      company_number: company.companyNumber,
      company_website: company.companyWebsite,
      company_email: company.companyEmail,
      phone_number: company.phoneNumber,
      address: company.address,
      sectors: company.sectors,
    };
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }
}