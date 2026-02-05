
import { fetchTenderData } from '@/actions/neon/tender/get-tender';
import SingleTenderPage from '@/components/pages/user/tenders/requesttender/tender-single-page-client';

export default async function TenderPage({ params }: { params: Promise<{ tenderId: string }> }) {
  const { tenderId } = await params;
  
  if (!tenderId) {
    return <div>Error: Tender ID is missing. Please check the URL.</div>;
  }

  try {
    const { tender, company } = await fetchTenderData(tenderId);
    
    if (!tender || !company) {
      throw new Error('Tender or company data not found');
    }

    return (
      < SingleTenderPage
        tender={tender}
        company={company}
      />
    );
  } catch (error) {
    console.error('Error fetching tender data:', error);
    return <div>Error loading tender data. Please try again later.</div>;
  }
}
