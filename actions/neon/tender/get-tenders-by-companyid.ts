'use server'
import { prisma } from '@/lib/prisma'
import { currencyT, SearchParams, SearchResult, Tender } from "@/types";
import { SectorEnum, TenderStatus } from "@/constant/text";
import { z } from "zod";

const searchParamsSchema = z.object({
  query: z.string().optional(),
  sector: z.nativeEnum(SectorEnum).nullable(),
  status: z.nativeEnum(TenderStatus).nullable(),
  page: z.number().default(1),
  pageSize: z.number().default(10),
});

export async function fetchTenders(
  companyProfileId: string,
  searchParams?: SearchParams,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchResult> {
  console.log("fetchTenders (Prisma) called with params:", { companyProfileId, searchParams, page, pageSize });

  try {
    const validatedParams = searchParamsSchema.parse({
      ...searchParams,
      page,
      pageSize
    });

    const { query, sector, page: vPage, pageSize: vPageSize } = validatedParams;
    const skip = (vPage - 1) * vPageSize;
    const sanitizedSearch = query?.trim();

    const whereClause: any = {
      company: {
        companyProfileId: companyProfileId
      }
    };

    if (sanitizedSearch) {
        whereClause.OR = [
            { title: { contains: sanitizedSearch, mode: 'insensitive' } },
            { summary: { contains: sanitizedSearch, mode: 'insensitive' } }
        ];
    }

    if (sector) {
        whereClause.tenderSectors = { has: sector };
    }
    
    if (validatedParams.status === TenderStatus.Open) {
        whereClause.endDate = { gt: new Date() };
    } else if (validatedParams.status === TenderStatus.Closed) {
        whereClause.endDate = { lte: new Date() };
    }

    const [tenders, count] = await prisma.$transaction([
        prisma.tender.findMany({
            where: whereClause,
            include: { company: true },
            skip,
            take: vPageSize,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.tender.count({ where: whereClause })
    ]);

    const formattedTenders: Tender[] = tenders.map(t => ({
      id: t.id,
      companyProfileId: t.company?.id || '', // Use company ID as profile ID link
      companyTitle: t.company?.companyTitle || '',
      profileImage: t.company?.profileImage || '',
      tenderSectors: t.tenderSectors,
      createdAt: t.createdAt.toISOString(),
      endDate: t.endDate.toISOString(),
      title: t.title,
      currency: t.currency,
      summary: t.summary,
      status: new Date(t.endDate) > new Date() ? TenderStatus.Open : TenderStatus.Closed,
      address: t.company?.address || ''
    }));

    return { success: formattedTenders };

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      return { success: [], error: "Invalid search parameters: " + JSON.stringify(error.errors) };
    }
    console.error("Error fetching tenders:", error);
    return { success: [], error: "Failed to fetch tenders" };
  }
}
