import TendersPage from "@/components/pages/user/tenders/tenders-page";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arab Gulf & MENA Tenders ',
  description: 'Explore the latest tenders and business opportunities in the Arab Gulf and MENA region. Find construction, oil & gas, infrastructure, and more projects.',
  keywords: 'tenders, Arab Gulf, MENA, Middle East, North Africa, business opportunities, projects',
  openGraph: {
    title: 'Arab Gulf & MENA Tenders | Your Company Name',
    description: 'Discover lucrative tender opportunities across the Arab Gulf and MENA region.',
  
    
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arab Gulf & MENA Tenders ',
    description: 'Explore business opportunities in the Arab Gulf and MENA region.',
  },
};

const Page = () => {
  return (
    <div>
      <TendersPage />
    </div>
  );
}

export default Page;