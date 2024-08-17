import React from "react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Calendar, DollarSign } from "lucide-react";
import Image from "next/image";

enum TenderRequestStatusEnum {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected'
}

export interface TenderRequest {
  id: string;
  tender_id: string;
  company_profile_id: string;
  bid_price: number;
  title: string;
  summary: string;
  pdf_url?: string;
  status: TenderRequestStatusEnum;
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
  isAccepted: boolean;
  showAcceptButton: boolean;
}

const TenderRequestCard: React.FC<TenderRequestCardProps> = ({
  request,
  onAccept,
  isAccepted,
  showAcceptButton,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "Invalid date";
    }
  };

  const getStatusBadge = (status: TenderRequestStatusEnum) => {
    switch (status) {
      case TenderRequestStatusEnum.Pending:
        return <Badge variant="default">Pending</Badge>;
      case TenderRequestStatusEnum.Accepted:
        return <Badge variant="secondary">Accepted</Badge>;
      case TenderRequestStatusEnum.Rejected:
        return <Badge variant="destructive">Rejected</Badge>;
    }
  };

  return (
    <Card className={`mb-4 hover:shadow-lg transition-shadow duration-300 ${isAccepted ? 'border-green-500 border-2' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {request.company_profile.profile_image ? (
              <Image
                src={request.company_profile.profile_image}
                alt={request.company_profile.company_title}
                width={48}
                height={48}
                className="rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">
                  {request.company_profile.company_title.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <Link 
                href={`/profile/companyprofiles/${request.company_profile_id}`}
                className="hover:underline"
              >
                <CardTitle className="flex items-center">
                  {request.company_profile.company_title}
                  <ExternalLink className="ml-2 w-4 h-4" />
                </CardTitle>
              </Link>
              <p className="text-sm text-gray-500">
                ID: {request.company_profile_id}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg text-green-600 flex items-center justify-end">
              <DollarSign className="w-5 h-5 mr-1" />
              {request.bid_price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 flex items-center justify-end">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(request.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-lg mb-2">{request.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{request.summary}</p>
        <div className="flex justify-between items-center">
          {request.pdf_url && (
            <a
              href={request.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center"
            >
              <FileText className="w-4 h-4 mr-1" />
              View PDF
            </a>
          )}
          <div className="flex items-center space-x-2">
            {getStatusBadge(request.status)}
            {showAcceptButton && request.status === TenderRequestStatusEnum.Pending && (
              <Button 
                onClick={() => onAccept(request.id)} 
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Accept Request
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenderRequestCard;