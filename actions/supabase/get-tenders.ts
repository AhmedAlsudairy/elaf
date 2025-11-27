'use server'

import { prisma } from '@/lib/prisma'
import { SectorEnum } from '@prisma/client'

interface GetTendersParams {
  query?: string
  sector?: SectorEnum | null
  status?: string | null
  from?: number
  to?: number
}

export async function getTenders(params: GetTendersParams) {
  try {
    const { query, sector, from = 0, to = 9 } = params
    const limit = to - from + 1

    const where: any = {}

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (sector) {
      where.tenderSectors = { has: sector }
    }

    const tenders = await prisma.tender.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            companyTitle: true,
            companyEmail: true,
            profileImage: true,
            address: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: from,
      take: limit
    })

    const formattedTenders = tenders.map(tender => ({
      id: tender.id,
      tender_id: tender.id,
      company_profile_id: tender.companyId,
      title: tender.title,
      summary: tender.summary,
      tender_sectors: tender.tenderSectors,
      created_at: tender.createdAt.toISOString(),
      end_date: tender.endDate.toISOString(),
      company_title: tender.company?.companyTitle || '',
      profile_image: tender.company?.profileImage || null,
      status: 'active', // Add logic if you have status field
      address: tender.company?.address || null
    }))

    return { success: formattedTenders }
  } catch (error) {
    console.error('Error fetching tenders:', error)
    return { success: [] }
  }
}