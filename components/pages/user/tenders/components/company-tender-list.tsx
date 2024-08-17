'use client'

import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import TenderCard from './tender-card';
import { SearchParams, SearchResult, Tender } from '@/types';
import ComprehensiveTenderSearch from './tender-search';
import { fetchTenders } from '@/actions/supabase/get-tenders-by-companyid';

interface CompanyTendersListProps {
  companyId: string;
  isOwner: boolean;
}

const CompanyTendersList: React.FC<CompanyTendersListProps> = ({ companyId, isOwner }) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    sector: null,
    status: null
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch, isLoading } = useInfiniteQuery({
    queryKey: ['companyTenders', companyId, searchParams],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchTenders(companyId, searchParams, pageParam as number, 10);
      return result;
    },
    getNextPageParam: (lastPage: SearchResult, pages) => {
      if (lastPage.success.length === 10) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  const handleSearch = async (newSearchParams: SearchParams): Promise<SearchResult> => {
    setSearchParams(newSearchParams);
    const result = await refetch();
    return result.data?.pages[0] || { success: [] };
  };

  const allTenders = data?.pages.flatMap(page => page.success) || [];
  const noTendersFound = allTenders.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Company Tenders</h1>
        {isOwner && (
          <Link href={`/profile/companyprofiles/${companyId}/tenders/new`}>
            <Button>Add New Tender</Button>
          </Link>
        )}
      </div>

      <ComprehensiveTenderSearch onSearch={handleSearch} isLoading={isLoading} />
      
      {status === 'pending' ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#3B82F6" size={50} />
        </div>
      ) : status === 'error' ? (
        <div className="text-center text-red-500">Error fetching tenders</div>
      ) : status === 'success' && noTendersFound ? (
        <div className="text-center text-gray-500">No tenders found</div>
      ) : status === 'success' && allTenders.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {allTenders.map((tender: Tender) => (
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
      ) : null}
    </div>
  );
};

export default CompanyTendersList;