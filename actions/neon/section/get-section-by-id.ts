'use server'

import { prisma } from '@/lib/prisma'
import { Section } from "./get-sections";

export async function getSectionById(sectionId: string): Promise<Section | null> {
  console.log('Fetching section with ID:', sectionId);

  try {
    const section = await prisma.customSection.findUnique({
      where: {
        id: sectionId
      }
    });

    if (!section) return null;

    return {
        id: section.id,
        title: section.title,
        description: section.description,
        fileUrl: section.fileUrl || null,
        tabName: section.tabName,
        companyProfileId: section.companyProfileId
    } as unknown as Section; // Ensure compatibility
  } catch (e) {
    console.error("Unexpected error in getSectionById:", e);
    throw e;
  }
}