import ResponsiveCompanyProfileList from "@/components/pages/user/profile/mycompanyprofile/components/pages/companies";
import { Metadata } from 'next';
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: 'Company Directory',
  description: 'Explore Elaaaf\'s Company Directory. Find and connect with businesses for B2B tendering and bidding opportunities.',
  keywords: 'Elaaaf, B2B, tendering, bidding, company directory, business networking',
  openGraph: {
    title: 'Company Directory ',
    description: 'Discover businesses for B2B tendering and bidding on Elaaaf\'s Company Directory.',
    type: 'website',
    siteName: 'Elaaaf',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Company Directory - B2B Tendering and Bidding',
    description: 'Find potential business partners in Elaaaf\'s Company Directory for B2B tendering and bidding.',
  },
};

export default function CompanyDirectoryPage() {
  const t = useTranslations('Companies');

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-center mt-8">{t("Company Directory")}</h3>
      <ResponsiveCompanyProfileList />
    </div>
  );
}