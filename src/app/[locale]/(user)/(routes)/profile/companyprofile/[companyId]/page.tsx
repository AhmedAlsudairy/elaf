

'use client'

import { getCurrentCompanyProfile } from "@/actions/supabase/get-current-company-profile";
import { getCompanyProfileById } from "@/actions/supabase/gett-company-profile-by-id";
import { ProfileContent } from "@/components/pages/user/profile/mycompanyprofile/components/pages/company-content";
import { CompanyProfile } from "@/types";
import { useEffect, useState } from "react";





export default function CompanyProfilePage({params}: {params: {companyId: string}}) {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const fetchedProfile = await getCompanyProfileById(params.companyId);
        setProfile(fetchedProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Failed to load profile. Please try again later.</div>;
  }

  return <ProfileContent profile={profile} />;
}