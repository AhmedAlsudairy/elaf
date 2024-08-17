import { SingleTenderClientComponent } from "../components/tender-single-page";

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
  status: "open" | "closed";
  terms: string;
  scope_of_works: string;
  tender_sectors: string[];
  created_at: string | null;
  average_price?: number;
  maximum_price?: number;
  minimum_price?: number;
}

interface SingleTenderPageProps {
  tender: Tender;
  company: Company;
}

export const SingleTenderPage: React.FC<SingleTenderPageProps> = ({ tender, company }) => {
  return (
    <SingleTenderClientComponent tender={tender} company={company} />
  );
};

