'use client'
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema } from '@/schema';
import { updateUserProfile } from '@/actions/neon/user/update-user-form';
import { getCurrentUserProfile } from '@/actions/neon/user/get-current-user-profile';
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
      phoneNumber: '',
      address: '',
      role: '',
      companyThatWorkedWith: '',
      bio: '',
      profileImage: '',
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
            phoneNumber: userProfile.phoneNumber || '',
            address: userProfile.address || '',
            role: userProfile.role || '',
            companyThatWorkedWith: userProfile.companyThatWorkedWith || '',
            bio: userProfile.bio || '',
            profileImage: userProfile.profileImage || '',
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
    } catch (error) {
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