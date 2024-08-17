import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface RequestSummary {
  id: string;
  company_title: string;
  bid_price: number;
  pdf_url: string | null;
}

interface RequestSummaryCardProps {
  requestSummaries: RequestSummary[];
  hasMore: boolean;
  loadMore: () => void;
  isLoading: boolean;
}

const RequestSummaryCard: React.FC<RequestSummaryCardProps> = ({
  requestSummaries,
  hasMore,
  loadMore,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Summaries</CardTitle>
      </CardHeader>
      <CardContent>
        {requestSummaries.map((summary) => (
          <div key={summary.id} className="mb-4 p-4 border rounded">
            <h3 className="font-semibold">{summary.company_title}</h3>
            <p>Bid Price: ${summary.bid_price.toFixed(2)}</p>
            {summary.pdf_url && (
              <a href={summary.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View PDF
              </a>
            )}
          </div>
        ))}
        {hasMore && (
          <Button onClick={loadMore} disabled={isLoading} className="w-full mt-4">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestSummaryCard;