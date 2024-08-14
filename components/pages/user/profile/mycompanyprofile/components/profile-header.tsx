import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { CompanyProfile } from "@/types";
import { Pencil, Save, Loader2 } from "lucide-react";
import { useIsOwnerOfCompany } from '@/hooks/check-current-user';

interface ProfileHeaderProps {
  profile: CompanyProfile;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export function ProfileHeader({ 
  profile, 
  isEditing, 
  setIsEditing, 
  onSave, 
  isLoading 
}: ProfileHeaderProps) {
  const { isOwner, isLoading: isCheckingOwnership } = useIsOwnerOfCompany(profile.company_profile_id);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.profile_image} alt={profile.company_title} />
          <AvatarFallback>{profile.company_title?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{profile.company_title || 'Company Profile'}</CardTitle>
          {profile.bio && <CardDescription>{profile.bio}</CardDescription>}
        </div>
      </div>
      {!isCheckingOwnership && isOwner && !isEditing && (
        <Button onClick={() => setIsEditing(true)} className="mt-4 md:mt-0">
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      )}
      {isEditing && (
        <Button onClick={onSave} className="mt-4 md:mt-0" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save
            </>
          )}
        </Button>
      )}
    </div>
  );
}