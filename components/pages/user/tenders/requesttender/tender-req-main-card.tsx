import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Calendar } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { currencyT } from "@/types";

import { useToast } from "@/components/ui/use-toast";
import { addRating } from "@/actions/supabase/add-rating";
import TenderCompletionButton from "@/components/common/user/rating/tender-req-rating";
import { getCurrentCompanyProfile } from "@/actions/supabase/get-current-company-profile";

enum TenderRequestStatusEnum {
  Pending = "pending",
  Accepted = "accepted",
  Rejected = "rejected",
  Done = "done",
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
  tenderCurrency: currencyT;
  onAccept: (id: string) => Promise<void>;
  isAccepted: boolean;
  showAcceptButton: boolean;
}

const TenderRequestCard: React.FC<TenderRequestCardProps> = ({
  request,
  onAccept,
  isAccepted,
  showAcceptButton,
  tenderCurrency,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCompanyProfile, setCurrentCompanyProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCurrentCompanyProfile() {
      const profile = await getCurrentCompanyProfile();
      setCurrentCompanyProfile(profile);
    }
    fetchCurrentCompanyProfile();
  }, []);

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
      case TenderRequestStatusEnum.Done:
        return <Badge variant="outline">Done</Badge>;
    }
  };

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept(request.id);
      toast({
        title: "Request Accepted",
        description: "The tender request has been accepted successfully.",
      });
    } catch (error) {
      console.error("Error accepting request:", error);
      toast({
        title: "Error",
        description: "Failed to accept the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleRatingSubmit = async (rating: {
    quality: number;
    communication: number;
    experience: number;
    deadline: number;
    comment: string;
    isAnonymous: boolean;
  }) => {
    if (!currentCompanyProfile) {
      toast({
        title: "Error",
        description:
          "Unable to submit rating. Current company profile not found.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addRating({
        ratingCompanyId: currentCompanyProfile.company_profile_id,
        ratedCompanyId: request.company_profile_id,
        tenderId: request.tender_id,
        tenderRequestId: request.id,
        quality: rating.quality,
        communication: rating.communication,
        experience: rating.experience,
        deadline: rating.deadline,
        comment: rating.comment,
        isAnonymous: rating.isAnonymous,
      });

      if (result.success) {
        toast({
          title: "Rating Submitted",
          description: "Your rating has been submitted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to submit rating: ${result.error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error submitting rating:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className={`mb-4 hover:shadow-lg transition-shadow duration-300 ${
        isAccepted ? "border-green-500 border-2" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
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
                  <span className="truncate max-w-[200px]">
                    {request.company_profile.company_title}
                  </span>
                  <ExternalLink className="ml-2 w-4 h-4 flex-shrink-0" />
                </CardTitle>
              </Link>
              <p className="text-sm text-gray-500">
                ID: {request.company_profile_id}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-semibold text-lg text-green-600 flex items-center sm:justify-end">
              {request.bid_price.toFixed(2)} {tenderCurrency}
            </p>
            <p className="text-sm text-gray-500 flex items-center sm:justify-end">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(request.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold text-lg mb-2">{request.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{request.summary}</p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            {getStatusBadge(request.status)}
            {showAcceptButton &&
              request.status === TenderRequestStatusEnum.Pending && (
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-green-500 hover:bg-green-600 text-white mt-2 sm:mt-0"
                  disabled={isLoading}
                >
                  {isLoading ? "Accepting..." : "Accept Request"}
                </Button>
              )}
            {request.status === TenderRequestStatusEnum.Accepted &&
              currentCompanyProfile && (
                <TenderCompletionButton
                  companyProfileId={request.company_profile_id}
                  tenderId={request.tender_id}
                  onComplete={handleRatingSubmit}
                />
              )}
          </div>
        </div>
      </CardContent>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Tender Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this tender request? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAccept} disabled={isLoading}>
              {isLoading ? "Accepting..." : "Accept"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TenderRequestCard;
