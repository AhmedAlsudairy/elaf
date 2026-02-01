"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FollowButton from "./FollowButton";

interface CompanyProfileHeaderProps {
  company: {
    id: string;
    companyTitle: string;
    bio: string | null;
    profileImage: string | null;
    sectors: string[];
    _count: {
      followers: number;
      posts: number;
      tenders: number;
    };
  };
  isFollowing: boolean;
  isOwnCompany: boolean;
  currentUserId: string;
}

export default function CompanyProfileHeader({
  company,
  isFollowing,
  isOwnCompany,
  currentUserId,
}: CompanyProfileHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Cover Image Placeholder */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600" />

      <div className="px-6 pb-6">
        {/* Avatar & Action Button */}
        <div className="flex items-end justify-between -mt-16 mb-4">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage src={company.profileImage || ""} alt={company.companyTitle} />
            <AvatarFallback className="text-3xl">
              {company.companyTitle.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {isOwnCompany ? (
            <Button variant="outline" className="mt-4">
              Edit Profile
            </Button>
          ) : (
            <FollowButton
              companyId={company.id}
              initialIsFollowing={isFollowing}
              currentUserId={currentUserId}
            />
          )}
        </div>

        {/* Company Info */}
        <div>
          <h1 className="text-3xl font-bold">{company.companyTitle}</h1>
          {company.bio && (
            <p className="text-gray-600 mt-2 max-w-2xl">{company.bio}</p>
          )}

          {/* Sectors */}
          {company.sectors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {company.sectors.map((sector) => (
                <Badge key={sector} variant="secondary">
                  {sector}
                </Badge>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="font-bold">{company._count.followers}</span>{" "}
              <span className="text-gray-600">Followers</span>
            </div>
            <div>
              <span className="font-bold">{company._count.posts}</span>{" "}
              <span className="text-gray-600">Posts</span>
            </div>
            <div>
              <span className="font-bold">{company._count.tenders}</span>{" "}
              <span className="text-gray-600">Tenders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}