"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSections, Section } from "@/actions/supabase/get-sections";
import CompanyProfileClient from "@/components/pages/user/profile/mycompanyprofile/components/company-profile-client";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-center mt-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return <CompanyProfileClient sections={sections}>{children}</CompanyProfileClient>;
}