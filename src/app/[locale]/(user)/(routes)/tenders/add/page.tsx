'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { TenderFormStep1 } from '@/components/pages/user/tenders/components/tender-step-one'
import { TenderFormStep2 } from '@/components/pages/user/tenders/components/tender-step-two'
import { addTenderStepOne } from '@/actions/neon/tender/add-tender'
import { updateTenderStepTwo } from '@/actions/neon/tender/add-tender-step-two'
import { TenderSchema, TenderFormValues } from '@/schema'
import { useToast } from '@/components/ui/use-toast'
import { ClipLoader } from 'react-spinners'

export default function AddTenderPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [tenderId, setTenderId] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const [companyLogo, setCompanyLogo] = useState<string>('')

  const form = useForm<TenderFormValues>({
    resolver: zodResolver(TenderSchema),
    defaultValues: {
      title: '',
      summary: '',
      tenderSectors: [],
      currency: 'OMR',
      pdfUrl: '',
      endDate: new Date(),
      terms: '',
      scopeOfWorks: '',
      pdfChoice: 'upload',
    },
  })

  const handleStepOne = async (data: TenderFormValues) => {
    try {
      setIsLoading(true)
      const result = await addTenderStepOne({
        title: data.title,
        summary: data.summary,
        tenderSectors: data.tenderSectors,
        currency: data.currency,
        endDate: data.endDate,
        terms: data.terms,
        scopeOfWorks: data.scopeOfWorks,
      })
      
      setTenderId(result.id)
      toast({ description: 'Step 1 completed!' })
      setStep(2)
    } catch (error) {
      toast({ 
        description: 'Failed to save tender', 
        variant: 'destructive' 
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStepTwo = async (data: TenderFormValues) => {
    if (!tenderId) {
      toast({
        description: 'Tender ID not found',
        variant: 'destructive'
      })
      return
    }

    try {
      setIsLoading(true)
      await updateTenderStepTwo({
        pdfUrl: data.pdfUrl,
        tenderId: tenderId,
      })
      
      toast({ description: 'Tender created successfully!' })
      router.push('/tenders')
    } catch (error) {
      toast({
        description: 'Failed to upload PDF',
        variant: 'destructive'
      })
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
                <Button type="submit" disabled={isLoading || !form.watch('pdfUrl')}>
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