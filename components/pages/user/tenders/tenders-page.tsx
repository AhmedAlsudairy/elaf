// File: components/pages/user/tenders/tenders-page.tsx
import { Metadata, ResolvingMetadata } from 'next'
import { getTenders } from '@/actions/supabase/get-tenders'
import { SectorEnum, TenderStatus } from '@/constant/text'
import { SearchResult, Tender } from '@/types'
import TenderInfiniteScrollList from './components/tender-list'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const initialTenders = await fetchInitialTenders()
  // Fix for Error 1: Use Array.from() to convert Set to Array before using join
  const sectors = Array.from(new Set(initialTenders.flatMap(tender => tender.tender_sectors))).join(', ')
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `Browse ${initialTenders.length}+ Active Tenders`,
    description: `Explore tenders from various sectors including ${sectors}. Find opportunities in ${initialTenders[0]?.address || 'multiple locations'}.`,
    openGraph: {
      title: `Tender Opportunities in ${sectors}`,
      description: `Discover ${initialTenders.length}+ active tenders. From ${initialTenders[0]?.company_title || 'top companies'} and more.`,
      images: ['/tender-opportunities-og-image.jpg', ...previousImages],
    },
    keywords: ['tenders', 'business opportunities', ...sectors.split(', ')],
  }
}

async function fetchInitialTenders(): Promise<Tender[]> {
  // Fix for Error 2: Update the type of params to match getTenders expectations
  const params: {
    query?: string;
    from?: number;
    to?: number;
    sector?: SectorEnum;
    status?: TenderStatus;
  } = {
    query: '',
    from: 0,
    to: 5,
  }

  try {
    const result: SearchResult = await getTenders(params)
    return result.success
  } catch (error) {
    console.error('Error fetching initial tenders for metadata:', error)
    return []
  }
}

export default function TenderListPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tender Opportunities</h1>
      <TenderInfiniteScrollList />
    </main>
  )
}

// Update SearchParams type in @/types to include from and to
// File: types.ts (partial)
export type SearchParams = {
  query: string;
  sector: SectorEnum | null;
  status: TenderStatus | null;
  from?: number;
  to?: number;
};
