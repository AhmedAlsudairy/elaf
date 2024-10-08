/* eslint-disable react/display-name */

"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TenderInfo from "./tender-info";
import TenderContent from "./tender-content";
import CompanyCard from "./company-card";
import { getCurrentCompanyProfile } from "@/actions/supabase/get-current-company-profile";
import { addTenderRequest } from "@/actions/supabase/add-tender-request";
import { useIsOwnerOfCompany } from "@/hooks/check-current-user";
import CompanyOwnerTenderDetails from "./price-summary";
import { format } from "date-fns";
import {
  getRequestSummaries,
  RequestSummary,
} from "@/actions/supabase/get-request-summary";
import RequestSummaryCard from "../requesttender/request-summary-card";
import TenderRequestList from "../requesttender/tender-req-list-main";
import TenderRequestForm, {
  tenderRequestSchema,
} from "../requesttender/request-tender-form";
import { acceptTenderRequest } from "@/actions/supabase/accept-tender-request";
import { z } from "zod";
import { createOrGetChatRoom } from "@/actions/supabase/chats";
import { useRouter } from "next/navigation";

enum SectorEnum {
  Technology = "Technology",
  Finance = "Finance",
  Healthcare = "Healthcare",
  Education = "Education",
  Manufacturing = "Manufacturing",
  Retail = "Retail",
  RealEstate = "RealEstate",
  Transportation = "Transportation",
  Energy = "Energy",
  Entertainment = "Entertainment",
}

enum TenderStatusEnum {
  Open = "open",
  Closed = "closed",
  Awarded = "awarded",
  Done = "done",
}

interface Company {
  company_profile_id: string;
  company_title: string;
  company_email: string;
  profile_image: string;
}

interface Tender {
  tender_id: string;
  title: string;
  summary: string;
  pdf_url: string;
  end_date: string | null;
  status: TenderStatusEnum;
  terms: string;
  scope_of_works: string;
  tender_sectors: SectorEnum[];
  created_at: string | null;
  currency: z.infer<typeof tenderRequestSchema>["currency"];
  average_price?: number;
  maximum_price?: number;
  minimum_price?: number;
}

interface SingleTenderClientComponentProps {
  tender: Tender;
  company: Company;
}

const SingleTenderClientComponent: React.FC<
  SingleTenderClientComponentProps
> = ({ tender, company }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showScopeOfWork, setShowScopeOfWork] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<Company | null>(null);
  const [currentCompanyProfile, setCurrentCompanyProfile] =
    useState<Company | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const { toast } = useToast();
  const { isOwner, isLoading } = useIsOwnerOfCompany(
    company.company_profile_id
  );
  const queryClient = useQueryClient();
  const [requestSummaries, setRequestSummaries] = useState<RequestSummary[]>(
    []
  );
  const [hasMoreSummaries, setHasMoreSummaries] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoadingSummaries, setIsLoadingSummaries] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [acceptedRequest, setAcceptedRequest] = useState<RequestSummary | null>(
    null
  );
  const router = useRouter();

  const loadMoreSummaries = useCallback(async () => {
    if (isOwner && !isLoadingSummaries) {
      setIsLoadingSummaries(true);
      try {
        const result = await getRequestSummaries(tender.tender_id, page);
        if (result.success && result.data) {
          setRequestSummaries((prev) => [...prev, ...result.data]);
          setPage((prev) => prev + 1);
          setHasMoreSummaries(result.data.length > 0);
          setSummaryError(null);
        } else {
          setSummaryError(result.error || "Failed to load summaries");
        }
      } catch (error) {
        console.error("Error loading summaries:", error);
        setSummaryError("An unexpected error occurred");
      } finally {
        setIsLoadingSummaries(false);
      }
    }
  }, [isOwner, tender.tender_id, page, isLoadingSummaries]);

  useEffect(() => {
    if (isOwner) {
      loadMoreSummaries();
    }
  }, [isOwner, loadMoreSummaries]);

  useEffect(() => {
    const fetchCompanyProfiles = async () => {
      const profile = await getCurrentCompanyProfile();
      setCompanyProfile(profile);
      setCurrentCompanyProfile(profile);
    };
    fetchCompanyProfiles();
  }, []);

  const handleTenderRequestSubmit = useCallback(
    async (formData: any, pdfBlob?: Blob) => {
      try {
        const result = await addTenderRequest(tender.tender_id, formData);
        if (result.success) {
          toast({
            title: "Success",
            description: "Your tender request has been submitted.",
          });
          setIsDialogOpen(false);
        } else {
          toast({
            title: "Error",
            description:
              result.error ||
              "Failed to submit tender request. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    },
    [tender.tender_id, toast]
  );

  const handleAcceptRequest = useCallback(
    async (requestId: string) => {
      try {
        const result = await acceptTenderRequest(requestId, tender.tender_id);
        if (result.success) {
          toast({
            title: "Request Accepted",
            description: `Tender request ${requestId} has been accepted.`,
          });
          await loadMoreSummaries();
          const accepted = requestSummaries.find(
            (summary) => summary.id === requestId
          );
          if (accepted) {
            setAcceptedRequest(accepted);
          }
        } else {
          toast({
            title: "Error",
            description:
              result.error ||
              "Failed to accept tender request. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    },
    [tender.tender_id, toast, requestSummaries, loadMoreSummaries]
  );

  const handleOpenChatRoom = useCallback(async () => {
    if (!currentCompanyProfile) {
      toast({
        title: "Error",
        description: "Unable to fetch your company profile. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingChat(true);

    try {
      const result = await createOrGetChatRoom(
        currentCompanyProfile.company_profile_id,
        company.company_profile_id,
        tender.tender_id
      );
      if (result && result.chat_room_id) {
        router.push(`/chats/${result.chat_room_id}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to open chat room. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingChat(false);
    }
  }, [
    currentCompanyProfile,
    company.company_profile_id,
    tender.tender_id,
    router,
    toast,
  ]);

  const formatDate = useCallback((dateString: string | null): string => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : format(date, "PPP");
  }, []);

  const ToggleButton = useMemo(() => {
    return ({
      isShown,
      onClick,
      title,
    }: {
      isShown: boolean;
      onClick: () => void;
      title: string;
    }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className="mb-2 flex items-center"
      >
        {isShown ? (
          <ChevronUp className="mr-2 h-4 w-4" />
        ) : (
          <ChevronDown className="mr-2 h-4 w-4" />
        )}
        {isShown ? `Hide ${title}` : `Show ${title}`}
      </Button>
    );
  }, []);

  const isTenderClosed =
    tender.status === TenderStatusEnum.Closed ||
    tender.status === TenderStatusEnum.Awarded ||
    !!acceptedRequest;

  const getBadgeVariant = (
    status: TenderStatusEnum
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case TenderStatusEnum.Open:
        return "default";
      case TenderStatusEnum.Closed:
        return "secondary";
      case TenderStatusEnum.Awarded:
        return "outline";
      default:
        return "default";
    }
  };

 if (isLoading) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold">
                  {tender.title || "Untitled Tender"}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={getBadgeVariant(tender.status)}>
                    {tender.status}
                  </Badge>
                  {/* TODO: Add loading button, done✅ */}
                  {!isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenChatRoom}
                      className="flex items-center"
                      disabled={!currentCompanyProfile || isLoadingChat}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {acceptedRequest && (
                <div className="mb-4 p-4 bg-green-100 rounded-md">
                  <h3 className="text-lg font-semibold text-green-800">
                    Accepted Request
                  </h3>
                  <p>Company: {acceptedRequest.company_title}</p>
                  <p>
                    Bid Price: {tender.currency}{" "}
                    {acceptedRequest.bid_price.toFixed(2)}
                  </p>
                </div>
              )}

              <h3 className="text-xl font-semibold mb-2">Summary</h3>
              <p className="text-gray-600 mb-4">
                {tender.summary || "No summary available"}
              </p>
              <TenderInfo
                icon={<Calendar className="w-5 h-5 text-gray-500" />}
                label="End Date"
                value={formatDate(tender.end_date)}
              />
              <TenderInfo
                icon={<Clock className="w-5 h-5 text-gray-500" />}
                label="Created"
                value={formatDate(tender.created_at)}
              />

              {tender.pdf_url && (
                <TenderInfo
                  icon={<FileText className="w-5 h-5 text-gray-500" />}
                  label="PDF"
                  value={
                    <a
                      href={tender.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View PDF
                    </a>
                  }
                />
              )}
              <Separator className="my-4" />

              <ToggleButton
                isShown={showScopeOfWork}
                onClick={() => setShowScopeOfWork(!showScopeOfWork)}
                title="Scope of Work"
              />
              {showScopeOfWork && (
                <TenderContent
                  title="Scope of Work"
                  content={tender.scope_of_works}
                />
              )}

              <ToggleButton
                isShown={showTerms}
                onClick={() => setShowTerms(!showTerms)}
                title="Terms"
              />
              {showTerms && (
                <TenderContent title="Terms" content={tender.terms} />
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {tender.tender_sectors.map((sector, index) => (
                  <Badge
                    key={index}
                    className="px-3 py-1 text-sm"
                    variant="outline"
                  >
                    {sector}
                  </Badge>
                ))}
              </div>

              {isOwner ? (
                <div className="mt-10">
                  <CompanyOwnerTenderDetails tender={tender} />
                </div>
              ) : (
                !isTenderClosed && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="mt-4 w-full sm:w-auto">
                        Submit Bid Tender Notice
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[1200px] h-[90vh] max-h-[900px] p-0 flex flex-col">
                      <DialogHeader className="p-6 bg-gray-100 shrink-0">
                        <DialogTitle className="text-xl sm:text-2xl">
                          Submit Bid Tender Notice
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto">
                        {companyProfile ? (
                          <TenderRequestForm
                            onSubmit={handleTenderRequestSubmit}
                            tenderId={tender.tender_id}
                            companyProfile={companyProfile}
                            tenderTitle={tender.title}
                            tenderCurrency={tender.currency}
                          />
                        ) : (
                          <p className="text-center text-red-500">
                            Please create a company profile to submit a tender
                            request.
                          </p>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                )
              )}
            </CardContent>
          </Card>

          {isOwner && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Bid Tender Notices</CardTitle>
              </CardHeader>
              <CardContent>
                <TenderRequestList
                  tenderId={tender.tender_id}
                  onAccept={handleAcceptRequest}
                  acceptedRequestId={acceptedRequest?.id}
                  tenderCurrency={tender.currency}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <div className="h-[calc(100vh-2rem)]">
          {isOwner ? (
            <RequestSummaryCard
              requestSummaries={requestSummaries}
              TenderCurrency={tender.currency}
              hasMore={hasMoreSummaries}
              loadMore={loadMoreSummaries}
              isLoading={isLoadingSummaries}
              error={summaryError}
            />
          ) : (
            <CompanyCard company={company} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleTenderClientComponent;
