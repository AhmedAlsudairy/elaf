import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/shadcn/utils';

interface TenderRequestCardProps {
  title: string;
  summary: string;
  price: number;
  tenderId: string;
  pdfUrl: string;
  tenderRequestStatus: 'pending' | 'accepted' | 'rejected';
  tenderStatus: 'open' | 'closed' | 'awarded';
  endDate: string | Date;
}

const TenderRequestCard: React.FC<TenderRequestCardProps> = ({
  title,
  summary,
  price,
  tenderId,
  pdfUrl,
  tenderRequestStatus,
  tenderStatus,
  endDate,
}) => {
  // Format the end date
  const formattedEndDate = typeof endDate === 'string' 
    ? format(new Date(endDate), 'PPP') 
    : format(endDate, 'PPP');

  // Determine if the tender is expired
  const isExpired = new Date(endDate) < new Date();

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold line-clamp-2">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-500 mt-1">
          Tender ID: {tenderId}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-2 line-clamp-3">{summary}</p>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold">Price: ${price.toFixed(2)}</p>
          <div className={cn(
            "flex items-center text-sm",
            isExpired ? "text-red-500" : "text-gray-500"
          )}>
            <Calendar className="mr-1 h-4 w-4" />
            <span>{isExpired ? "Expired: " : "Ends: "}{formattedEndDate}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge
            variant={
              tenderRequestStatus === 'accepted' ? 'default' :
              tenderRequestStatus === 'rejected' ? 'destructive' :
              'secondary'
            }
          >
            {tenderRequestStatus}
          </Badge>
          <Badge
            variant={
              tenderStatus === 'open' ? 'default' :
              tenderStatus === 'closed' ? 'secondary' :
              'outline'
            }
          >
            {tenderStatus}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 mt-auto">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <FileText className="mr-2 h-4 w-4" />
            View PDF
          </Link>
        </Button>
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/tenders/${tenderId}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Tender
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TenderRequestCard;