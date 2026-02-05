'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySchema } from '@/schema';
import CompanyForm from '@/components/pages/user/profile/forms/components/company-profile-form';
import { CompanyProfile } from '@/types';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getCompanyProfileById } from '@/actions/neon/company/gett-company-profile-by-id';
import { updateProfile } from '@/actions/neon/company/update-company-profile';
import { Loader2 } from 'lucide-react';

export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const company = await getCompanyProfileById(id);
        if (company) {
          form.reset({
            id: company.id,
            companyTitle: company.companyTitle || '',
            companyEmail: company.companyEmail || '',
            companyNumber: company.companyNumber || '',
            companyWebsite: company.companyWebsite || '',
            phoneNumber: company.phoneNumber || '',
            address: company.address || '',
            sectors: company.sectors || [],
            bio: company.bio || '',
            profileImage: company.profileImage || '',
          });
        }
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [id, form]);

  const onSubmit = async (data: CompanyProfile) => {
    setIsSubmitting(true);
    try {
      const result = await updateProfile({ ...data, id } as CompanyProfile);
      if (result) {
        router.push(`/profile/companyprofiles/${id}`);
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating company:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Company Profile</h1>
      <CompanyForm
        form={form}
        onSubmit={onSubmit}
        isEditMode={true}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
