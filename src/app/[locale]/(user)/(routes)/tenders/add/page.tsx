'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { TenderFormStep1 } from '@/components/pages/user/tenders/components/tender-step-one'
import { TenderFormStep2 } from '@/components/pages/user/tenders/components/tender-step-two'
import { addTenderStepOne } from '@/actions/supabase/add-tender'
import { updateTenderStepTwo } from '@/actions/supabase/add-tender-step-two'
import { TenderSchema, TenderFormValues } from '@/schema'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'

export default function AddTenderPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [tenderId, setTenderId] = useState<string | null>(null)
  const [companyLogo, setCompanyLogo] = useState<string>('')
  const router = useRouter()

  const form = useForm<TenderFormValues>({
    resolver: zodResolver(TenderSchema),
    defaultValues: {
      title: '',
      summary: '',
      tender_sectors: [],
      currency: 'OMR',
      pdf_url: '',
      end_date: new Date(),
      terms: '',
      scope_of_works: '',
      pdf_choice: 'upload',
    },
  })

  const handleStepOne = async (data: TenderFormValues) => {
    try {
      setIsLoading(true)
      const result = await addTenderStepOne({
        title: data.title,
        summary: data.summary,
        tender_sectors: data.tender_sectors,
        currency: data.currency,
        end_date: data.end_date,
        terms: data.terms,
        scope_of_works: data.scope_of_works,
      })
      
      setTenderId(result.id)
      toast.success('Step 1 completed!')
      setStep(2)
    } catch (error) {
      toast.error('Failed to save tender')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepTwo = async (data: TenderFormValues) => {
    if (!tenderId) {
      toast.error('Tender ID not found')
      return
    }

    try {
      setIsLoading(true)
      await updateTenderStepTwo({
        pdf_url: data.pdf_url,
        tender_id: tenderId,
      })
      
      toast.success('Tender created successfully!')
      router.push('/tenders')
    } catch (error) {
      toast.error('Failed to upload PDF')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: TenderFormValues) => {
    if (step === 1) {
      await handleStepOne(data)
    } else {
      await handleStepTwo(data)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Tender</h1>
        <p className="text-gray-600">Step {step} of 2</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 ? (
            <>
              <TenderFormStep1 form={form} isLoading={isLoading} />
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <ClipLoader color="#FFFFFF" size={20} className="mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Next Step'
                  )}
                </Button>
              </div>
            </>
          ) : (
            <>
              <TenderFormStep2 
                form={form} 
                companyLogo={companyLogo}
                tenderId={tenderId}
              />
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isLoading || !form.watch('pdf_url')}>
                  {isLoading ? (
                    <>
                      <ClipLoader color="#FFFFFF" size={20} className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Tender'
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </main>
  )
}