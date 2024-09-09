// app/[locale]/(user)/(routes)/profile/myprofile/page.tsx
import { Suspense } from 'react';
import { getCurrentProfiles } from '@/actions/supabase/get-current-profile';
import UserProfileClient from '@/components/pages/user/profile/userProfile/user-profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';

export const revalidate = 60; // Revalidate this page every 60 seconds

type UserProfile = {
  id: string;
  email: string;
  name: string;
  profile_image?: string;
  role?: string;
  phone_number?: string;
  address?: string;
  bio?: string;
  company_that_worked_with?: string;
};

type CompanyProfile = {
  company_profile_id: string;
  // Add other company profile fields as needed
};

async function getProfiles() {
  const { userProfile, companyProfile } = await getCurrentProfiles();
  return { userProfile, companyProfile };
}

function AlertMessage({ companyProfile }: { companyProfile: CompanyProfile | null }) {
  const alertMessage = companyProfile 
    ? {
        title: "Welcome Back",
        description: "Your profile and company information have been loaded.",
        variant: "default" as const
      }
    : {
        title: "Company Profile Required",
        description: "You must create a company profile to make tenders.",
        variant: "destructive" as const
      };

  return (
    <Alert variant={alertMessage.variant} className="mb-4 max-w-3xl mx-auto">
      <AlertTitle>{alertMessage.title}</AlertTitle>
      <AlertDescription>{alertMessage.description}</AlertDescription>
    </Alert>
  );
}

export default async function UserProfilePage() {
  const { userProfile, companyProfile } = await getProfiles();

  if (!userProfile) {
    return <div>No user profile found.</div>;
  }

  // Ensure all required fields are present and handle potential undefined values
  const safeUserProfile: UserProfile = {
    id: userProfile.id,
    email: userProfile.email || '', // Provide a default value if email is undefined
    name: userProfile.name || '',
    profile_image: userProfile.profile_image,
    role: userProfile.role,
    phone_number: userProfile.phone_number,
    address: userProfile.address,
    bio: userProfile.bio,
    company_that_worked_with: userProfile.company_that_worked_with,
  };

  return (
    <div className="my-16 sm:my-24">
      <Suspense fallback={<Loader />}>
        <AlertMessage companyProfile={companyProfile} />
        <UserProfileClient 
          initialUserProfile={safeUserProfile} 
          initialCompanyProfile={companyProfile} 
        />
      </Suspense>
    </div>
  );
}