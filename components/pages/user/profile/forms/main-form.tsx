'use client'
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserDetails } from "@/actions/supabase/get-user-details";
import { companySchema, userProfileSchema } from "@/schema";

import { useReusableToast } from "@/components/common/success-toast";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { submitFinalForm } from "@/actions/supabase/profile-form-submit";
import StepIndicator from "./components/StepIndicator";
import UserProfileForm from "./components/user-profile-form";
import CompanyForm from "./components/company-profile-form";

type UserProfileFormData = z.infer<typeof userProfileSchema>;
type CompanyFormData = z.infer<typeof companySchema>;

interface FormData {
  userProfile: UserProfileFormData;
  company: CompanyFormData | null;
}

const MultiStepRegistrationForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [skipCompany, setSkipCompany] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    userProfile: {} as UserProfileFormData,
    company: null,
  });
  const showToast = useReusableToast();

  const userProfileForm = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: formData.userProfile,
  });

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: formData.company || {},
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails();
        const initialUserProfile = {
          name: userDetails?.name || "",
          email: userDetails?.email || "",
          profile_image: userDetails?.avatarUrl || "",
          bio: "",
          phone_number: "",
          address: "",
          role: "",
          company_that_worked_with: "",
        };
        setFormData(prev => ({ ...prev, userProfile: initialUserProfile }));
        userProfileForm.reset(initialUserProfile);
      } catch (error) {
        console.error("Error fetching user details:", error);
        showToast("error", "Failed to fetch user details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleNextStep = (data: UserProfileFormData | CompanyFormData) => {
    if (step === 1) {
      setFormData(prev => ({ ...prev, userProfile: data as UserProfileFormData }));
      setStep(skipCompany ? 3 : 2);
    } else if (step === 2) {
      setFormData(prev => ({ ...prev, company: data as CompanyFormData }));
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(skipCompany ? 1 : 2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const onSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitFinalForm(formData.userProfile, formData.company);
      if (result instanceof Response && result.redirected) {
        window.location.href = result.url;
      } else if ('success' in result && result.success) {
        showToast('success', 'Registration completed successfully');
        window.location.href = '/profile/myprofile';
      } else {
        showToast('error', result.message || 'Failed to complete registration');
        console.error('Registration failed:', result.error);
      }
    } catch (error: any) {
      console.error("Error completing registration:", error);
      showToast('error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = skipCompany ? 2 : 3;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-screen-2xl">
        <CardHeader>
          <CardTitle>Create your profile</CardTitle>
          <CardDescription>
            Enter your information to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepIndicator currentStep={step} totalSteps={totalSteps} />
          {step === 1 && (
            <UserProfileForm
              form={userProfileForm}
              onSubmit={handleNextStep}
              showStepIndicator={true}
              skipCompany={skipCompany}
              setSkipCompany={setSkipCompany}
              isSubmitting={isSubmitting}
            />
          )}
          {step === 2 && !skipCompany && (
            <CompanyForm
              form={companyForm}
              onSubmit={handleNextStep}
              showStepIndicator={true}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Your Information</h3>
              <p>Please review your information before submitting.</p>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>
                  Back
                </Button>
                <Button onClick={onSubmitFinal} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepRegistrationForm;