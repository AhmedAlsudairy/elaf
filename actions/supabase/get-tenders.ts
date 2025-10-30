'use server'

import { prisma } from '@/lib/prisma'

export async function fetchTenderData(tenderId: string) {
  try {
    const tender = await prisma.tenders.findUnique({
      where: { tender_id: tenderId },
      include: {
        company_profiles: {
          select: {
            company_profile_id: true,
            company_title: true,
            company_email: true,
            profile_image: true,
          },
        },
      },
    })

    if (!tender) {
      throw new Error('Tender not found')
    }

    const company = tender.company_profiles

    return {
      tender: {
        tender_id: tender.tender_id,
        title: tender.title,
        summary: tender.summary,
        pdf_url: tender.pdf_url,
        end_date: tender.end_date ? tender.end_date.toISOString() : null,
        status: tender.status,
        terms: tender.terms,
        scope_of_works: tender.scope_of_works,
        tender_sectors: tender.tender_sectors,
        created_at: tender.created_at ? tender.created_at.toISOString() : null,
        average_price: tender.average_price,
        maximum_price: tender.maximum_price,
        minimum_price: tender.minimum_price,
        currency: tender.currency,
      },
      company: company
        ? {
            company_profile_id: company.company_profile_id,
            company_title: company.company_title,
            company_email: company.company_email,
            profile_image: company.profile_image,
          }
        : null,
    }
  } catch (error) {
    console.error('Error fetching tender data:', error)
    throw new Error('Failed to fetch tender data')
  }
}
