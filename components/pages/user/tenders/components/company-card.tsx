import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Mail } from 'lucide-react';
import TenderInfo from './tender-info';

interface Company {
  companyProfileId: string | null;
  companyTitle: string;
  companyEmail: string;
  profileImage: string | null;
}

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl font-semibold">Company Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center mb-4">
        <Avatar className="h-16 w-16 mr-4">
          <AvatarImage src={company.profileImage ?? undefined} alt={company.companyTitle || 'Company'} />
          <AvatarFallback>{company.companyTitle ? company.companyTitle.charAt(0) : 'C'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{company.companyTitle || 'Unknown Company'}</h3>
          <p className="text-gray-600">{company.companyEmail || 'No email provided'}</p>
        </div>
      </div>
      <TenderInfo icon={<Briefcase className="w-5 h-5 text-gray-500" />} label="ID" value={company.companyProfileId || 'Unknown'} />
      {company.companyEmail && (
        <TenderInfo 
          icon={<Mail className="w-5 h-5 text-gray-500" />} 
          label="Email" 
          value={<a href={`mailto:${company.companyEmail}`} className="text-blue-600 hover:underline">{company.companyEmail}</a>} 
        />
      )}
      {company.companyProfileId && (
        <Link href={`/profile/companyprofiles/${company.companyProfileId}`} passHref>
          <Button className="w-full mt-4">View Full Profile</Button>
        </Link>
      )}
    </CardContent>
  </Card>
);

export default CompanyCard;