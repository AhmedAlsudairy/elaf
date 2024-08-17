
import React from 'react';
import SingleTenderPage from '@/components/pages/user/tenders/components/tender-single-page';
import { fetchTenderData } from '@/actions/supabase/get-tender';

interface PageProps {
  params: { tenderId?: string };
}

export default async function TenderPage({ params }: PageProps) {
  if (!params || typeof params.tenderId === 'undefined') {
    return <div>Error: Tender ID is missing. Please check the URL.</div>;
  }

  const tenderId = params.tenderId;
  
  try {
    const { tender, company } = await fetchTenderData(tenderId);
    
    if (!tender || !company) {
      throw new Error('Tender or company data not found');
    }

    return (
      <SingleTenderPage 
        tender={tender}
        company={company}
      />
    );
  } catch (error) {
    console.error('Error fetching tender data:', error);
    return <div>Error loading tender data. Please try again later.</div>;
  }
}
