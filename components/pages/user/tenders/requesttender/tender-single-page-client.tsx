import SingleTenderClientComponent from "../components/tender-single-page";

enum SectorEnum {
  Technology = 'Technology',
  Finance = 'Finance',
  Healthcare = 'Healthcare',
  Education = 'Education',
  Manufacturing = 'Manufacturing',
  Retail = 'Retail',
  RealEstate = 'RealEstate',
  Transportation = 'Transportation',
  Energy = 'Energy',
  Entertainment = 'Entertainment'
}

enum TenderStatusEnum {
  Open = 'open',
  Closed = 'closed',
  Awarded = 'awarded'
}

interface Company {
  company_profile_id: string;
  company_title: string;
  company_email: string;
  profile_image: string;
}

interface Tender {
  tender_id: string;
  title: string;
  summary: string;
  pdf_url: string;
  end_date: string | null;
  status: TenderStatusEnum;
  terms: string;
  scope_of_works: string;
  tender_sectors: SectorEnum[];
  created_at: string | null;
  average_price?: number;
  maximum_price?: number;
  minimum_price?: number;
}

interface SingleTenderPageProps {
  tender: Tender;
  company: Company;
}

const SingleTenderPage: React.FC<SingleTenderPageProps> = ({ tender, company }) => {
  return (
    <SingleTenderClientComponent tender={tender} company={company} />
  );
};

export default SingleTenderPage;