import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase, Mail } from 'lucide-react';
import TenderInfo from './tender-info';

interface Company {
  company_profile_id: string;
  company_title: string;
  company_email: string;
  profile_image: string;
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
          <AvatarImage src={company.profile_image} alt={company.company_title || 'Company'} />
          <AvatarFallback>{company.company_title ? company.company_title.charAt(0) : 'C'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{company.company_title || 'Unknown Company'}</h3>
          <p className="text-gray-600">{company.company_email || 'No email provided'}</p>
        </div>
      </div>
      <TenderInfo icon={<Briefcase className="w-5 h-5 text-gray-500" />} label="ID" value={company.company_profile_id || 'Unknown'} />
      {company.company_email && (
        <TenderInfo 
          icon={<Mail className="w-5 h-5 text-gray-500" />} 
          label="Email" 
          value={<a href={`mailto:${company.company_email}`} className="text-blue-600 hover:underline">{company.company_email}</a>} 
        />
      )}
      {company.company_profile_id && (
        <Link href={`/profile/companyprofile/${company.company_profile_id}`} passHref>
          <Button className="w-full mt-4">View Full Profile</Button>
        </Link>
      )}
    </CardContent>
  </Card>
);

export default CompanyCard;