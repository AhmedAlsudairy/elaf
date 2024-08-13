'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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


type FormValues = z.infer<typeof TenderSchema>;

export function TenderForm() {
  const [step, setStep] = useState(1);
  const [companyLogo, setCompanyLogo] = useState('');
  const [tenderId, setTenderId] = useState<string | null>(null);
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
      custom_fields: [{ title: '', description: '' }]
    },
  })

  useEffect(() => {
    async function fetchCompanyProfile() {
      const profile = await getCurrentCompanyProfile();
      if (profile && profile.profile_image) {
        setCompanyLogo(profile.profile_image);
      }
    }
    fetchCompanyProfile();
  }, []);

  async function handleNextStep() {
    const isValid = await form.trigger(['title', 'summary', 'end_date', 'terms', 'scope_of_works']);
    if (isValid) {
      try {
        const stepOneData = form.getValues();
        let result;
        if (tenderId) {
          // Update existing tender
          result = await updateTenderStepOne(tenderId, stepOneData);
          showToast('success', 'Tender updated successfully');
        } else {
          // Create new tender
          result = await addTenderStepOne(stepOneData);
          showToast('success', 'New tender created successfully');
        }
        setTenderId(result.tender_id);
        setStep(2);
      } catch (error) {
        console.error('Error handling tender step one:', error);
        showToast('error', 'Error processing tender data');
      }
    } else {
      const errors = form.formState.errors;
      const errorMessages = Object.values(errors).map(error => error.message);
      showToast('error', errorMessages.join(', '));
    }
  }

  async function onSubmit(values: FormValues) {
    if (step === 2) {
      try {
        // Here you would handle the final submission, including the PDF choice and custom fields
        console.log('Final submission:', { ...values, tender_id: tenderId });
        showToast('success', 'Tender submitted successfully');
        // Implement the logic to save the final tender data
      } catch (error) {
        console.error('Error submitting tender:', error);
        showToast('error', 'Error submitting tender');
      }
    }
  }

  useEffect(() => {
    if (tenderId) {
      fetchTenderData(tenderId).then(data => {
        form.reset(data);
      }).catch(error => {
        console.error('Error fetching tender data:', error);
        showToast('error', 'Error fetching tender data');
      });
    }
  }, [tenderId, form]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Tender</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 
            ? <TenderFormStep1 form={form} /> 
            : <TenderFormStep2 form={form} companyLogo={companyLogo} tenderId={tenderId} />
          }
          <div className="flex justify-between mt-6">
            {step === 2 && (
              <Button type="button" onClick={() => setStep(1)} variant="outline">
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
            >
              {step === 1 ? "Next" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}