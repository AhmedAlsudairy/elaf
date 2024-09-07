import ResponsiveCompanyProfileList from "@/components/pages/user/profile/mycompanyprofile/components/pages/companies";
import Head from 'next/head';

export default function CompanyDirectoryPage() {
  return (
    <>
      <Head>
        <title>Company Directory | Elaaaf - B2B Tendering and Bidding</title>
        <meta name="description" content="Explore Elaaaf's Company Directory. Find and connect with businesses for B2B tendering and bidding opportunities." />
        <meta name="keywords" content="Elaaaf, B2B, tendering, bidding, company directory, business networking" />
        <meta property="og:title" content="Company Directory | Elaaaf" />
        <meta property="og:description" content="Discover businesses for B2B tendering and bidding on Elaaaf's Company Directory." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Elaaaf" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Company Directory | Elaaaf - B2B Tendering and Bidding" />
        <meta name="twitter:description" content="Find potential business partners in Elaaaf's Company Directory for B2B tendering and bidding." />
      </Head>
      <div>
        <h3 className="text-2xl font-bold mb-6 text-center mt-8">Company Directory</h3>
        <ResponsiveCompanyProfileList />
      </div>
    </>
  );
}