'use client'
import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, StarHalf } from 'lucide-react';
import { getCompanyRatingsWithProfiles } from '@/actions/supabase/add-rating';

interface RatingWithProfile {
  id: string;
  rating_company_id: string;
  quality: number | null;
  communication: number | null;
  experience: number | null;
  deadline: number | null;
  overall_rating: number | null;
  comment: string | null;
  created_at: string;
  anonymous: boolean;
  company_title: string;
  profile_image: string;
}

interface InfiniteScrollRatingsProps {
  companyId: string;
}

const StarRating: React.FC<{ rating: number | null }> = ({ rating }) => {
  if (rating === null) return null;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < fullStars ? (
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ) : i === fullStars && hasHalfStar ? (
            <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ) : (
            <Star className="w-4 h-4 text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );
};

const RatingItem: React.FC<{ label: string; value: number | null }> = ({ label, value }) => {
  if (value === null) return null;
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm">{label}</span>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{value.toFixed(1)}</span>
        <StarRating rating={value} />
      </div>
    </div>
  );
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

const InfiniteScrollRatings: React.FC<InfiniteScrollRatingsProps> = ({ companyId }) => {
  const { ref, inView } = useInView();

  const fetchRatings = async ({ pageParam }: { pageParam: number }) => {
    const limit = 10;
    const ratings = await getCompanyRatingsWithProfiles(companyId, pageParam, limit);
    return ratings || [];
  };


  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['ratings', companyId],
    queryFn: fetchRatings,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {(error as Error).message}</div>;
  console.log("here",data);

  return (
    <div className="space-y-6">
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.map((rating: RatingWithProfile) => (
            <Card key={rating.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 bg-gray-50 pb-2">
                <Avatar>
                  <AvatarImage src={rating.profile_image} alt={rating.company_title} />
                  <AvatarFallback>{rating.company_title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{rating.anonymous ? "Anonymous Company" : rating.company_title}</CardTitle>
                  <p className="text-sm text-gray-500">{formatDate(rating.created_at)}</p>

                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {rating.overall_rating !== null && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xl font-bold">{rating.overall_rating.toFixed(1)}</span>
                      <StarRating rating={rating.overall_rating} />
                    </div>
                  )}
                  <RatingItem label="Quality" value={rating.quality} />
                  <RatingItem label="Communication" value={rating.communication} />
                  <RatingItem label="Experience" value={rating.experience} />
                  <RatingItem label="Deadline" value={rating.deadline} />
                  {rating.comment && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-1">Comment:</h4>
                      <p className="text-sm">{rating.comment}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </React.Fragment>
      ))}
      <div ref={ref} className="text-center py-4">
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load More'
          : 'No more results'}
      </div>
    </div>
  );
};

export default InfiniteScrollRatings;