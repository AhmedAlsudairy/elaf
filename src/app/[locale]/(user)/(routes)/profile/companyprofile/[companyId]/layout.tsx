"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSections, Section } from "@/actions/supabase/get-sections";
import CompanyProfileClient from "@/components/pages/user/profile/mycompanyprofile/components/company-profile-client";

export default function CompanyProfileLayout({ children ,params }: { children: React.ReactNode, params: { companyId: string }; }) {
  const companyId = params.companyId as string;
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSections() {
      if (!companyId) {
        setError("Company ID is missing");
        setLoading(false);
        return;
      }

      try {
        const fetchedSections = await getSections(companyId);
        setSections(fetchedSections);
      } catch (err) {
        setError("Failed to fetch sections");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSections();
  }, [companyId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <CompanyProfileClient sections={sections}>{children}</CompanyProfileClient>;
}