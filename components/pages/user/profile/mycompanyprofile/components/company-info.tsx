import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CompanyProfile } from '@/types';
import { Building2, Globe, MapPin, Briefcase, Mail, Phone, FileText, Image as ImageIcon } from 'lucide-react';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectorEnum } from '@/constant/text';
import ImageUpload from '../../forms/components/upload-image';
import { MultiSelect } from '../../forms/components/multiselect';

interface ProfileInfoProps {
  profile: CompanyProfile;
  setProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  isEditing: boolean;
}

export function ProfileInfo({ profile, setProfile, isEditing }: ProfileInfoProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSectorsChange = (selectedSectors: string[]) => {
    setProfile(prev => ({ ...prev, sectors: selectedSectors as SectorEnum[] }));
  };

  const handleImageChange = (url: string) => {
    setProfile(prev => ({ ...prev, profile_image: url }));
  };

  const handleImageRemove = () => {
    setProfile(prev => ({ ...prev, profile_image: undefined }));
  };

  const renderField = (icon: React.ReactNode, label: string, value: string | undefined, name: keyof CompanyProfile, type: string = "text") => {
    if (!isEditing) {
      return (
        <div className="flex items-center space-x-2 mb-4">
          <div className="text-primary">{icon}</div>
          <div>
            <h3 className="text-sm font-semibold">{label}</h3>
            <p>{value || 'Not specified'}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <Label htmlFor={name} className="flex items-center space-x-2">
          {icon}
          <span>{label}</span>
        </Label>
        <Input
          id={name}
          name={name}
          value={value || ''}
          onChange={handleInputChange}
          className="mt-1"
          type={type}
        />
      </div>
    );
  };

  if (!isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
           
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField(<Building2 className="h-4 w-4" />, "Company ", profile.company_title, "company_title")}
                {renderField(<Building2 className="h-4 w-4" />, "Company Number", profile.company_number, "company_number")}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderField(<Globe className="h-4 w-4" />, "Company Website", profile.company_website, "company_website")}
              {renderField(<Mail className="h-4 w-4" />, "Company Email", profile.company_email, "company_email")}
              {renderField(<Phone className="h-4 w-4" />, "Phone Number", profile.phone_number, "phone_number")}
              {renderField(<MapPin className="h-4 w-4" />, "Address", profile.address, "address")}
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-4 w-4 text-primary" />
              <div>
                <h3 className="text-sm font-semibold">Sectors</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.sectors?.map((sector) => (
                    <Badge key={sector} variant="secondary">{sector}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">
          <ImageIcon className="h-4 w-4 inline-block mr-2" />
          Profile Image
        </Label>
        <ImageUpload
          value={profile.profile_image ? [profile.profile_image] : []}
          disabled={!isEditing}
          onChange={handleImageChange}
          onRemove={handleImageRemove}
          bucketName="profile-images"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField(<Building2 className="h-4 w-4" />, "Company Title", profile.company_title, "company_title")}
        {renderField(<Building2 className="h-4 w-4" />, "Company Number", profile.company_number, "company_number")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField(<Globe className="h-4 w-4" />, "Company Website", profile.company_website, "company_website", "url")}
        {renderField(<Mail className="h-4 w-4" />, "Company Email", profile.company_email, "company_email", "email")}
        {renderField(<Phone className="h-4 w-4" />, "Phone Number", profile.phone_number, "phone_number", "tel")}
        {renderField(<MapPin className="h-4 w-4" />, "Address", profile.address, "address")}
      </div>
      <div>
        <Label htmlFor="sectors" className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4" />
          <span>Sectors</span>
        </Label>
        <MultiSelect
          options={Object.values(SectorEnum).map(sector => ({ id: sector, name: sector }))}
          selected={profile.sectors || []}
          onChange={handleSectorsChange}
          placeholder="Select sectors"
        />
      </div>
      <div>
        <Label htmlFor="bio" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Bio</span>
        </Label>
        <Textarea
          id="bio"
          name="bio"
          value={profile.bio || ""}
          onChange={handleInputChange}
          className="mt-1"
        />
      </div>
    </div>
  );
}