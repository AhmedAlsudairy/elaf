'use server'
import { createClient } from "@/lib/utils/supabase/client";
import { Section } from "./get-sections";
import { revalidatePath } from "next/cache";

export async function updateSection(section: Section) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from('custom_sections')
      .update({
        title: section.title,
        description: section.description,
        pdf_url: section.file_url,
        tab_name: section.tab_name
      })
      .eq('id', section.id)
      .select()
      .single();
  
    if (error) {
      console.error("Error updating section:", error);
      throw new Error("Failed to update section");
    }
  
    revalidatePath('/company-profile');
    return data;
  }