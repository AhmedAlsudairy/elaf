import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Briefcase, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  companyTitle: string;
  bio: string;
  email: string;
  profileImage?: string;
  companyId: string;
  sectors: string[];
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  companyTitle,
  bio,
  email,
  profileImage,
  companyId,
  sectors
}) => {
  return (
    <Link href={`/profile/companyprofiles/${companyId}`} passHref>
      <Card className="w-full max-w-2xl mx-auto cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            {profileImage ? (
              <AvatarImage src={profileImage} alt={companyTitle} />
            ) : (
              <AvatarFallback>{companyTitle.slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-2xl">{companyTitle}</CardTitle>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Mail className="mr-2 h-4 w-4 text-blue-600" />
              {email}
            </p>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Hash className="mr-2 h-4 w-4 text-blue-600" />
              ID: {companyId}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-blue-600" />
            About
          </h3>
          <p className="text-sm text-muted-foreground mb-4">{bio}</p>
          <div>
            <h4 className="font-semibold mb-2">Sectors:</h4>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-600">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full pointer-events-none">
            View Company Profile
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CompanyCard;