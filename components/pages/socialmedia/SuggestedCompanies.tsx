
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getSuggestedCompanies } from "@/actions/neon/company/get-suggested-companies";

type Company = {
  id: string;
  companyTitle: string;
  profileImage: string | null;
  sectors: string[];
};

export default function SuggestedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuggestedCompanies().then((data) => {
      setCompanies(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 animate-pulse">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company) => (
        <div key={company.id} className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            {company.profileImage && (
              <AvatarImage src={company.profileImage} alt={company.companyTitle} />
            )}
            <AvatarFallback>
              {company.companyTitle.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{company.companyTitle}</p>
            <p className="text-xs text-gray-500">
              {company.sectors[0] ?? "Company"}
            </p>
          </div>
          <Button size="sm" variant="outline">
            Follow
          </Button>
        </div>
      ))}
    </div>
  );
}