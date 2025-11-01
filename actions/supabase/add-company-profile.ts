"use server";

import { prisma } from '@/lib/prisma';
import { companySchema } from '@/schema';
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { z } from 'zod';

type CompanyFormData = z.infer<typeof companySchema>;

export async function addCompany(data: CompanyFormData) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return { 
        success: false, 
        error: "User not authenticated" 
      };
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return { 
        success: false, 
        error: "User email not found" 
      };
    }

    // Validate the data
    const validatedData = companySchema.parse(data);

    // Check if company with this email already exists
    const existingCompany = await prisma.company.findUnique({
      where: { companyEmail: validatedData.companyEmail }
    });

    if (existingCompany) {
      return { 
        success: false, 
        error: "A company with this email already exists" 
      };
    }

    // Create company and link to user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the company
      const company = await tx.company.create({
        data: {
          companyTitle: validatedData.company_title,
          companyEmail: validatedData.company_email,
          companyWebsite: validatedData.company_website || null,
          companyNumber: validatedData.company_number || null,
          bio: validatedData.bio || null,
          sectors: validatedData.sectors || [],
          phoneNumber: validatedData.phone_number || null,
          address: validatedData.address || null,
          profileImage: validatedData.profile_image || null,
          companyProfileId: userId,
        },
      });

      // Find or create user profile
      let userProfile = await tx.userProfile.findUnique({
        where: { clerkUserId: userId }
      });

      if (!userProfile) {
        // Create user profile if doesn't exist
        userProfile = await tx.userProfile.create({
          data: {
            clerkUserId: userId,
            email: userEmail,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || userEmail,
            profileImage: user.imageUrl || null,
            companyId: company.id
          }
        });
      } else {
        // Update existing user profile to link to company
        await tx.userProfile.update({
          where: { id: userProfile.id },
          data: { companyId: company.id }
        });
      }

      return company;
    });

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/chats");

    return { 
      success: true, 
      data: result 
    };
  } catch (error) {
    console.error("Error creating company:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Invalid form data: " + error.errors.map(e => e.message).join(", ")
      };
    }

    return { 
      success: false, 
      error: "Failed to create company profile" 
    };
  }
}

export async function updateCompany(companyId: string, data: CompanyFormData) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { 
        success: false, 
        error: "User not authenticated" 
      };
    }

    // Validate the data
    const validatedData = companySchema.parse(data);

    // Verify user owns this company
    const userProfile = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId },
      include: { company: true }
    });

    if (!userProfile?.company || userProfile.company.id !== companyId) {
      return { 
        success: false, 
        error: "Unauthorized to update this company" 
      };
    }

    // Update the company
    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        companyTitle: validatedData.company_title,
        companyEmail: validatedData.company_email,
        companyWebsite: validatedData.company_website || null,
        companyNumber: validatedData.company_number || null,
        bio: validatedData.bio || null,
        sectors: validatedData.sectors || [],
        phoneNumber: validatedData.phone_number || null,
        address: validatedData.address || null,
        profileImage: validatedData.profile_image || null,
      },
    });

    revalidatePath("/");
    revalidatePath("/profile");

    return { 
      success: true, 
      data: company 
    };
  } catch (error) {
    console.error("Error updating company:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: "Invalid form data: " + error.errors.map(e => e.message).join(", ")
      };
    }

    return { 
      success: false, 
      error: "Failed to update company profile" 
    };
  }
}