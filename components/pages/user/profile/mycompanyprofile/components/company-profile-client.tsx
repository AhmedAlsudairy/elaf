'use client'

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { SectionTab } from '@/types';

interface CompanyProfileClientProps {
  sections: SectionTab[];
  children: React.ReactNode;
}

const CompanyProfileClient: React.FC<CompanyProfileClientProps> = ({ sections, children }) => {
  const pathname = usePathname();
  let activeTab = '';

//TODO:improve to be SOLID


  if (pathname.includes('/tenders')) {
    activeTab = 'tenders';
  } else if (pathname.includes('/requests')) {
    activeTab = 'requests';
  }else if (pathname.includes('/rate')) {

    activeTab = 'rate';
  } 
  
  else {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const secondLastSegment = pathSegments[pathSegments.length - 2];

    if (sections.some(section => section.id === lastSegment)) {
      activeTab = lastSegment;
    } else if (secondLastSegment === 'companyprofiles') {
      // This is the main company profile page (previously "info")
      activeTab = '';
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto">
      <div className="w-full md:w-64 md:mr-4">
        <Sidebar sections={sections} activeTab={activeTab} />
      </div>
      <div className="flex-1 mt-4 md:mt-0">
        {children}
      </div>
    </div>
  );
};

export default CompanyProfileClient;