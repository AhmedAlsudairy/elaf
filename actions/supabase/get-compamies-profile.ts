'use server'

import { prisma } from '@/lib/prisma'

interface CompanyProfile {
  company_profile_id: string
  user_id: string
  createdAt: Date
  updated_at: Date
  company_title: string
  company_number: string
  company_website: string
  bio: string
  phone_number: string
  address: string
  profile_image: string
  company_email: string
  sectors: string[]
  avg_overall_rating: number
  number_of_ratings: number
}

interface CompanyProfilesSuccess {
  success: true
  data: CompanyProfile[]
  metadata: {
    currentPage: number
    totalPages: number
    totalCount: number
    pageSize: number
  }
}

interface CompanyProfilesError {
  success: false
  error: string
}

type CompanyProfilesResult = CompanyProfilesSuccess | CompanyProfilesError

export async function getCompanyProfiles(
  formData: FormData
): Promise<CompanyProfilesResult> {
  const searchTerm = formData.get('searchTerm')?.toString() || ''
  const page = parseInt(formData.get('page')?.toString() || '1', 10)
  const pageSize = parseInt(formData.get('pageSize')?.toString() || '10', 10)

  try {
    const skip = (page - 1) * pageSize

    // Count total companies
    const totalCount = await prisma.company.count({
      where: searchTerm
        ? {
            OR: [
              { company_title: { contains: searchTerm, mode: 'insensitive' } },
              { bio: { contains: searchTerm, mode: 'insensitive' } },
              { address: { contains: searchTerm, mode: 'insensitive' } },
              { company_email: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : undefined,
    })

    // Fetch companies with pagination
    const companies = await prisma.company.findMany({
      where: searchTerm
        ? {
            OR: [
              { company_title: { contains: searchTerm, mode: 'insensitive' } },
              { bio: { contains: searchTerm, mode: 'insensitive' } },
              { address: { contains: searchTerm, mode: 'insensitive' } },
              { company_email: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : undefined,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    })

    const totalPages = Math.ceil(totalCount / pageSize)

    return {
      success: true,
      data: companies,
      metadata: {
        currentPage: page,
        totalPages,
        totalCount,
        pageSize,
      },
    }
  } catch (error) {
    console.error('Error fetching company profiles:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
