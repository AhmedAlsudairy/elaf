'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getCurrentCompanyProfile } from "@/actions/neon/company/get-current-company-profile";
import { currentUser } from '@clerk/nextjs/server';

export async function addSection(formData: FormData) {
    const user = await currentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
  
    const companyProfile = await getCurrentCompanyProfile();
  
    if (!companyProfile) {
      throw new Error("Company profile not found");
    }
  
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fileUrl = formData.get('fileUrl') as string;
  
    if (!title || !description || !fileUrl) {
      throw new Error("Missing required fields");
    }

    const tabName = title.toLowerCase().replace(/\s+/g, '-');
  
    // Insert new section into the database
    const newSection = await prisma.customSection.create({
      data: {
        companyProfileId: companyProfile.id,
        title,
        description,
        fileUrl,
        tabName
      }
    });
  
    if (!newSection) {
      throw new Error("Error adding new section");
    }
  
    revalidatePath('/company-profile');
    return {
        id: newSection.id,
        title: newSection.title,
        description: newSection.description,
        fileUrl: newSection.fileUrl,
        tabName: newSection.tabName,
        companyProfileId: newSection.companyProfileId
    };
}