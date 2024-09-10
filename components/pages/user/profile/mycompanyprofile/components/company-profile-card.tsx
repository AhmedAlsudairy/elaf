import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Briefcase, Hash, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompanyCardProps {
  companyTitle: string;
  bio: string;
  email: string;
  profileImage?: string;
  companyId: string;
  sectors: string[];
  rating: number | null;
  numberOfRatings: number;
}

const StarRating: React.FC<{ rating: number | null }> = ({ rating }) => {
  const t = useTranslations('CompanyCard');
  const totalStars = 5;

  if (rating === null || rating === 0) {
    return <span className="text-sm text-gray-400">{t('noRatingsYet')}</span>;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < fullStars
              ? 'text-yellow-400 fill-current'
              : index === fullStars && hasHalfStar
              ? 'text-yellow-400 fill-current half-star'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export const CompanyCard: React.FC<CompanyCardProps> = ({
  companyTitle,
  bio,
  email,
  profileImage,
  companyId,
  sectors,
  rating,
  numberOfRatings
}) => {
  const t = useTranslations('CompanyCard');

  return (
    <Link href={`/profile/companyprofiles/${companyId}`} passHref>
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto cursor-pointer hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-col items-center sm:flex-row sm:items-start gap-4 p-4 sm:p-6">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mb-4 sm:mb-0 flex-shrink-0">
            {profileImage ? (
              <AvatarImage src={profileImage} alt={companyTitle} />
            ) : (
              <AvatarFallback>{companyTitle.slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col text-center sm:text-start w-full min-w-0">
            <CardTitle className="text-lg sm:text-xl md:text-2xl truncate">{companyTitle}</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start mt-1 overflow-hidden">
              <Mail className="me-1 sm:me-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start mt-1 overflow-hidden">
              <Hash className="me-1 sm:me-2 h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
              <span className="truncate">{t('id')}: {companyId}</span>
            </p>
            <div className="flex items-center justify-center sm:justify-start mt-2">
              <StarRating rating={rating} />
              {rating !== null && rating > 0 && (
                <span className="ms-2 text-xs sm:text-sm text-muted-foreground">
                  {rating.toFixed(1)} ({numberOfRatings})
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center justify-center sm:justify-start">
            <Briefcase className="me-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            {t('about')}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 text-center sm:text-start line-clamp-3">{bio}</p>
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-2 text-center sm:text-start">{t('sectors')}:</h4>
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start">
              {sectors.map((sector, index) => (
                <Badge key={index} className="bg-blue-100 text-blue-600 text-xs sm:text-sm">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 sm:p-6">
          <Button variant="outline" className="w-full text-xs sm:text-sm pointer-events-none">
            {t('viewCompanyProfile')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CompanyCard;