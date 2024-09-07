'use client'
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema } from '@/schema';
import { updateUserProfile } from '@/actions/supabase/update-user-form';
import { getCurrentUserProfile } from '@/actions/supabase/get-current-user-profile';
import UserProfileForm from '@/components/pages/user/profile/forms/components/user-profile-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

type UserProfileFormData = z.infer<typeof userProfileSchema>;

const EditUserProfilePage = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      address: '',
      role: '',
      company_that_worked_with: '',
      bio: '',
      profile_image: '',
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        if (userProfile) {
          form.reset({
            name: userProfile.name || '',
            email: userProfile.email || '',
            phone_number: userProfile.phone_number || '',
            address: userProfile.address || '',
            role: userProfile.role || '',
            company_that_worked_with: userProfile.company_that_worked_with || '',
            bio: userProfile.bio || '',
            profile_image: userProfile.profile_image || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [form]);

  const onSubmit = async (data: UserProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateUserProfile(data);
      // Handle success (e.g., show a success message, redirect)
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Failed to update profile:', error);
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
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>
      <UserProfileForm
        form={form}
        onSubmit={onSubmit}
        isEditMode={true}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditUserProfilePage;