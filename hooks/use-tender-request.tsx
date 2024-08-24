import { useInfiniteQuery } from '@tanstack/react-query';
import { getRequestsByTenderId } from "@/actions/supabase/get-tender-requests-by-tender-id";
import { TenderRequest } from '@/components/pages/user/tenders/requesttender/tender-req-main-card';

export const useTenderRequests = (tenderId: string) => {
  return useInfiniteQuery<{ data: TenderRequest[]; nextPage: number | null }>({
    queryKey: ['tenderRequests', tenderId],
    queryFn: async ({ pageParam }) => {
      const result = await getRequestsByTenderId(tenderId, pageParam as number);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch tender requests');
      }
      return {
        data: result.data,
        nextPage: result.nextPage ?? null
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};