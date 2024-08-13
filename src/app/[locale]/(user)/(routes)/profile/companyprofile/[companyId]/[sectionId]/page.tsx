import CustomSectionPage from "@/components/pages/user/profile/mycompanyprofile/components/pages/coustum-section-page";

export default function Page({ params }: { params: { sectionId: string } }) {
  return <CustomSectionPage params={params} />;
}