import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/shadcn/utils';
import { currencyT } from '@/types';

interface TenderRequestCardProps {
  title: string;
  summary: string;
  price: number;
  currency: currencyT; // Add this line
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
  currency,
  tenderId,
  pdfUrl,
  tenderRequestStatus,
  tenderStatus,
  endDate,
}) => {
  const formattedEndDate = typeof endDate === 'string' 
    ? format(new Date(endDate), 'PPP') 
    : format(endDate, 'PPP');

  const isExpired = new Date(endDate) < new Date();

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold line-clamp-2">{title}</CardTitle>
        <CardDescription className="text-xs text-gray-500 mt-1 truncate">
          Tender ID: {tenderId}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <p className="text-xs mb-2 line-clamp-3">{summary}</p>
        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
          <p className="text-sm font-semibold">Price: {currency} {price.toFixed(2)}</p>
          <div className={cn(
            "flex items-center text-xs",
            isExpired ? "text-red-500" : "text-gray-500"
          )}>
            <Calendar className="mr-1 h-3 w-3 flex-shrink-0" />
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
            className="text-xs"
          >
            {tenderRequestStatus}
          </Badge>
          <Badge
            variant={
              tenderStatus === 'open' ? 'default' :
              tenderStatus === 'closed' ? 'secondary' :
              'outline'
            }
            className="text-xs"
          >
            {tenderStatus}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 p-4">
        <Button variant="outline" asChild className="flex-1 min-w-[120px] text-xs">
          <Link href={pdfUrl} target="_blank" rel="noopener noreferrer">
            <FileText className="mr-2 h-3 w-3" />
            View PDF
          </Link>
        </Button>
        <Button asChild className="flex-1 min-w-[120px] text-xs">
          <Link href={`/tenders/${tenderId}`}>
            <ExternalLink className="mr-2 h-3 w-3" />
            View Tender
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TenderRequestCard;