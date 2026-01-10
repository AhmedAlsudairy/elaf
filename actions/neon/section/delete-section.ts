'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from "next/cache";

export async function deleteSection(sectionId: string) {
  try {
    await prisma.customSection.delete({
      where: {
        id: sectionId
      }
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    throw new Error("Failed to delete section");
  }

  revalidatePath('/company-profile');
}