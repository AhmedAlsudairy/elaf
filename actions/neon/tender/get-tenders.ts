'use server'

import { prisma } from '@/lib/prisma'
import { SectorEnum } from '@prisma/client'
import { TenderStatus } from '@/constant/text'

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
      companyProfileId: tender.company?.id || '',
      title: tender.title,
      summary: tender.summary,
      tenderSectors: tender.tenderSectors,
      createdAt: tender.createdAt.toISOString(),
      endDate: tender.endDate.toISOString(),
      companyTitle: tender.company?.companyTitle || '',
      profileImage: tender.company?.profileImage || '',
      status: TenderStatus.Open,
      address: tender.company?.address || ''
    }))

    return { success: formattedTenders }
  } catch (error) {
    console.error('Error fetching tenders:', error)
    return { success: [] }
  }
}