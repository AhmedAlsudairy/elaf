import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, differenceInDays } from 'date-fns';

interface TenderCardProps {
  companyId: string;
  tenderId: string;
  companyTitle: string;
  profileImage: string;
  sectors: string[];
  startingDate: string;
  endDate: string;
  tenderTitle: string;
  summary: string;
  status: 'open' | 'closed' | 'awarded';
  address: string;
}

const TenderCard: React.FC<TenderCardProps> = ({
  companyId,
  tenderId,
  companyTitle,
  profileImage,
  sectors,
  startingDate,
  endDate,
  tenderTitle,
  summary,
  status,
  address
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yy');
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const end = new Date(endDate);
    const daysRemaining = differenceInDays(end, today);
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-500 hover:bg-green-600';
      case 'closed':
        return 'bg-red-500 hover:bg-red-600';
      case 'awarded':
        return 'bg-blue-500 hover:bg-blue-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadgeContent = () => {
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    if (status === 'open') {
      const daysRemaining = getDaysRemaining();
      return `${statusText} • ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`;
    }
    return statusText;
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={profileImage} alt={companyTitle} />
            <AvatarFallback>{companyTitle.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{companyTitle}</h3>
            <p className="text-sm text-gray-500">Company ID: {companyId}</p>
          </div>
        </div>
        <Badge className={`${getStatusBadgeColor(status)} text-white`}>
          {getStatusBadgeContent()}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="text-xl font-bold mb-2">{tenderTitle}</h4>
        <p className="text-sm text-gray-600 mb-4">{summary}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {sectors.map((sector, index) => (
            <Badge key={index} variant="secondary">{sector}</Badge>
          ))}
        </div>
        <p className="text-sm text-gray-500">Start Date: {formatDate(startingDate)}</p>
        <p className="text-sm text-gray-500">End Date: {formatDate(endDate)}</p>
        <p className="text-sm text-gray-500 mt-2">Address: {address}</p>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Tender ID: {tenderId}
      </CardFooter>
    </Card>
  );
};

export default TenderCard;