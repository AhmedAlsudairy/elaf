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
import { getCurrentCompanyProfile } from "@/actions/neon/company/get-current-company-profile";
import { addTenderStepOne } from "@/actions/neon/tender/add-tender";
import { TenderFormStep1 } from "./components/tender-step-one";
import { TenderFormStep2 } from "./components/tender-step-two";
import { fetchTenderData } from "@/actions/neon/tender/get-tender";
import { updateTenderStepOne } from "@/actions/neon/tender/update-tender-step-one";
import { SectorEnum } from "@/constant/text";
import { updateTenderStepTwo } from "@/actions/neon/tender/add-tender-step-two";

type FormValues = z.infer<typeof TenderSchema>;

export function TenderForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [companyLogo, setCompanyLogo] = useState("");
  const [tenderId, setTenderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const showToast = useReusableToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(TenderSchema),
    defaultValues: {
      title: "",
      summary: "",
      pdfUrl: "",
      endDate: new Date(),
      terms: "",
      scopeOfWorks: "",
      currency: "OMR",
      pdfChoice: "upload",
      customFields: [{ title: "", description: "" }],
      tenderSectors: [] as SectorEnum[],
    },
  });

  useEffect(() => {
    async function fetchCompanyProfile() {
      const profile = await getCurrentCompanyProfile();
      if (profile && profile.profileImage) {
        setCompanyLogo(profile.profileImage);
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
        "endDate",
        "terms",
        "scopeOfWorks",
        "tenderSectors",
      ]);

      if (isValid) {
        try {
          const stepOneData = form.getValues();
          let result;
          if (tenderId) {
            result = await updateTenderStepOne(tenderId, stepOneData);
            showToast("success", "Tender updated successfully");
          } else {
            result = await addTenderStepOne(stepOneData);
            showToast("success", "New tender created successfully");
            setTenderId(result.id);
          }
          setStep(2);
        } catch (error) {
          console.error("Error handling tender step one:", error);
          showToast("error", "Error processing tender data");
        } finally {
          setIsLoading(false);
        }
      } else {
        showToast("error", "Please fill out all required fields in Step 1.");
        setIsLoading(false);
      }
    } else if (step === 2) {
      const isValid = await form.trigger(["pdfUrl"]);

      if (isValid && form.getValues("pdfUrl")) {
        try {
          const stepTwoData = form.getValues();
          await updateTenderStepTwo({
            pdfUrl: stepTwoData.pdfUrl,
            tenderId: tenderId!,
          });
          showToast("success", "Tender submitted successfully");
          if (companyProfile && companyProfile.companyProfileId) {
            router.push(
              `/profile/companyprofiles/${companyProfile.companyProfileId}/tenders`
            );
            router.refresh();
          } else {
            showToast("error", "Company profile information is missing");
          }
        } catch (error) {
          console.error("Error submitting tender:", error);
          showToast("error", "Error submitting tender");
        } finally {
          setIsLoading(false);
        }
      } else {
        const errors = form.formState.errors;
        const errorMessages = Object.values(errors).map(
          (error) => error.message
        );
        if (!form.getValues("pdfUrl")) {
          errorMessages.push("Please upload a PDF file for your tender.");
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
              pdfUrl: data.tender.pdfUrl || "",
              endDate: data.tender.endDate
                ? new Date(data.tender.endDate)
                : new Date(),
              terms: data.tender.terms || "",
              scopeOfWorks: data.tender.scopeOfWorks || "",
              tenderSectors:
                (data.tender.tenderSectors as SectorEnum[]) || [],
              pdfChoice: "upload",
              customFields: [{ title: "", description: "" }],
            };
            form.reset(formattedData);
          }
        })
        .catch((error) => {
          console.error("Error fetching tender data:", error);
          showToast("error", "Error fetching tender data");
        });
    }
  }, [tenderId, form, showToast]);

  const onSubmit = form.handleSubmit(async (data) => {
    if (step === 2) {
      await handleNextStep();
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Tender</h1>
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
          <div className="flex justify-between mt-6">
            {step === 2 && (
              <Button
                type="button"
                onClick={() => setStep(1)}
                variant="outline"
                disabled={isLoading}
              >
                Back
              </Button>
            )}
            <Button
              type={step === 2 ? "submit" : "button"}
              onClick={() => {
                if (step === 1) {
                  handleNextStep();
                }
              }}
              className="ml-auto"
              disabled={isLoading || (step === 2 && !form.getValues("pdfUrl"))}
            >
              {isLoading ? "Processing..." : step === 1 ? "Next" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
      <p className="mt-4 text-gray-500">
        <strong>Note:</strong> Adding a PDF file to your tender is required for the review process.
      </p>
    </div>
  );
}