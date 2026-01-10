'use server'
import { revalidatePath } from "next/cache";
import { CustomSection } from "@/types";
import { prisma } from '@/lib/prisma'

export async function updateSection(section: CustomSection) {
    if (!section.id) {
        throw new Error("Section ID is missing");
    }

    try {
        const updatedSection = await prisma.customSection.update({
            where: {
                id: section.id
            },
            data: {
                title: section.title,
                description: section.description,
                fileUrl: section.fileUrl,
                tabName: section.tabName
            }
        });

        revalidatePath('/company-profile');
        
        return {
            id: updatedSection.id,
            title: updatedSection.title,
            description: updatedSection.description,
            fileUrl: updatedSection.fileUrl,
            tabName: updatedSection.tabName,
            companyProfileId: updatedSection.companyProfileId
        };
    } catch (error) {
        console.error("Error updating section:", error);
        throw new Error("Failed to update section");
    }
}