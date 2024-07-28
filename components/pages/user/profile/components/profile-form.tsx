'use client'

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import { getUserDetails } from '@/actions/supabase/get-user-details';
import { companySchema, userProfileSchema } from '@/schema';
import ImageUpload from './upload-image';

// Import the getUserDetails function

// Define the schemas

type UserProfileFormData = z.infer<typeof userProfileSchema>;
type CompanyFormData = z.infer<typeof companySchema>;

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      {[...Array(totalSteps)].map((_, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-full ${
            index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

const MultiStepRegistrationForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [skipCompany, setSkipCompany] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [avatarUrls, setAvatarUrls] = useState<string[]>([]);
  const totalSteps = skipCompany ? 2 : 3;

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
      companyName: "",
      website: "",
    },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const userDetails = await getUserDetails();
        userProfileForm.setValue("name", userDetails.name || "");
        userProfileForm.setValue("email", userDetails.email || "");
        userProfileForm.setValue("profile_image", userDetails.avatarUrl || "");
        if (userDetails.avatarUrl) {
          setAvatarUrls([userDetails.avatarUrl]);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userProfileForm]);

  const onSubmitUserProfile: SubmitHandler<UserProfileFormData> = (data) => {
    console.log("User profile data:", data);
    setStep(skipCompany ? 3 : 2);
  };

  const onSubmitCompany: SubmitHandler<CompanyFormData> = (data) => {
    console.log("Company data:", data);
    setStep(3);
  };

  const onSubmitFinal = () => {
    const userProfileData = userProfileForm.getValues();
    const companyData = skipCompany ? null : companyForm.getValues();
    console.log("Final submission:", { userProfile: userProfileData, company: companyData });
    // Here you would typically send this data to your backend
  };

  const handleAvatarChange = (url: string) => {
    setAvatarUrls([url]);
    userProfileForm.setValue("profile_image", url);
  };

  const handleAvatarRemove = (url: string) => {
    setAvatarUrls(avatarUrls.filter((u) => u !== url));
    userProfileForm.setValue("profile_image", "");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Create your profile</CardTitle>
        <CardDescription>Enter your information to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
        {step === 1 && (
          <Form {...userProfileForm}>
            <form onSubmit={userProfileForm.handleSubmit(onSubmitUserProfile)} className="space-y-4">
              <FormField
                control={userProfileForm.control}
                name="profile_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={avatarUrls}
                        onChange={handleAvatarChange}
                        onRemove={handleAvatarRemove}
                        bucketName="profile"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userProfileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userProfileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userProfileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about yourself" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userProfileForm.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userProfileForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userProfileForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userProfileForm.control}
                name="company_that_worked_with"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Companies Worked With</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc., Tech Co." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="skipCompany"
                  checked={skipCompany}
                  onCheckedChange={(checked: boolean) => setSkipCompany(checked)}
                />
                <label
                  htmlFor="skipCompany"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Skip company information
                </label>
              </div>
              <Button type="submit" className="w-full">Next</Button>
            </form>
          </Form>
        )}
        {step === 2 && !skipCompany && (
          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(onSubmitCompany)} className="space-y-4">
              <FormField
                control={companyForm.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={companyForm.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Information</h3>
            <p>Please review your information before submitting.</p>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
              <Button onClick={onSubmitFinal}>Submit</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiStepRegistrationForm;