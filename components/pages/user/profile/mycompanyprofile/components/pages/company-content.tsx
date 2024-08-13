import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

import { ProfileInfo } from '../company-info';
import { CompanyProfile } from '@/types';
import { updateProfile } from '@/actions/supabase/update-company-profile';
import { ProfileHeader } from '../profile-header';

interface ProfileContentProps {
  profile: CompanyProfile;
}

export function ProfileContent({ profile: initialProfile }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProfile(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save changes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-100px)] mb">
      <div className="p-6">
        <ProfileHeader
          profile={profile}
          isCurrentUser={true}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onSave={handleSave}
        />
        <div className="mt-6">
          <ProfileInfo
            profile={profile}
            setProfile={setProfile}
            isEditing={isEditing}
          />
        </div>
      </div>
    </ScrollArea>
  );
}