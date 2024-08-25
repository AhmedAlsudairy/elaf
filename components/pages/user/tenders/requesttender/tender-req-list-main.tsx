import  { useState, useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTenderRequests } from '@/hooks/use-tender-request';
import TenderRequestCard, { TenderRequest } from './tender-req-main-card';
import { currencyT } from '@/types';

interface TenderRequestListProps {
  tenderId: string;
  onAccept: (id: string) => Promise<void>;
  acceptedRequestId?: string | null;
  tenderCurrency: currencyT; // Add this line

}

type SortOrder = 'newest' | 'oldest';
type PriceSort = 'none' | 'lowest' | 'highest';

const TenderRequestList: React.FC<TenderRequestListProps> = ({ tenderId, onAccept, acceptedRequestId,tenderCurrency }) => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [priceSort, setPriceSort] = useState<PriceSort>('none');

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    status,
    error 
  } = useTenderRequests(tenderId);

  const sortedRequests = useMemo(() => {
    const allRequests = data?.pages.flatMap(page => page.data) || [];
    let sorted = [...allRequests];
    
    if (sortOrder === 'newest') {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOrder === 'oldest') {
      sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    if (priceSort === 'lowest') {
      sorted.sort((a, b) => a.bid_price - b.bid_price);
    } else if (priceSort === 'highest') {
      sorted.sort((a, b) => b.bid_price - a.bid_price);
    }

    if (acceptedRequestId) {
      const acceptedIndex = sorted.findIndex(request => request.id === acceptedRequestId);
      if (acceptedIndex !== -1) {
        const [acceptedRequest] = sorted.splice(acceptedIndex, 1);
        sorted.unshift(acceptedRequest);
      }
    }

    return sorted;
  }, [data, sortOrder, priceSort, acceptedRequestId]);

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <Select onValueChange={(value: SortOrder) => setSortOrder(value)} defaultValue={sortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value: PriceSort) => setPriceSort(value)} defaultValue={priceSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No price sort</SelectItem>
            <SelectItem value="lowest">Lowest price first</SelectItem>
            <SelectItem value="highest">Highest price first</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <InfiniteScroll
        dataLength={sortedRequests.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={<h4>Loading more...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {sortedRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No tender requests found.</p>
          </div>
        ) : (
          sortedRequests.map((request: TenderRequest) => (
            <TenderRequestCard 
              key={request.id} 
              request={request} 
              onAccept={onAccept}
              isAccepted={request.id === acceptedRequestId}
              showAcceptButton={!acceptedRequestId || request.id === acceptedRequestId}
              tenderCurrency={tenderCurrency} // Add this line

            />
          ))
        )}
      </InfiniteScroll>
    </div>
  );
};

export default TenderRequestList;