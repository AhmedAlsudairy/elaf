'use client'

import { getCurrentCompanyProfile } from "@/actions/supabase/get-current-company-profile";
import { getSections } from "@/actions/supabase/get-section";
import { Sidebar } from "@/components/pages/user/profile/mycompanyprofile/components/sidebar";
import { useState } from "react";

export default  async function CompanyProfileLayout({ children }: { children: React.ReactNode }) {
  const sections = await getSections(); 
  const [activeTab, setActiveTab] = useState('info');
  return (
    <div className="flex w-full max-w-6xl mx-auto">
      <Sidebar sections={sections} onTabChange={setActiveTab} />

      <div className="flex-1">{children}</div>
    </div>
  );
}