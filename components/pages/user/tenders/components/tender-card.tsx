import Link from 'next/link';
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
      return (
        <span className="flex items-center space-x-1">
          <span>{statusText}</span>
          <span>•</span>
          <span className="whitespace-nowrap">{daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left</span>
        </span>
      );
    }
    return statusText;
  };

  return (
    <Link href={`/tenders/${tenderId}`} className="block w-full h-full">
      <Card className="w-full h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 space-y-2 sm:space-y-0">
          <Link href={`/profile/companyprofile/${companyId}`} className="flex items-center space-x-4">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage src={profileImage} alt={companyTitle} />
              <AvatarFallback>{companyTitle.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold line-clamp-1">{companyTitle}</h3>
              <p className="text-sm text-gray-500">Company ID: {companyId}</p>
            </div>
          </Link>
          <Badge className={`${getStatusBadgeColor(status)} text-white mt-2 sm:mt-0`}>
            {getStatusBadgeContent()}
          </Badge>
        </CardHeader>
        <CardContent className="flex-grow">
          <h4 className="text-xl font-bold mb-2 line-clamp-2">{tenderTitle}</h4>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{summary}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {sectors.map((sector, index) => (
              <Badge key={index} variant="secondary" className="text-xs">{sector}</Badge>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <p className="text-sm text-gray-500">Start: {formatDate(startingDate)}</p>
            <p className="text-sm text-gray-500">End: {formatDate(endDate)}</p>
          </div>
          <p className="text-sm text-gray-500 mt-2 line-clamp-1">Address: {address}</p>
        </CardContent>
        <CardFooter className="text-xs text-gray-500">
          Tender ID: {tenderId}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TenderCard;