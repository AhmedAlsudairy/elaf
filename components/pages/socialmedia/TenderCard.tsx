"use client";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Link from "next/link";

interface TenderCardProps {
  tender: {
    id: string;
    title: string;
    summary: string;
    tenderSectors: string[];
    endDate: Date;
    currency: string;
  };
}

export default function TenderCard({ tender }: TenderCardProps) {
  const isExpired = new Date(tender.endDate) < new Date();

  return (
    <Link href={`/tenders/${tender.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{tender.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {tender.summary}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              {tender.tenderSectors.slice(0, 3).map((sector) => (
                <Badge key={sector} variant="outline">
                  {sector}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  Ends {new Date(tender.endDate).toLocaleDateString()}
                </span>
              </div>
              <Badge variant={isExpired ? "destructive" : "default"}>
                {isExpired ? "Expired" : "Active"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}