import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { CompanyProfile } from "@/types";
import { Pencil, Save, Loader2, MessageCircle } from "lucide-react";
import { useIsOwnerOfCompany } from '@/hooks/check-current-user';
import { getCurrentCompanyProfile } from '@/actions/supabase/get-current-company-profile';
import { createOrGetChatRoom } from '@/actions/supabase/chats';
import { useRouter } from 'next/navigation';
// Adjust the import path as needed

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
  const router = useRouter();
  const { isOwner, isLoading: isCheckingOwnership } = useIsOwnerOfCompany(profile.company_profile_id);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatClick = async () => {
    setIsChatLoading(true);
    try {
      const currentProfile = await getCurrentCompanyProfile();
      if (!currentProfile) {
        console.error("Current user's company profile not found");
        return;
      }
  
      console.log("Initiator:", currentProfile.company_profile_id);
      console.log("Recipient:", profile.company_profile_id);
  
      const result = await createOrGetChatRoom(currentProfile.company_profile_id, profile.company_profile_id);
      if (result) {
        router.push(`/chats/${result.chat_room_id}`);
      } else {
        console.error("Failed to create or get chat room");
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
    } finally {
      setIsChatLoading(false);
    }
  };

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
      <div className="flex mt-4 md:mt-0 space-x-2">
        {!isCheckingOwnership && isOwner && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Button>
        )}
        {isEditing && (
          <Button onClick={onSave} disabled={isLoading}>
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
        {!isOwner && (
          <Button onClick={handleChatClick} disabled={isChatLoading}>
            {isChatLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" /> Chat
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}