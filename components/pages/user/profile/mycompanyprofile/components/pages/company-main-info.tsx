'use client'

import { getCompanyProfileById } from "@/actions/supabase/gett-company-profile-by-id";
import { ProfileContent } from "@/components/pages/user/profile/mycompanyprofile/components/pages/company-content";
import { CompanyProfile } from "@/types";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyProfilePageProps {
  companyId: string;
}

export const CompanyProfilePage: React.FC<CompanyProfilePageProps> = ({ companyId }) => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const fetchedProfile = await getCompanyProfileById(companyId);
        setProfile(fetchedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [companyId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-32 w-full" />
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div>Failed to load profile. Please try again later.</div>;
  }

  return <ProfileContent profile={profile} />;
};