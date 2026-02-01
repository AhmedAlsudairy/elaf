'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySchema } from '@/schema';
import CompanyForm from '@/components/pages/user/profile/forms/components/company-profile-form';
import { SectorEnum } from '@/constant/text';
import { CompanyProfile } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addCompany } from '@/actions/neon/company/add-company-profile';

export default function AddCompanyPage() {
  const router = useRouter();
  const form = useForm<CompanyProfile>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyTitle: '',
      companyEmail: '',
      companyNumber: '',
      companyWebsite: '',
      phoneNumber: '',
      address: '',
      sectors: [],
      bio: '',
      profileImage: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: CompanyProfile) => {
    setIsSubmitting(true);
    try {
      const result = await addCompany(data);
      if (result.success && result.data) {
        router.push(`/profile/companyprofiles/${result.data.id}`);
      } else {
        throw new Error('Failed to create company profile');
      }
    } catch (error) {
      console.error("Error adding company:", error);
      // Handle error (e.g., show an error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Company</h1>
      <CompanyForm
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}