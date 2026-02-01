import { Metadata } from "next";
import LandingPage from "@/components/pages/user/LandingPage/landing-page";

export const metadata: Metadata = {
  title: "Elaf tenders",
  description: "Elaf tender platform main page",
};

const Page = async ({ searchParams }: { searchParams: Promise<{ msg: string | undefined }> }) => {
  const resolvedSearchParams = await searchParams;
  return (
    <>
      <LandingPage searchParams={resolvedSearchParams} />
    </>
  );
}

export default Page;
