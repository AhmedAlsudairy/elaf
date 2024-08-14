
import { CompanyProfilePage } from "@/components/pages/user/profile/mycompanyprofile/components/pages/company-main-info";


export default function CompanyProfilePageWrapper({ params }: { params: { companyId: string } }) {
  return <CompanyProfilePage companyId={params.companyId} />;
}