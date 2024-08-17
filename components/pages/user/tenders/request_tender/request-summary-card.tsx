import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, DollarSign, Building } from "lucide-react";
import { RequestSummary } from '@/actions/supabase/get-request-summary';

interface RequestSummaryCardProps {
  requestSummaries: RequestSummary[];
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
  error: string | null;
}

const RequestSummaryCard: React.FC<RequestSummaryCardProps> = ({
  requestSummaries,
  hasMore,
  loadMore,
  isLoading,
  error
}) => {
  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-500 flex items-center">
            <span className="mr-2">⚠️</span>
            Error: {error}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl font-bold">Request Summaries</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {requestSummaries.length === 0 && !isLoading ? (
          <p className="p-4 text-gray-500 italic">No request summaries available.</p>
        ) : (
          <div className="divide-y">
            {requestSummaries.map((summary) => (
              <div key={summary.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Building className="mr-2 h-5 w-5 text-gray-400" />
                    {summary.company_title}
                  </h3>
                  <span className="font-bold text-green-600 flex items-center">
                    <DollarSign className="mr-1 h-5 w-5" />
                    {summary.bid_price.toFixed(2)}
                  </span>
                </div>
                {summary.pdf_url && (
                  <a 
                    href={summary.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline flex items-center mt-2"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        {hasMore && (
          <div className="p-4 bg-gray-50 border-t">
            <Button 
              onClick={loadMore} 
              disabled={isLoading} 
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestSummaryCard;