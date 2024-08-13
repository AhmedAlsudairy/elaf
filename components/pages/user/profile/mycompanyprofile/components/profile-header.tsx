import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { ProfileHeaderProps } from "@/types";
import { Pencil, Save } from "lucide-react";


export function ProfileHeader({ profile, isCurrentUser, isEditing, setIsEditing, onSave }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.profile_image} />
          <AvatarFallback>{profile.company_title?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{profile.company_title || 'Company Profile'}</CardTitle>
          {profile.bio && <CardDescription>{profile.bio}</CardDescription>}
        </div>
      </div>
      {isCurrentUser && !isEditing && (
        <Button onClick={() => setIsEditing(true)} className="mt-4 md:mt-0">
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      )}
      {isEditing && (
        <Button onClick={onSave} className="mt-4 md:mt-0">
          <Save className="mr-2 h-4 w-4" /> Save
        </Button>
      )}
    </div>
  );
}

