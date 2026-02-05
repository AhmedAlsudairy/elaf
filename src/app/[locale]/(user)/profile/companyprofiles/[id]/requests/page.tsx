'use client'

import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getTenderRequestsByCompanyProfileId } from '@/actions/neon/request/get-tender-request-by-company-id';
import { Loader2 } from 'lucide-react';
import TenderRequestCard from '@/components/pages/user/tenders/requesttender/request-tender-card';
import { currencyT } from '@/types';
import { Currency } from "@prisma/client";

const ITEMS_PER_PAGE = 9; // Adjust this number as needed

interface TenderRequest {
  id: string;
  status: string;
  price: number | null;
  tender: {
    id: string;
    title: string;
    summary: string;
    pdfUrl: string;
    endDate: Date;
    currency: Currency;
  };
}

interface ApiResponse {
  success: boolean;
  data: TenderRequest[];
  totalCount: number | null;
  nextPage: number | null;
  error?: string;
}

const TenderRequestsPage = () => {
  const { ref, inView } = useInView();

  const fetchTenderRequests = async ({ pageParam = 0 }): Promise<ApiResponse> => {
    const result = await getTenderRequestsByCompanyProfileId(pageParam, ITEMS_PER_PAGE);
    return result as ApiResponse;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['tenderRequests'],
    queryFn: fetchTenderRequests,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === 'pending') return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
  
  if (status === 'error') return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tender Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.data.map((tenderRequest: TenderRequest) => (
              <TenderRequestCard
                key={tenderRequest.id}
                title={tenderRequest.tender.title}
                summary={tenderRequest.tender.summary}
                price={tenderRequest.price ?? 0}
                currency={tenderRequest.tender.currency as currencyT}
                tenderId={tenderRequest.tender.id}
                pdfUrl={tenderRequest.tender.pdfUrl}
                tenderRequestStatus={tenderRequest.status as any}
                tenderStatus={new Date(tenderRequest.tender.endDate) > new Date() ? 'open' : 'closed'}
                endDate={tenderRequest.tender.endDate}

              />
            ))}
          </React.Fragment>
        ))}
      </div>
      <div ref={ref} className="mt-4 text-center">
        {isFetchingNextPage ? (
          <Loader2 className="h-6 w-6 animate-spin inline-block" />
        ) : hasNextPage ? (
          'Load More'
        ) : (
          'No more results'
        )}
      </div>
    </div>
  );
};

export default TenderRequestsPage;