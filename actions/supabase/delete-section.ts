'use server'
import { createClient } from "@/lib/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteSection(sectionId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from('custom_sections')
    .delete()
    .eq('id', sectionId);

  if (error) {
    console.error("Error deleting section:", error);
    throw new Error("Failed to delete section");
  }

  revalidatePath('/company-profile');
}