import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';

import { Button } from "@/components/ui/button";
import { getTenders } from '@/actions/supabase/get-tenders';
import ComprehensiveTenderSearch from './tender-search';
import TenderCard from './tender-card';
import { SearchParams, SearchResult, Tender } from '@/types';

const ITEMS_PER_PAGE = 10;

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

    const result = await getTenders(params);
    return result;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['tenders', searchParams],
    queryFn: fetchTenders,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.success.length < ITEMS_PER_PAGE) return undefined;
      return pages.length * ITEMS_PER_PAGE;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    if (status === 'error') {
      console.error('Error fetching tenders:', error);
    }
  }, [status, error]);

  const handleSearch = async (newSearchParams: SearchParams): Promise<SearchResult> => {
    setSearchParams(newSearchParams);
    try {
      const result = await refetch();
      return result.data?.pages[0] || { success: [] };
    } catch (error) {
      console.error('Error during search:', error);
      return { success: [] };
    }
  };

  const noTendersFound = data?.pages[0]?.success.length === 0;

  return (
    <div className="space-y-6">
      <ComprehensiveTenderSearch onSearch={handleSearch} isLoading={isLoading} />
      
      {status === 'pending' ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#3B82F6" size={50} />
        </div>
      ) : noTendersFound ? (
        <div className="text-center text-gray-500">No tenders found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.success.map((tender: Tender) => (
                  <TenderCard
                    key={tender.id}
                    companyId={tender.company_profile_id}
                    tenderId={tender.tender_id}
                    companyTitle={tender.company_title}
                    profileImage={tender.profile_image}
                    sectors={tender.tender_sectors}
                    startingDate={tender.created_at}
                    endDate={tender.end_date}
                    tenderTitle={tender.title}
                    summary={tender.summary}
                    status={tender.status}
                    address={tender.address}
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