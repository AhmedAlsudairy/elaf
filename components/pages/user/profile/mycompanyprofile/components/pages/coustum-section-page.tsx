// app/[locale]/(user)/(routes)/profile/companyprofile/[companyId]/[sectionId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomSection } from '@/components/pages/user/profile/mycompanyprofile/components/custom-section';
import { getSectionById } from '@/actions/supabase/get-section-by-id';

interface CustomSectionPageProps {
  params: {
    sectionId: string;
  };
}

export default function CustomSectionPage({ params }: CustomSectionPageProps) {
  const [section, setSection] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSection() {
      try {
        const fetchedSection = await getSectionById(params.sectionId);
        if (!fetchedSection) {
          setError('Section not found');
        } else {
          setSection(fetchedSection);
        }
      } catch (e) {
        console.error('Error fetching section:', e);
        setError('Error fetching section data');
      }
    }

    fetchSection();
  }, [params.sectionId]);

  const handleUpdate = async (updatedSection: any) => {
    // Implement update logic here
    console.log('Update section:', updatedSection);
  };

  const handleRemove = async (sectionId: string) => {
    // Implement remove logic here
    console.log('Remove section:', sectionId);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!section) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Custom Section</h1>
      <CustomSection
        section={{
          id: section.id,
          title: section.title,
          description: section.description,
          pdfUrl: section.file_url,
        }}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        isEditing={false}
      />
    </div>
  );
}