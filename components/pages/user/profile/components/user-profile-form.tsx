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
import { Label } from "@/components/ui/label";

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UserProfileFormProps {
  form: UseFormReturn<UserProfileFormData>;
  onSubmit: SubmitHandler<UserProfileFormData>;
  skipCompany: boolean;
  setSkipCompany: (skip: boolean) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ form, onSubmit, skipCompany, setSkipCompany }) => {
  const [avatarUrls, setAvatarUrls] = React.useState<string[]>([]);

  const handleAvatarChange = (url: string) => {
    setAvatarUrls([url]);
    form.setValue("profile_image", url);
  };

  const handleAvatarRemove = (url: string) => {
    setAvatarUrls(avatarUrls.filter((u) => u !== url));
    form.setValue("profile_image", "");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  <Input placeholder="John Doe" {...field} className="mt-1 w-full" />
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
                  <Input type="email" placeholder="john@example.com" {...field} className="mt-1 w-full" />
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
                  <Input placeholder="+1 (555) 123-4567" {...field} className="mt-1 w-full" />
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
                  <Input placeholder="123 Main St, City, Country" {...field} className="mt-1 w-full" />
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
                  <Input placeholder="Software Developer" {...field} className="mt-1 w-full" />
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
                  <Input placeholder="Acme Inc., Tech Co." {...field} className="mt-1 w-full" />
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
                <Textarea placeholder="Tell us about yourself" {...field} className="mt-1 w-full" />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="skipCompany"
            checked={skipCompany}
            onCheckedChange={(checked: boolean) => setSkipCompany(checked)}
          />
          <Label htmlFor="skipCompany" className="text-sm">
            Skip company information
          </Label>
        </div>
        <Button type="submit" className="w-full sm:w-auto">Next</Button>
      </form>
    </Form>
  );
};

export default UserProfileForm;