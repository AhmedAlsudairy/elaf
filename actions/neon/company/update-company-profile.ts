'use server'

import { prisma } from '@/lib/prisma'
import { CompanyProfile } from "@/types";
import { revalidatePath } from "next/cache";
import { auth } from '@clerk/nextjs/server';

export async function updateProfile(profile: CompanyProfile) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("Unauthorized");
        }
  
        if (!profile.id) {
            throw new Error("Company ID is required for update");
        }

        const data = await prisma.company.update({
            where: { id: profile.id },
            data: {
                companyTitle: profile.companyTitle,
                companyNumber: profile.companyNumber,
                companyWebsite: profile.companyWebsite,
                companyEmail: profile.companyEmail,
                phoneNumber: profile.phoneNumber,
                address: profile.address,
                bio: profile.bio,
                profileImage: profile.profileImage,
                sectors: profile.sectors as any,
            }
        });
  
        revalidatePath('/company-profile');
        return data; 
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }
}
  