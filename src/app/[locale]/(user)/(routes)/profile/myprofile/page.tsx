import { Suspense } from 'react';
import { getCurrentProfiles } from '@/actions/supabase/get-current-profile';
import UserProfileClient from '@/components/pages/user/profile/userProfile/user-profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader } from '@/components/ui/loader';
import { useTranslations } from 'next-intl';

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
  try {
    const { userProfile, companyProfile } = await getCurrentProfiles();
    return { userProfile, companyProfile };
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return { userProfile: null, companyProfile: null };
  }
}

function AlertMessage({ companyProfile }: { companyProfile: CompanyProfile | null }) {
  const t = useTranslations('UserProfilePage');

  const alertMessage = companyProfile 
    ? {
        title: t('welcomeBackTitle'),
        description: t('welcomeBackDescription'),
        variant: "default" as const
      }
    : {
        title: t('companyProfileRequiredTitle'),
        description: t('companyProfileRequiredDescription'),
        variant: "destructive" as const
      };

  return (
    <Alert variant={alertMessage.variant} className="mb-4 max-w-3xl mx-auto">
      <AlertTitle>{alertMessage.title}</AlertTitle>
      <AlertDescription>{alertMessage.description}</AlertDescription>
    </Alert>
  );
}

export default function UserProfilePage() {
  const t = useTranslations('UserProfilePage');

  return (
    <div className="my-16 sm:my-24">
      <Suspense fallback={<Loader />}>
        <UserProfileContent />
      </Suspense>
    </div>
  );
}

async function UserProfileContent() {
  const t = useTranslations('UserProfilePage');
  const { userProfile, companyProfile } = await getProfiles();

  if (!userProfile) {
    return <div>{t('noUserProfileFound')}</div>;
  }

  // Ensure all required fields are present and handle potential undefined values
  const safeUserProfile: UserProfile = {
    id: userProfile.id,
    email: userProfile.email || '',
    name: userProfile.name || '',
    profile_image: userProfile.profile_image,
    role: userProfile.role,
    phone_number: userProfile.phone_number,
    address: userProfile.address,
    bio: userProfile.bio,
    company_that_worked_with: userProfile.company_that_worked_with,
  };

  return (
    <>
      <AlertMessage companyProfile={companyProfile} />
      <UserProfileClient 
        initialUserProfile={safeUserProfile} 
        initialCompanyProfile={companyProfile} 
      />
    </>
  );
}