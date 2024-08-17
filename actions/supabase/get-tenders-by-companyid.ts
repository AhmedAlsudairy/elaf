'use server'

import { createClient } from "@/lib/utils/supabase/server";
import { SearchParams, SearchResult, Tender } from "@/types";
import { SectorEnum, TenderStatus } from "@/constant/text";
import { z } from "zod";

const searchParamsSchema = z.object({
  query: z.string().optional(),
  sector: z.nativeEnum(SectorEnum).nullable(),
  status: z.nativeEnum(TenderStatus).nullable(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

interface RawTender {
  tender_id: string;
  id: string;
  company_profile_id: string;
  title: string;
  summary: string;
  pdf_url: string;
  end_date: string;
  status: TenderStatus;
  average_price: number;
  maximum_price: number;
  minimum_price: number;
  created_at: string;
  updated_at: string;
  terms: string;
  scope_of_works: string;
  isEnabled: boolean;
  tender_sectors: SectorEnum[];
  company_title: string;
  company_email: string;
  profile_image: string;
  company_address: string;
}

export async function fetchTenders(
  companyProfileId: string,
  searchParams?: SearchParams,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchResult> {
  const supabase = createClient();
  console.log("fetchTenders called with params:", { companyProfileId, searchParams, page, pageSize });

  try {
    const validatedParams = searchParamsSchema.parse({
      ...searchParams,
      page,
      pageSize
    });
    console.log("Validated params:", validatedParams);

    const { data, error } = await supabase.rpc('fetch_company_tenders', {
      p_company_profile_id: companyProfileId,
      p_search: validatedParams.query || validatedParams.sector || '',
      p_page: validatedParams.page,
      p_page_size: validatedParams.pageSize
    });

    if (error) {
      console.error("Supabase error details:", error);
      return { success: [], error: `Error fetching tenders: ${error.message}` };
    }

    console.log(`Query returned ${data?.length || 0} results.`);

    let filteredData = (data as RawTender[]) || [];
    if (validatedParams.status) {
      filteredData = filteredData.filter((tender: RawTender) => tender.status === validatedParams.status);
    }

    const formattedTenders: Tender[] = filteredData.map((tender: RawTender) => ({
      id: tender.id,
      tender_id: tender.tender_id,
      company_profile_id: tender.company_profile_id,
      company_title: tender.company_title,
      profile_image: tender.profile_image,
      tender_sectors: tender.tender_sectors,
      created_at: tender.created_at,
      end_date: tender.end_date,
      title: tender.title,
      summary: tender.summary,
      status: tender.status,
      address: tender.company_address
    }));

    return { success: formattedTenders };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      return { success: [], error: "Invalid search parameters: " + JSON.stringify(error.errors) };
    }
    console.error("Unexpected error:", error);
    return { success: [], error: "An unexpected error occurred" };
  }
}