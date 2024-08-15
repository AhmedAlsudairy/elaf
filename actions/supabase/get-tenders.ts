'use server'
import { createClient } from "@/lib/utils/supabase/server";
import { SectorEnum, TenderStatus } from "@/constant/text";
import { z } from "zod";

const searchParamsSchema = z.object({
  query: z.string().optional(),
  sector: z.nativeEnum(SectorEnum).optional(),
  status: z.nativeEnum(TenderStatus).optional(),
  from: z.number().optional(),
  to: z.number().optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

export async function getTenders(searchParams?: SearchParams): Promise<{ success: any[]; error?: string }> {
  const supabase = createClient();
  console.log("getTenders called with params:", searchParams);

  try {
    const validatedParams = searchParamsSchema.parse(searchParams);
    console.log("Validated params:", validatedParams);

    const { data, error } = await supabase
      .rpc('get_tenders', {
        search_query: validatedParams.query || null,
        status_filter: validatedParams.status || null,
        sector_filter: validatedParams.sector || null,
        page_from: validatedParams.from || 0,
        page_to: validatedParams.to || 9
      });

    if (error) {
      console.error("Supabase error details:", error);
      return { success: [], error: `Error fetching tenders: ${error.message}` };
    }

    console.log(`Query returned ${data?.length || 0} results.`);

    return { success: data || [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      return { success: [], error: "Invalid search parameters: " + JSON.stringify(error.errors) };
    }
    console.error("Unexpected error:", error);
    return { success: [], error: "An unexpected error occurred" };
  }
}