import React from 'react';
import { useTranslations } from 'next-intl';
import { Metadata, ResolvingMetadata } from 'next';
import { getTenders } from '@/actions/supabase/get-tenders';
import { SectorEnum, TenderStatus } from '@/constant/text';
import { SearchResult, Tender } from '@/types';
import TenderInfiniteScrollList from './components/tender-list';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const initialTenders = await fetchInitialTenders();
  const sectors = Array.from(new Set(initialTenders.flatMap(tender => tender.tender_sectors))).join(', ');
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `تصفح ${initialTenders.length}+ مناقصات نشطة`,
    description: `استكشف المناقصات من قطاعات مختلفة وابحث عن الفرص في ${initialTenders[0]?.address || 'مواقع متعددة'}.`,
    openGraph: {
      title: `فرص المناقصات في ${sectors}`,
      description: `اكتشف ${initialTenders.length}+ مناقصات نشطة. من ${initialTenders[0]?.company_title || 'أفضل الشركات'} وأكثر.`,
      images: ['/tender-opportunities-og-image.jpg', ...previousImages],
    },
    keywords: ['مناقصات', 'فرص العمل', ...sectors.split(', ')],
  };
}

async function fetchInitialTenders(): Promise<Tender[]> {
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
  };

  try {
    const result: SearchResult = await getTenders(params);
    return result.success;
  } catch (error) {
    console.error('Error fetching initial tenders for metadata:', error);
    return [];
  }
}

export default function TenderListPage() {
  const t = useTranslations('TendersPage');

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('header')}</h1>
      <p className="mb-4">{t('description')}</p>
      <TenderInfiniteScrollList />
    </main>
  );
}
