"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { companySchema } from '@/schema';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import CompanyForm from '@/components/pages/user/profile/forms/components/company-profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { addCompany } from '@/actions/neon/company/add-company-profile';

type CompanyFormData = z.infer<typeof companySchema>;

export default function CreateCompanyProfilePage() {
  const router = useRouter();
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyTitle: '',
      companyEmail: '',
      companyNumber: '',
      companyWebsite: '',
      phoneNumber: '',
      address: '',
      bio: '',
      profileImage: '',
      sectors: [],
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);
    try {
      const result = await addCompany(data);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      router.push(`/${locale}/profile/companyprofiles`);
    } catch (error: any) {
      console.error('Error creating company profile:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create Company Profile</CardTitle>
          <CardDescription>
            Fill in the details below to create your company profile. This information will be visible to potential clients and partners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanyForm
            form={form}
            onSubmit={onSubmit}
            isEditMode={false}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}