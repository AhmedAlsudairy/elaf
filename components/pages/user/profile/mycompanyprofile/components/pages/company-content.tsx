import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProfileInfo } from '../company-info';
import { CompanyProfile } from '@/types';
import { updateProfile } from '@/actions/supabase/update-company-profile';
import { ProfileHeader } from '../profile-header';
import { useReusableToast } from '@/components/common/success-toast';
import { useIsOwnerOfCompany } from '@/hooks/check-current-user';

interface ProfileContentProps {
  profile: CompanyProfile;
}

export function ProfileContent({ profile: initialProfile }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>(initialProfile);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useReusableToast();
  const { isOwner } = useIsOwnerOfCompany(profile.company_profile_id);

  const handleSave = async () => {
    if (!isOwner) return;
    setIsLoading(true);
    try {
      const updatedProfile = await updateProfile(profile);
      setProfile(updatedProfile);
      setIsEditing(false);
      showToast('success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to save changes:', error);
      showToast('error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-100px)] mb">
      <div className="p-6">
        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={handleSave}
          isLoading={isLoading}
        />
        <div className="mt-6">
          <ProfileInfo
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing && isOwner}
          />
        </div>
      </div>
    </ScrollArea>
  );
}