import ResponsiveCompanyProfileList from "@/components/pages/user/profile/mycompanyprofile/components/pages/companies";

//TODO:add meta data to it
export default function CompanyDirectoryPage() {
  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-center mt-8">Company Directory</h3>
      <ResponsiveCompanyProfileList />
    </div>
  );
}