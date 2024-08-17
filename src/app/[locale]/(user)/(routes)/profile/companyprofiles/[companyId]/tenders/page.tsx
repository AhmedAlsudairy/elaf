'use client'

import CompanyTendersList from '@/components/pages/user/tenders/components/company-tender-list';
import { useIsOwnerOfCompany } from '@/hooks/check-current-user';
import React from 'react';

import { ClipLoader } from 'react-spinners';

interface CompanyTendersPageProps {
  params: { companyId: string };
}

const CompanyTendersPage: React.FC<CompanyTendersPageProps> = ({ params }) => {
  const { companyId } = params;
  const { isOwner, isLoading, error } = useIsOwnerOfCompany(companyId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3B82F6" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        An error occurred: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CompanyTendersList companyId={companyId} isOwner={isOwner} />
    </div>
  );
};

export default CompanyTendersPage;
