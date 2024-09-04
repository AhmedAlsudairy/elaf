import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CompanyRatings {
  avg_quality: number | null;
  avg_communication: number | null;
  avg_experience: number | null;
  avg_deadline: number | null;
  avg_overall_rating: number | null;
  number_of_ratings: number;
}

interface CompanyRatingHeaderProps {
  ratings: CompanyRatings | null | undefined;
}

const RatingStars: React.FC<{ rating: number | null }> = ({ rating }) => {
  if (rating === null) return null;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < fullStars ? (
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ) : i === fullStars && hasHalfStar ? (
            <StarHalf className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ) : (
            <Star className="w-5 h-5 text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );
};

const RatingCategory: React.FC<{ label: string; value: number | null }> = ({ label, value }) => {
  if (value === null) return null;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value.toFixed(1)}</span>
      </div>
      <Progress value={value * 20} className="h-2" />
    </div>
  );
};

const CompanyRatingHeader: React.FC<CompanyRatingHeaderProps> = ({ ratings }) => {
  if (!ratings || ratings.number_of_ratings === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Company Ratings</CardTitle>
          <CardDescription className="text-center">
            No ratings available for this company yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Company Ratings</CardTitle>
        <CardDescription className="text-center">
          Based on {ratings.number_of_ratings} {ratings.number_of_ratings === 1 ? 'review' : 'reviews'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {ratings.avg_overall_rating !== null && (
          <div className="flex flex-col items-center space-y-2">
            <span className="text-4xl font-bold">{ratings.avg_overall_rating.toFixed(1)}</span>
            <RatingStars rating={ratings.avg_overall_rating} />
          </div>
        )}
        <div className="space-y-4">
          <RatingCategory label="Quality" value={ratings.avg_quality} />
          <RatingCategory label="Communication" value={ratings.avg_communication} />
          <RatingCategory label="Experience" value={ratings.avg_experience} />
          <RatingCategory label="Deadline" value={ratings.avg_deadline} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyRatingHeader;