'use server'
import { prisma } from '@/lib/prisma'

export interface RequestSummary {
  id: string;
  company_title: string;
  bid_price: number;
  pdf_url: string | null;
  created_at?: string;
}

export async function getRequestSummaries(tenderId: string, page: number, pageSize: number = 10): Promise<{ success: boolean; data: RequestSummary[]; error: string | null }> {
  try {
    const requests = await prisma.tenderRequest.findMany({
        where: { tenderId: tenderId },
        select: {
            id: true,
            price: true,
            createdAt: true,
            company: {
                select: {
                    companyTitle: true
                }
            }
        },
        skip: page * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
    });

    const summaries: RequestSummary[] = requests.map(req => ({
        id: req.id,
        company_title: req.company?.companyTitle || 'Unknown Company',
        bid_price: req.price || 0,
        pdf_url: null, // TODO: PdfUrl missing in schema
        created_at: req.createdAt.toISOString()
    }));

    return { success: true, data: summaries, error: null };

  } catch (error) {
    console.error("Error fetching request summaries:", error);
    return { success: false, data: [], error: error instanceof Error ? error.message : "Error fetching summaries" };
  }
}