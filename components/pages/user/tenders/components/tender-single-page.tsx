/* eslint-disable react/display-name */

'use client'
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TenderInfo from "./tender-info";
import TenderContent from "./tender-content";
import CompanyCard from "./company-card";
import { getCurrentCompanyProfile } from "@/actions/supabase/get-current-company-profile";
import TenderRequestForm from "../requesttender/request-tender-form";
import { addTenderRequest } from "@/actions/supabase/add-tender-request";
import { useIsOwnerOfCompany } from "@/hooks/check-current-user";
import CompanyOwnerTenderDetails from "./price-summary";
import TenderRequestList from "../requesttender/tender-req-list-main";
import { format } from "date-fns";
import RequestSummaryCard from "../requesttender/request-summary-card";
import { getRequestSummaries, RequestSummary } from "@/actions/supabase/get-request-summary";
import { useCallback, useMemo, useState } from "react";

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
  status: "open" | "closed";
  terms: string;
  scope_of_works: string;
  tender_sectors: string[];
  created_at: string | null;
  average_price?: number;
  maximum_price?: number;
  minimum_price?: number;
}

interface SingleTenderClientComponentProps {
  tender: Tender;
  company: Company;
}
const SingleTenderClientComponent = ({ tender, company }:SingleTenderClientComponentProps) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showScopeOfWork, setShowScopeOfWork] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { isOwner, isLoading: isLoadingOwnership } = useIsOwnerOfCompany(company.company_profile_id);

  const { data: companyProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: getCurrentCompanyProfile,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['requestSummaries', tender.tender_id],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getRequestSummaries(tender.tender_id, pageParam as number);
      return result;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.success && lastPage.data && lastPage.data.length > 0) {
        return pages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    enabled: isOwner,
  });

  const requestSummaries = useMemo(() => {
    return data?.pages.flatMap(page => page.data || []) || [];
  }, [data]);

  const handleTenderRequestSubmit = useCallback(async (formData: any, pdfBlob?: Blob) => {
    try {
      const result = await addTenderRequest(tender.tender_id, formData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Your tender request has been submitted.",
        });
        setIsDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['requestSummaries', tender.tender_id] });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit tender request. Please try again.",
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
  }, [tender.tender_id, toast, queryClient]);

  const handleAcceptRequest = useCallback(async (requestId: string) => {
    console.log(`Accepting request ${requestId}`);
    toast({
      title: "Request Accepted",
      description: `Tender request ${requestId} has been accepted.`,
    });
    queryClient.invalidateQueries({ queryKey: ['requestSummaries', tender.tender_id] });
  }, [toast, queryClient, tender.tender_id]);

  const formatDate = useCallback((dateString: string | null): string => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : format(date, "PPP");
  }, []);

  const ToggleButton = useMemo(() => {
    return ({ isShown, onClick, title }: { isShown: boolean; onClick: () => void; title: string }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className="mb-2 flex items-center"
      >
        {isShown ? <ChevronUp className="mr-2 h-4 w-4" /> : <ChevronDown className="mr-2 h-4 w-4" />}
        {isShown ? `Hide ${title}` : `Show ${title}`}
      </Button>
    );
  }, []);

  if (isLoadingOwnership || isLoadingProfile) {
    return <div>Loading...</div>;
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
                <Badge variant={tender.status === "open" ? "default" : "destructive"}>
                  {tender.status || "Unknown"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
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
                {tender.tender_sectors &&
                  tender.tender_sectors.map((sector, index) => (
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
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4 w-full sm:w-auto">
                      Submit Tender Request
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[1200px] h-[90vh] max-h-[900px] p-0 flex flex-col">
                    <DialogHeader className="p-6 bg-gray-100 shrink-0">
                      <DialogTitle className="text-xl sm:text-2xl">
                        Submit Tender Request
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto">
                      {companyProfile && (
                        <TenderRequestForm
                          onSubmit={handleTenderRequestSubmit}
                          tenderId={tender.tender_id}
                          companyProfile={companyProfile}
                          tenderTitle={tender.title}
                        />
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>

          {isOwner && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tender Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <TenderRequestList
                  tenderId={tender.tender_id}
                  onAccept={handleAcceptRequest}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <div className="h-[calc(100vh-2rem)]">
          {isOwner ? (
            <RequestSummaryCard
              requestSummaries={requestSummaries}
              hasMore={!!hasNextPage}
              loadMore={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
              error={status === 'error' ? 'Failed to load summaries' : null}
            />
          ) : (
            <CompanyCard company={company} />
          )}
        </div>
      </div>
    </div>
  );
};


SingleTenderClientComponent.displayName = 'SingleTenderClientComponent';

export default SingleTenderClientComponent;