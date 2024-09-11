import { Metadata } from "next";
import LandingPage from "@/components/pages/user/LandingPage/landing-page";

export const metadata: Metadata = {
  title: "Elaf tenders",
  description: "Elaf tender platform main page",
};

const Page = ({ searchParams }: { searchParams: { msg: string | undefined } }) => {
  return (
    <>
      <LandingPage searchParams={searchParams} />
    </>
  );
}

export default Page;
