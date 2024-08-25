import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Tender {
  average_price?: number | null;
  maximum_price?: number | null;
  minimum_price?: number | null;
  currency: string; // Add this line
}

interface CompanyOwnerTenderDetailsProps {
  tender: Tender;
}

const CompanyOwnerTenderDetails: React.FC<CompanyOwnerTenderDetailsProps> = ({ tender }) => {
  const formatPrice = (price?: number | null) => {
    return price != null ? `${tender.currency} ${price.toFixed(2)}` : 'N/A';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Tender Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Average Price</h3>
            <p>{formatPrice(tender.average_price)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Maximum Price</h3>
            <p>{formatPrice(tender.maximum_price)}</p>
          </div>
          <div>
            <h3 className="font-semibold">Minimum Price</h3>
            <p>{formatPrice(tender.minimum_price)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyOwnerTenderDetails;