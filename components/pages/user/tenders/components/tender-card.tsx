import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TenderCardProps {
  companyId: string;
  tenderId: string;
  companyTitle: string;
  profileImage: string;
  sectors: string[];
  startingDate: string;
  tenderTitle: string;
  summary: string;
  status: 'open' | 'closed' | 'awarded'; // Add this new prop
}

const TenderCard: React.FC<TenderCardProps> = ({
  companyId,
  tenderId,
  companyTitle,
  profileImage,
  sectors,
  startingDate,
  tenderTitle,
  summary,
  status // Add this new prop
}) => {
  // Function to determine badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'closed':
        return 'bg-red-500 hover:bg-red-600';
      case 'awarded':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
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
          {status.charAt(0).toUpperCase() + status.slice(1)}
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
        <p className="text-sm text-gray-500">Starting Date: {startingDate}</p>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Tender ID: {tenderId}
      </CardFooter>
    </Card>
  );
};

export default TenderCard;