"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TenderSchema } from "@/schema";
import { useReusableToast } from "@/components/common/success-toast";
import { getCurrentCompanyProfile } from "@/actions/supabase/get-current-company-profile";
import { addTenderStepOne } from "@/actions/supabase/add-tender";
import { TenderFormStep1 } from "./components/tender-step-one";
import { TenderFormStep2 } from "./components/tender-step-two";
import { fetchTenderData } from "@/actions/supabase/get-tender";
import { updateTenderStepOne } from "@/actions/supabase/update-tender-step-one";
import { SectorEnum } from "@/constant/text";
import { updateTenderStepTwo } from "@/actions/supabase/add-tender-step-two";
import { useTranslations, useLocale } from 'next-intl';
import { getLangDir } from 'rtl-detect';

type FormValues = z.infer<typeof TenderSchema>;

export function TenderForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [companyLogo, setCompanyLogo] = useState("");
  const [tenderId, setTenderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const showToast = useReusableToast();
  const t = useTranslations('TenderForm');
  const locale = useLocale();
  const direction = getLangDir(locale);
  const isRTL = direction === 'rtl';

  const form = useForm<FormValues>({
    resolver: zodResolver(TenderSchema),
    defaultValues: {
      title: "",
      summary: "",
      pdf_url: "",
      end_date: new Date(),
      terms: "",
      scope_of_works: "",
      currency: "OMR",
      pdf_choice: "upload",
      custom_fields: [{ title: "", description: "" }],
      tender_sectors: [] as SectorEnum[],
    },
  });

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

    if (step === 1) {
      const isValid = await form.trigger([
        "title",
        "summary",
        "currency",
        "end_date",
        "terms",
        "scope_of_works",
        "tender_sectors",
      ]);

      if (isValid) {
        try {
          const stepOneData = form.getValues();
          let result;
          if (tenderId) {
            result = await updateTenderStepOne(tenderId, stepOneData);
            showToast("success", t('successUpdate'));
          } else {
            result = await addTenderStepOne(stepOneData);
            showToast("success", t('successCreate'));
            setTenderId(result.tender_id);
          }
          setStep(2);
        } catch (error) {
          console.error("Error handling tender step one:", error);
          showToast("error", t('errorProcessing'));
        } finally {
          setIsLoading(false);
        }
      } else {
        showToast("error", t('fillRequiredFields'));
        setIsLoading(false);
      }
    } else if (step === 2) {
      const isValid = await form.trigger(["pdf_url"]);

      if (isValid && form.getValues("pdf_url")) {
        try {
          const stepTwoData = form.getValues();
          await updateTenderStepTwo({
            pdf_url: stepTwoData.pdf_url,
            tender_id: tenderId!,
          });
          showToast("success", t('successSubmit'));
          if (companyProfile && companyProfile.company_profile_id) {
            router.push(
              `/profile/companyprofiles/${companyProfile.company_profile_id}/tenders`
            );
            router.refresh();
          } else {
            showToast("error", t('companyProfileMissing'));
          }
        } catch (error) {
          console.error("Error submitting tender:", error);
          showToast("error", t('errorSubmitting'));
        } finally {
          setIsLoading(false);
        }
      } else {
        const errors = form.formState.errors;
        const errorMessages = Object.values(errors).map(
          (error) => error.message
        );
        if (!form.getValues("pdf_url")) {
          errorMessages.push(t('uploadPDFRequired'));
        }
        showToast("error", errorMessages.join(", "));
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    if (tenderId) {
      fetchTenderData(tenderId)
        .then((data) => {
          if (data && data.tender) {
            const formattedData: Partial<FormValues> = {
              title: data.tender.title || "",
              summary: data.tender.summary || "",
              currency: data.tender.currency || "OMR",
              pdf_url: data.tender.pdf_url || "",
              end_date: data.tender.end_date
                ? new Date(data.tender.end_date)
                : new Date(),
              terms: data.tender.terms || "",
              scope_of_works: data.tender.scope_of_works || "",
              tender_sectors:
                (data.tender.tender_sectors as SectorEnum[]) || [],
              pdf_choice: "upload",
              custom_fields: [{ title: "", description: "" }],
            };
            form.reset(formattedData);
          }
        })
        .catch((error) => {
          console.error("Error fetching tender data:", error);
          showToast("error", t('errorFetching'));
        });
    }
  }, [tenderId, form, t]);

  const onSubmit = form.handleSubmit(async (data) => {
    if (step === 2) {
      await handleNextStep();
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8" dir={direction}>
      <h1 className="text-2xl font-bold mb-6 text-center">{t('title')}</h1>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          {step === 1 ? (
            <TenderFormStep1 form={form} isLoading={isLoading} />
          ) : (
            <TenderFormStep2
              form={form}
              companyLogo={companyLogo}
              tenderId={tenderId}
            />
          )}
          <div className={`flex justify-between mt-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {step === 2 && (
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                disabled={isLoading}
              >
                {t('back')}
              </Button>
            )}
            <Button
              type={step === 2 ? "submit" : "button"}
              onClick={() => {
                if (step === 1) {
                  handleNextStep();
                }
              }}
              className={`${isRTL ? 'mr-auto' : 'ml-auto'}`}
              disabled={isLoading || (step === 2 && !form.getValues("pdf_url"))}
            >
              {isLoading ? t('processing') : step === 1 ? t('next') : t('submit')}
            </Button>
          </div>
        </form>
      </Form>
      <p className="mt-4 text-gray-500">
        <strong>{t('pdfNote')}</strong>
      </p>
    </div>
  );
}

export default TenderForm;