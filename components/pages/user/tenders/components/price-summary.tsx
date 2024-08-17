import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Tender {
  average_price?: number;
  maximum_price?: number;
  minimum_price?: number;
}

interface CompanyOwnerTenderDetailsProps {
  tender: Tender;
}

const CompanyOwnerTenderDetails: React.FC<CompanyOwnerTenderDetailsProps> = ({ tender }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tender Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Average Price</h3>
            <p>{tender.average_price !== undefined ? `$${tender.average_price?.toFixed(2)}` : 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Maximum Price</h3>
            <p>{tender.maximum_price !== undefined ? `$${tender.maximum_price?.toFixed(2)}` : 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold">Minimum Price</h3>
            <p>{tender.minimum_price !== undefined ? `$${tender.minimum_price?.toFixed(2)}` : 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyOwnerTenderDetails;