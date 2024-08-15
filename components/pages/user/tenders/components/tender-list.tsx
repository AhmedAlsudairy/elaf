import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { Button } from "@/components/ui/button";
import { getTenders } from '@/actions/supabase/get-tenders';
import ComprehensiveTenderSearch from './tender-search';
import TenderCard from './tender-card';
import { SectorEnum, TenderStatus } from '@/constant/text';

const ITEMS_PER_PAGE = 10;

interface SearchParams {
  query: string;
  sector: SectorEnum | null;
  status: TenderStatus | null;
}

interface Tender {
  id?: string;
  company_profile_id: string;
  tender_id?: string;
  company_title: string;
  profile_image: string;
  tender_sectors: SectorEnum[];
  created_at?: string;
  title: string;
  summary: string;
  status: TenderStatus;
  description: string;
  deadline?: string;
  budget?: number;
}

interface SearchResult {
  success?: Tender[];
  error?: string;
}

const TenderInfiniteScrollList: React.FC = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    sector: null,
    status: null
  });

  const fetchTenders = async ({ pageParam = 0 }): Promise<SearchResult> => {
    const params = {
      ...searchParams,
      from: pageParam,
      to: pageParam + ITEMS_PER_PAGE - 1,
      sector: searchParams.sector || undefined,
      status: searchParams.status || undefined
    };

    return getTenders(params);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['tenders', searchParams],
    queryFn: fetchTenders,
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.success || lastPage.success.length < ITEMS_PER_PAGE) return undefined;
      return pages.length * ITEMS_PER_PAGE;
    },
    initialPageParam: 0,
  });

  const handleSearch = async (newSearchParams: SearchParams): Promise<SearchResult> => {
    setSearchParams(newSearchParams);
    const result = await refetch();
    return result.data?.pages[0] || { error: "Failed to fetch results" };
  };

  const noTendersFound = data?.pages[0]?.success?.length === 0;

  return (
    <div className="space-y-6">
      <ComprehensiveTenderSearch onSearch={handleSearch} isLoading={isLoading} />
      
      {status === 'pending' ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#3B82F6" size={50} />
        </div>
      ) : status === 'error' ? (
        <div className="text-center text-red-500">Error fetching tenders</div>
      ) : noTendersFound ? (
        <div className="text-center text-gray-500">No tenders found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.success?.map((tender: Tender) => (
                  <TenderCard
                    key={tender.id}
                    companyId={tender.company_profile_id}
                    tenderId={tender.tender_id || ''}
                    companyTitle={tender.company_title}
                    profileImage={tender.profile_image}
                    sectors={tender.tender_sectors}
                    startingDate={tender.created_at || ''}
                    tenderTitle={tender.title}
                    summary={tender.summary}
                    status={tender.status}

                  />
                ))}
              </React.Fragment>
            ))}
          </div>
          
          {hasNextPage && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center space-x-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <ClipLoader color="#FFFFFF" size={20} />
                    <span>Loading more...</span>
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TenderInfiniteScrollList;