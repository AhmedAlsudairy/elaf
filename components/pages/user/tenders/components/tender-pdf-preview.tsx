'use client';

import React, { useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import PDFDocument from '@/components/common/pdf-generate';

interface TenderPDFPreviewProps {
  data: any;
  companyLogo: string;
  elafLogo: string;
}

const TenderPDFPreview: React.FC<TenderPDFPreviewProps> = ({ data, companyLogo, elafLogo }) => {
  useEffect(() => {
    console.log("TenderPDFPreview mounted with data:", data);
  }, [data]);

  return (
    <PDFViewer width="100%" height="100%" className="w-full h-full">
      <PDFDocument 
        data={data} 
        companyLogo={companyLogo} 
        elafLogo={elafLogo} 
      />
    </PDFViewer>
  );
};

export default TenderPDFPreview;
