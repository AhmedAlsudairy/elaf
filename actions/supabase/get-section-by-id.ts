'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { Section } from "./get-sections";

export async function getSectionById(sectionId: string): Promise<Section | null> {
  console.log('Fetching section with ID:', sectionId);
  const supabase = createClient();

  try {
    const { data: section, error } = await supabase
      .from('custom_sections')
      .select('*')
      .eq('id', sectionId)
      .single();

    if (error) {
      console.error("Error fetching section:", error);
      throw new Error("Error fetching section");
    }

    return section as Section | null;
  } catch (e) {
    console.error("Unexpected error in getSectionById:", e);
    throw e;
  }
}