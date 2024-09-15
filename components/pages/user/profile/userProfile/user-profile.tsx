// app/profile/UserProfileClient.tsx
'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Mail, Edit, Building, LogOut, Briefcase, Info, UserCircle } from 'lucide-react';
import { SignOut } from '@/actions/supabase/signout';
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from 'next-intl';

type UserProfile = {
  id: string;
  email: string;
  name: string;
  profile_image?: string;
  role?: string;
  phone_number?: string;
  address?: string;
  bio?: string;
  company_that_worked_with?: string;
};

type CompanyProfile = {
  company_profile_id: string;
  // Add other company profile fields as needed
};

type UserProfileClientProps = {
  initialUserProfile: UserProfile;
  initialCompanyProfile: CompanyProfile | null;
};

const UserProfileClient: React.FC<UserProfileClientProps> = ({ initialUserProfile, initialCompanyProfile }) => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('UserProfileClient'); // Load translations from the 'UserProfileClient' namespace

  const handleEdit = () => {
    router.push(`/profile/myprofile/${initialUserProfile.id}`);
  };

  const handleCompanyProfileClick = () => {
    router.push(initialCompanyProfile 
      ? `/profile/companyprofiles/${initialCompanyProfile.company_profile_id}`
      : "/profile/companyprofiles/new"
    );
  };

  const handleSignOut = async () => {
    try {
      await SignOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: t('signOutErrorTitle'),
        description: t('signOutErrorDescription'),
        variant: "destructive",
      });
    }
  };

  if (!initialUserProfile) {
    router.push('/');
  }

  return (
    <Card className="w-full max-w-3xl mx-auto bg-secondary/10 shadow-lg">
      <CardHeader className="relative pb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
          <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-2 ring-primary">
            {initialUserProfile.profile_image ? (
              <Image 
                src={initialUserProfile.profile_image}
                alt={initialUserProfile.name}
                width={128}
                height={128}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initialUserProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary">{initialUserProfile.name}</h2>
            {initialUserProfile.role && <Badge className="mt-2" variant="secondary">{initialUserProfile.role}</Badge>}
          </div>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleEdit} 
          className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">{t('editProfile')}</span>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 opacity-70" /> <span>{initialUserProfile.email}</span>
        </div>
        {initialUserProfile.phone_number && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 opacity-70" /> <span>{initialUserProfile.phone_number}</span>
          </div>
        )}
        {initialUserProfile.address && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 opacity-70" /> <span>{initialUserProfile.address}</span>
          </div>
        )}
        {initialUserProfile.role && (
          <div className="flex items-center gap-2">
            <UserCircle className="h-4 w-4 opacity-70" /> <span>{initialUserProfile.role}</span>
          </div>
        )}
        {initialUserProfile.company_that_worked_with && (
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 opacity-70" /> <span>{initialUserProfile.company_that_worked_with}</span>
          </div>
        )}
        {initialUserProfile.bio && (
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 opacity-70 mt-1" /> 
            <span className="flex-1">{initialUserProfile.bio}</span>
          </div>
        )}
        <div className="mt-4 space-y-2">
          <Button
            onClick={handleCompanyProfileClick}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <Building className="w-5 h-5" />
            {initialCompanyProfile ? t('myCompany') : t('createNewCompanyProfile')}
          </Button>
          <Button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2"
            variant="destructive"
          >
            <LogOut className="w-5 h-5" />
            {t('signOut')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileClient;
