import React from "react";
import { format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface TenderRequest {
  id: string;
  tender_id: string;
  company_profile_id: string;
  bid_price: number;
  title: string;
  summary: string;
  pdf_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  company_profile: {
    company_title: string;
    profile_image?: string;
  };
}

export interface TenderRequestCardProps {
  request: TenderRequest;
  onAccept: (id: string) => void;
}

const TenderRequestCard: React.FC<TenderRequestCardProps> = ({
  request,
  onAccept,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{request.company_profile.company_title}</CardTitle>
            <p className="text-sm text-gray-500">
              ID: {request.company_profile_id}
            </p>
          </div>
          {request.company_profile.profile_image && (
            <img
              src={request.company_profile.profile_image}
              alt={request.company_profile.company_title}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">{request.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{request.summary}</p>
        <p className="font-semibold">
          Price: ${request.bid_price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">
          Submitted: {formatDate(request.created_at)}
        </p>
        {request.pdf_url && (
          <a
            href={request.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline block mb-2"
          >
            View PDF
          </a>
        )}
        <Button onClick={() => onAccept(request.id)} className="mt-2">
          Accept
        </Button>
      </CardContent>
    </Card>
  );
};

export default TenderRequestCard;