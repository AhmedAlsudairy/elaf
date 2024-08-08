import React from 'react';
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from './upload-image';
import { z } from "zod";
import { userProfileSchema } from '@/schema';
import { useReusableToast } from '@/components/common/success-toast';
import { Label } from '@/components/ui/label';
import { Loader2 } from "lucide-react";

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UserProfileFormProps {
  form: UseFormReturn<UserProfileFormData>;
  onSubmit: SubmitHandler<UserProfileFormData>;
  initialData?: Partial<UserProfileFormData>;
  isEditMode?: boolean;
  showStepIndicator?: boolean;
  skipCompany?: boolean;
  setSkipCompany?: (skip: boolean) => void;
  onBack?: () => void;
  isSubmitting: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
  form,
  onSubmit,
  initialData,
  isEditMode = false,
  showStepIndicator = false,
  skipCompany,
  setSkipCompany,
  onBack,
  isSubmitting
}) => {
  const [avatarUrls, setAvatarUrls] = React.useState<string[]>(initialData?.profile_image ? [initialData.profile_image] : []);
  const showToast = useReusableToast();

  React.useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        form.setValue(key as keyof UserProfileFormData, value);
      });
    }
  }, [initialData, form]);

  const handleAvatarChange = (url: string) => {
    setAvatarUrls([url]);
    form.setValue("profile_image", url);
  };

  const handleAvatarRemove = (url: string) => {
    setAvatarUrls(avatarUrls.filter((u) => u !== url));
    form.setValue("profile_image", "");
  };

  const onSubmitWithToast: SubmitHandler<UserProfileFormData> = async (data) => {
    try {
      await onSubmit(data);
      showToast('success', `User profile ${isEditMode ? 'updated' : 'submitted'} successfully`);
    } catch (error: any) {
      showToast('error', error.message || `Failed to ${isEditMode ? 'update' : 'submit'} user profile`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitWithToast)} className="space-y-6">
        <FormField
          control={form.control}
          name="profile_image"
          render={({ field }) => (
            <FormItem>
              <Label className="text-sm font-medium">Profile Image</Label>
              <FormControl>
                <ImageUpload
                  value={field.value ? [field.value] : []}
                  onChange={handleAvatarChange}
                  onRemove={handleAvatarRemove}
                  bucketName="profile"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm font-medium">Name</Label>
                <FormControl>
                  <Input placeholder="John Doe" {...field} className="mt-1 w-full" disabled={isSubmitting} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm font-medium">Email</Label>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} className="mt-1 w-full" disabled={isSubmitting} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm font-medium">Phone Number</Label>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} className="mt-1 w-full" disabled={isSubmitting} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm font-medium">Address</Label>
                <FormControl>
                  <Input placeholder="123 Main St, City, Country" {...field} className="mt-1 w-full" disabled={isSubmitting} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm font-medium">Role</Label>
                <FormControl>
                  <Input placeholder="Software Developer" {...field} className="mt-1 w-full" disabled={isSubmitting} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company_that_worked_with"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm font-medium">Companies Worked With</Label>
                <FormControl>
                  <Input placeholder="Acme Inc., Tech Co." {...field} className="mt-1 w-full" disabled={isSubmitting} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <Label className="text-sm font-medium">Bio</Label>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" {...field} className="mt-1 w-full" disabled={isSubmitting} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        {skipCompany !== undefined && setSkipCompany && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="skipCompany"
              checked={skipCompany}
              onCheckedChange={(checked: boolean) => setSkipCompany(checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="skipCompany" className="text-sm">
              Skip company information
            </Label>
          </div>
        )}
        <div className="flex justify-between">
          {showStepIndicator && onBack && (
            <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
              Back
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              isEditMode ? 'Update Profile' : (showStepIndicator ? 'Next' : 'Submit')
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserProfileForm;