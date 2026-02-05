// app/actions/getSections.ts
'use server'

import { prisma } from '@/lib/prisma'

export interface Section {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  tabName: string;
  companyProfileId: string;
}

export async function getSections(companyProfileId: string): Promise<Section[]> {
  try {
    const sections = await prisma.customSection.findMany({
      where: {
        companyProfileId: companyProfileId
      }
    });

    return sections.map(section => ({
      id: section.id,
      title: section.title,
      description: section.description,
      fileUrl: section.fileUrl || "",
      tabName: section.tabName,
      companyProfileId: section.companyProfileId
    }));
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}