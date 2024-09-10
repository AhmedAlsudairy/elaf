'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from "react-spinners";
import { CompanyCard } from '../company-profile-card';
import { Metadata, ResolvingMetadata } from 'next'

// Types
interface CompanyProfile {
  company_profile_id: string;
  company_title: string;
  bio: string;
  company_email: string;
  profile_image?: string;
  sectors: string[];
  avg_overall_rating: number;
  number_of_ratings: number;
}

interface CompanyProfilesSuccess {
  success: true;
  data: CompanyProfile[];
  metadata: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
}

interface CompanyProfilesError {
  success: false;
  error: string;
}

type CompanyProfilesResult = CompanyProfilesSuccess | CompanyProfilesError;

// Server action to fetch company profiles
import { getCompanyProfiles } from '@/actions/supabase/get-compamies-profile';
import { getTranslations } from 'next-intl/server';

// Helper function to fetch company profiles using the server action
const fetchCompanyProfiles = async ({ pageParam = 1, searchTerm = '', pageSize = 12 }) => {
  const formData = new FormData();
  formData.append('searchTerm', searchTerm);
  formData.append('page', pageParam.toString());
  formData.append('pageSize', pageSize.toString());
  const result = await getCompanyProfiles(formData);
  if (!result.success) {
    throw new Error(result.error);
  }
  return result;
};

// Dynamic metadata generation
export async function generateMetadata(
  { searchParams }: { searchParams: { searchTerm?: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const locale = 'Companies';

  const t = await getTranslations({locale, namespace: 'Metadata'});
  const searchTerm = searchParams.searchTerm || '';
  
  // Fetch the total number of companies using the server action
  const initialData = await fetchCompanyProfiles({ pageParam: 1, searchTerm, pageSize: 1 });
  const totalCompanies = initialData.metadata.totalCount;

  const pageTitle = searchTerm 
    ? t('searchResultsTitle', { searchTerm })
    : t('directoryTitle');

  const pageDescription = searchTerm
    ? t('searchResultsDescription', { totalCompanies, searchTerm })
    : t('directoryDescription', { totalCompanies });

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: t('keywords', { searchTerm: searchTerm ? `, ${searchTerm}` : '' }),
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: 'website',
      siteName: 'Elaaaf',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },
  }
}

// ResponsiveCompanyProfileList Component
export default function ResponsiveCompanyProfileList() {
  const t = useTranslations('Companies');
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 12;

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['companyProfiles', searchTerm],
    queryFn: ({ pageParam = 1 }) => fetchCompanyProfiles({ pageParam, searchTerm, pageSize }),
    getNextPageParam: (lastPage) => 
      lastPage.metadata.currentPage < lastPage.metadata.totalPages
        ? lastPage.metadata.currentPage + 1
        : undefined,
    initialPageParam: 1,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(e.currentTarget.searchTerm.value);
  };

  const profiles = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            name="searchTerm"
            defaultValue={searchTerm}
            placeholder={t('searchPlaceholder')}
            className="flex-grow"
          />
          <Button type="submit">{t('searchButton')}</Button>
        </div>
      </form>

      {status === 'pending' ? (
        <div className="flex justify-center items-center h-64">
          <ClipLoader color="#123abc" loading={true} size={50} />
        </div>
      ) : status === 'error' ? (
        <div className="text-center text-red-500">{(error as Error).message}</div>
      ) : (
        <InfiniteScroll
          dataLength={profiles.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className="flex justify-center items-center h-20">
              <ClipLoader color="#123abc" loading={true} size={50} />
            </div>
          }
          endMessage={
            <p className="text-center mt-4">
              <b>{t('allCompaniesViewed')}</b>
            </p>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <CompanyCard
                key={profile.company_profile_id}
                companyTitle={profile.company_title}
                bio={profile.bio}
                email={profile.company_email}
                profileImage={profile.profile_image}
                companyId={profile.company_profile_id}
                sectors={profile.sectors}
                rating={profile.avg_overall_rating}
                numberOfRatings={profile.number_of_ratings}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}