'use server'

import { prisma } from '@/lib/prisma'

export async function fetchTenderData(tenderId: string) {
  try {
    const tender = await prisma.tender.findFirst({
        where: { id: tenderId },
        include: {
            company: true
        }
    });

    if (!tender) {
        throw new Error('Tender not found');
    }

    return {
      tender: tender,
      company: tender.company
    };

  } catch (error) {
    console.error('Error fetching tender data:', error);
    throw new Error('Failed to fetch tender data');
  }
}