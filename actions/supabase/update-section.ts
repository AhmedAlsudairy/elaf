'use server'
import { revalidatePath } from "next/cache";
import { CustomSection } from "@/types";
import { createClient } from "@/lib/utils/supabase/server";

export async function updateSection(section:CustomSection ) {
    const supabase = createClient();
  
    const { data, error } = await supabase
      .from('custom_sections')
      .update({
        title: section.title,
        description: section.description,
        file_url: section.file_url,
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