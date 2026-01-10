import { currencyT } from "@/types";
import SingleTenderClientComponent from "../components/tender-single-page";
import { SectorEnum } from "@prisma/client";

enum TenderStatusEnum {
  Open = 'open',
  Closed = 'closed',
  Awarded = 'awarded'
}

interface Company {
  companyProfileId: string | null;
  companyTitle: string;
  companyEmail: string;
  profileImage: string | null;
}

interface Tender {
  id: string;
  title: string;
  summary: string;
  pdfUrl: string;
  endDate: Date | string | null;
  status?: any; // Made optional
  terms: string;
  currency: currencyT;
  scopeOfWorks: string;
  tenderSectors: SectorEnum[];
  createdAt: Date | string | null;
  averagePrice?: number;
  maximumPrice?: number;
  minimumPrice?: number;
}

interface SingleTenderPageProps {
  tender: Tender;
  company: Company;
}

const SingleTenderPage: React.FC<SingleTenderPageProps> = ({ tender, company }) => {
  const mappedTender = {
    ...tender,
    tenderId: tender.id,
    status: tender.status,    endDate: tender.endDate instanceof Date ? tender.endDate.toISOString() : tender.endDate,
    createdAt: tender.createdAt instanceof Date ? tender.createdAt.toISOString() : tender.createdAt,  };

  return (
    <SingleTenderClientComponent tender={mappedTender} company={company} />
  );
};

export default SingleTenderPage;