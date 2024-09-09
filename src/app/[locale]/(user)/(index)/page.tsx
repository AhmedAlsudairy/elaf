import { Metadata } from "next";
import LandingPage from "@/components/pages/user/LandingPage/landing-page";

export const metadata: Metadata = {
  title: "Your Landing Page Title",
  description: "Your Landing Page Description",
};

const Page = ({ searchParams }: { searchParams: { msg: string | undefined } }) => {
  return (
    <>
      <LandingPage searchParams={searchParams} />
    </>
  );
}

export default Page;