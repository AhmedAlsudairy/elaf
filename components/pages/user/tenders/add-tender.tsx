'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { TenderSchema } from '@/schema'
import { useReusableToast } from '@/components/common/success-toast'
import { getCurrentCompanyProfile } from '@/actions/supabase/get-current-company-profile'
import { addTenderStepOne } from '@/actions/supabase/add-tender'
import { TenderFormStep1 } from './components/tender-step-one'
import { TenderFormStep2 } from './components/tender-step-two'
import { fetchTenderData } from '@/actions/supabase/get-tender'
import { updateTenderStepOne } from '@/actions/supabase/update-tender-step-one'
import { SectorEnum } from "@/constant/text"
import { updateTenderStepTwo } from '@/actions/supabase/add-tender-step-two'

type FormValues = z.infer<typeof TenderSchema>;

export function TenderForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [companyLogo, setCompanyLogo] = useState('');
  const [tenderId, setTenderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const showToast = useReusableToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(TenderSchema),
    defaultValues: {
      title: "",
      summary: "",
      pdf_url: "",
      end_date: new Date(),
      terms: "",
      scope_of_works: "",
      pdf_choice: 'upload',
      custom_fields: [{ title: '', description: '' }],
      tender_sectors: [] as SectorEnum[],
    },
  })

  useEffect(() => {
    async function fetchCompanyProfile() {
      const profile = await getCurrentCompanyProfile();
      if (profile && profile.profile_image) {
        setCompanyLogo(profile.profile_image);
        setCompanyProfile(profile);
      }
    }
    fetchCompanyProfile();
  }, []);

  async function handleNextStep() {
    setIsLoading(true);
    const isValid = await form.trigger(['title', 'summary', 'end_date', 'terms', 'scope_of_works', 'tender_sectors']);
    if (isValid) {
      try {
        const stepOneData = form.getValues();
        let result;
        if (tenderId) {
          result = await updateTenderStepOne(tenderId, stepOneData);
          showToast('success', 'Tender updated successfully');
        } else {
          result = await addTenderStepOne(stepOneData);
          showToast('success', 'New tender created successfully');
        }
        setTenderId(result.tender_id);
        setStep(2);
      } catch (error) {
        console.error('Error handling tender step one:', error);
        showToast('error', 'Error processing tender data');
      } finally {
        setIsLoading(false);
      }
    } else {
      const errors = form.formState.errors;
      const errorMessages = Object.values(errors).map(error => error.message);
      showToast('error', errorMessages.join(', '));
      setIsLoading(false);
    }
  }

  async function onSubmit(values: FormValues) {
    if (step === 2) {
      setIsLoading(true);
      try {
        if (!tenderId) {
          throw new Error("Tender ID is missing");
        }
        const result = await updateTenderStepTwo({
          pdf_url: values.pdf_url,
          tender_id: tenderId
        });

        console.log('Final submission:', result);
        showToast('success', 'Tender submitted successfully');
        if (companyProfile && companyProfile.company_profile_id) {
          router.push(`/profile/companyprofiles/${companyProfile.company_profile_id}/tenders`);
        } else {
          showToast('error', 'Company profile information is missing');
        }
      } catch (error) {
        console.error('Error submitting tender:', error);
        showToast('error', 'Error submitting tender');
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (tenderId) {
      fetchTenderData(tenderId).then(data => {
        if (data && data.tender) {
          const formattedData: Partial<FormValues> = {
            title: data.tender.title || "",
            summary: data.tender.summary || "",
            pdf_url: data.tender.pdf_url || "",
            end_date: data.tender.end_date ? new Date(data.tender.end_date) : new Date(),
            terms: data.tender.terms || "",
            scope_of_works: data.tender.scope_of_works || "",
            tender_sectors: data.tender.tender_sectors as SectorEnum[] || [],
            pdf_choice: 'upload', // Assuming a default value
            custom_fields: [{ title: '', description: '' }], // Assuming a default value
          };
          form.reset(formattedData);
        }
      }).catch(error => {
        console.error('Error fetching tender data:', error);
        showToast('error', 'Error fetching tender data');
      });
    }
  }, [tenderId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Tender</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 
            ? <TenderFormStep1 form={form} isLoading={isLoading} /> 
            : <TenderFormStep2 form={form} companyLogo={companyLogo} tenderId={tenderId} />
          }
          <div className="flex justify-between mt-6">
            {step === 2 && (
              <Button type="button" onClick={() => setStep(1)} variant="outline" disabled={isLoading}>
                Back
              </Button>
            )}
            <Button 
              type="button" 
              onClick={() => {
                if (step === 1) {
                  handleNextStep();
                } else {
                  form.handleSubmit(onSubmit)();
                }
              }}
              className="ml-auto"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (step === 1 ? "Next" : "Submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 