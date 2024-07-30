import React from 'react';
import { UseFormReturn, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from 'zod';
import { companySchema } from '@/schema';
import { Label } from "@/components/ui/label";
import ImageUpload from './upload-image';
import { SectorEnum } from '@/constant/text';
import { MultiSelect, MultiSelectOption } from './multiselect';

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormProps {
  form: UseFormReturn<CompanyFormData>;
  onSubmit: SubmitHandler<CompanyFormData>;
  onBack: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ form, onSubmit, onBack }) => {
  const [profileImageUrls, setProfileImageUrls] = React.useState<string[]>([]);

  const handleProfileImageChange = (url: string) => {
    setProfileImageUrls([url]);
    form.setValue("profile_image", url);
  };

  const handleProfileImageRemove = (url: string) => {
    setProfileImageUrls(profileImageUrls.filter((u) => u !== url));
    form.setValue("profile_image", "");
  };

  // Transform SectorEnum into the format expected by MultiSelect
  const sectorOptions: MultiSelectOption[] = Object.values(SectorEnum).map((sector) => ({
    id: sector,
    name: sector
  }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="profile_image"
          render={({ field }) => (
            <FormItem>
              <Label className="text-sm font-medium">Company Logo</Label>
              <FormControl>
                <ImageUpload
                  value={field.value ? [field.value] : []}
                  onChange={handleProfileImageChange}
                  onRemove={handleProfileImageRemove}
                  bucketName="company"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="company_title"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm font-medium">Company Title</Label>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} className="mt-1 w-full" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
               <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <Label className="text-sm font-medium">Company Bio</Label>
              <FormControl>
                <Textarea placeholder="Tell us about your company" {...field} className="mt-1 w-full" />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      
          <FormField
            control={form.control}
            name="company_number"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm font-medium">Company Number</Label>
                <FormControl>
                  <Input placeholder="12345678" {...field} className="mt-1 w-full" />
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
          name="sectors"
          render={({ field }) => (
            <FormItem>
              <Label className="text-sm font-medium">Sectors</Label>
              <FormControl>
                <MultiSelect
                  options={sectorOptions}
                  selected={field.value || []}
                  onChange={(selectedSectors) => {
                    field.onChange(selectedSectors);
                  }}
                  placeholder="Select sectors..."
                  className="mt-1"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        </div>
   
        <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-auto"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CompanyForm;
