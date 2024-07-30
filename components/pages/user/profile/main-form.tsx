'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserDetails } from '@/actions/supabase/get-user-details';
import { companySchema, userProfileSchema } from '@/schema';
import { z } from 'zod';
import UserProfileForm from './components/user-profile-form';
import StepIndicator from './components/StepIndicator';
import CompanyForm from './components/company-profile-form';

type UserProfileFormData = z.infer<typeof userProfileSchema>;
type CompanyFormData = z.infer<typeof companySchema>;

const MultiStepRegistrationForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [skipCompany, setSkipCompany] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const userProfileForm = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      phone_number: "",
      address: "",
      profile_image: "",
      role: "",
      company_that_worked_with: "",
    },
  });

  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company_title: "",
      company_number: "",
      company_website: "",
      sectors: [],
      bio: "",
      phone_number: "",
      address: "",
      profile_image: "",
    },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const userDetails = await getUserDetails();
        userProfileForm.reset({
          name: userDetails.name || "",
          email: userDetails.email || "",
          profile_image: userDetails.avatarUrl || "",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userProfileForm]);

  const onSubmitUserProfile = (data: UserProfileFormData) => {
    console.log("User profile data:", data);
    setStep(skipCompany ? 3 : 2);
  };

  const onSubmitCompany = (data: CompanyFormData) => {
    console.log("Company data:", data);
    setStep(3);
  };

  const onSubmitFinal = () => {
    const userProfileData = userProfileForm.getValues();
    const companyData = skipCompany ? null : companyForm.getValues();
    console.log("Final submission:", { userProfile: userProfileData, company: companyData });
    // Here you would typically send this data to your backend
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(skipCompany ? 1 : 2);
    } else if (step === 2) {
      setStep(1);
    }
  };

  const totalSteps = skipCompany ? 2 : 3;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center p-4">
      <Card className="w-full max-w-screen-2xl">
        <CardHeader>
          <CardTitle>Create your profile</CardTitle>
          <CardDescription>Enter your information to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <StepIndicator currentStep={step} totalSteps={totalSteps} />
          {step === 1 && (
            <UserProfileForm 
              form={userProfileForm} 
              onSubmit={onSubmitUserProfile} 
              skipCompany={skipCompany}
              setSkipCompany={setSkipCompany}
            />
          )}
          {step === 2 && !skipCompany && (
            <CompanyForm 
              form={companyForm} 
              onSubmit={onSubmitCompany} 
              onBack={handleBack} 
            />
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Your Information</h3>
              <p>Please review your information before submitting.</p>
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                <Button onClick={onSubmitFinal}>Submit</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiStepRegistrationForm;
