'use server'

import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { companySchema } from '@/schema';
import { prisma } from '@/lib/prisma'; // You need to create this

type CompanyFormData = z.infer<typeof companySchema>;

export async function createCompanyProfile(data: CompanyFormData) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    // Check if user already has a company
    const existingUser = await prisma.userProfile.findUnique({
      where: { clerkUserId: userId },
      include: { company: true }
    });

    if (existingUser?.company) {
      throw new Error('You already have a company profile');
    }

    // Create the company profile
    const company = await prisma.company.create({
      data: {
        companyTitle: data.companyTitle,
        companyEmail: data.companyEmail,
        companyNumber: data.companyNumber,
        companyWebsite: data.companyWebsite,
        phoneNumber: data.phoneNumber,
        address: data.address,
        bio: data.bio,
        profileImage: data.profileImage,
        sectors: data.sectors as any[], // Prisma handles enum arrays
      },
    });

    // Link the company to the user
    await prisma.userProfile.update({
      where: { clerkUserId: userId },
      data: { companyId: company.id }
    });

    return company;
  } catch (error) {
    console.error('Error creating company profile:', error);
    throw new Error('Failed to create company profile');
  }
}