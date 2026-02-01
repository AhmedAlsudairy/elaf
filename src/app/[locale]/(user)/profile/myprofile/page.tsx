// app/[locale]/(user)/(routes)/profile/myprofile/page.tsx
import { Suspense } from 'react';
import { getCurrentUserProfile } from '@/actions/neon/user/get-current-user-profile';
import { getCurrentCompanyProfile } from '@/actions/neon/company/get-current-company-profile';
import UserProfileClient from '@/components/pages/user/profile/userProfile/user-profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';

export const revalidate = 60; // Revalidate this page every 60 seconds

type UserProfile = {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  role?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  companyThatWorkedWith?: string;
};

type CompanyProfile = {
  id?: string;
  companyProfileId?: string;
  companyTitle?: string;
  // Add other company profile fields as needed
};

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
  const [userProfileData, companyProfileData] = await Promise.all([
    getCurrentUserProfile(),
    getCurrentCompanyProfile()
  ]);

  if (!userProfileData) {
    return <div>No user profile found.</div>;
  }

  // Ensure all required fields are present and handle potential undefined values
  const safeUserProfile: UserProfile = {
    id: userProfileData.id,
    email: userProfileData.email || '',
    name: userProfileData.name || '',
    profileImage: userProfileData.profileImage ?? undefined, 
    role: userProfileData.role ?? undefined,
    phoneNumber: userProfileData.phoneNumber ?? undefined, 
    address: userProfileData.address ?? undefined,
    bio: userProfileData.bio ?? undefined,
    companyThatWorkedWith: userProfileData.companyThatWorkedWith ?? undefined, 
  };

  const safeCompanyProfile: CompanyProfile | null = companyProfileData ? {
    id: companyProfileData.id,
    companyProfileId: companyProfileData.companyProfileId ?? undefined,
    companyTitle: companyProfileData.companyTitle,
  } : null;

  return (
    <div className="my-16 sm:my-24">
      <Suspense fallback={<Loader />}>
        <AlertMessage companyProfile={safeCompanyProfile} />
        <UserProfileClient 
          initialUserProfile={safeUserProfile} 
          initialCompanyProfile={safeCompanyProfile} 
        />
      </Suspense>
    </div>
  );
}