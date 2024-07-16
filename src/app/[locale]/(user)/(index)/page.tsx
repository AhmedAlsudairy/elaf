import { LandingPage } from "@/src/pages/user/LandingPage/landing-page";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations('HomePage');

  return (
   <>
   <LandingPage/>
   </>
  );
}

export default page;