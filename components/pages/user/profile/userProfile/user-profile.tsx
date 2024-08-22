'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Mail, Edit, Building, LogOut, Briefcase, Info, UserCircle } from 'lucide-react';
import { getCurrentProfiles } from '@/actions/supabase/get-current-profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClipLoader } from 'react-spinners';
import { SignOut } from '@/actions/supabase/signout';
import { useToast } from "@/components/ui/use-toast";

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

const UserProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ title: string, description: string, variant: 'default' | 'destructive' } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfiles = async () => {
      const { userProfile, companyProfile } = await getCurrentProfiles();
      if (userProfile) {
        setUser(userProfile as UserProfile);
      }
      setCompanyProfile(companyProfile);
      setLoading(false);

      setAlertMessage(companyProfile ? {
        title: "Welcome Back",
        description: "Your profile and company information have been loaded.",
        variant: "default"
      } : {
        title: "Company Profile Required",
        description: "You must create a company profile to make tenders.",
        variant: "destructive"
      });

      // Check for message parameter
      const message = searchParams.get('message');
      if (message) {
        toast({
          title: "Notification",
          description: message,
        });
      }
    };
    fetchProfiles();
  }, [searchParams, toast]);

  const handleEdit = () => {
    if (user?.id) {
      setIsNavigating(true);
      router.push(`/profile/myprofile/${user.id}`);
    } else {
      console.error('User ID is not available');
    }
  };

  const handleCompanyProfileClick = () => {
    setIsNavigating(true);
    router.push(companyProfile 
      ? `/profile/companyprofiles/${companyProfile.company_profile_id}`
      : "/profile/companyprofiles/new"
    );
  };

  const handleSignOut = async () => {
    setIsNavigating(true);
    await SignOut();
    // The redirect is handled in the SignOut function, so we don't need to do it here
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#123abc" loading={loading} size={50} />
      </div>
    );
  }

  if (!user) return <div>No user profile found.</div>;

  return (
    <div className="my-16 sm:my-24">
      {alertMessage && (
        <Alert variant={alertMessage.variant} className="mb-4 max-w-3xl mx-auto">
          <AlertTitle>{alertMessage.title}</AlertTitle>
          <AlertDescription>{alertMessage.description}</AlertDescription>
        </Alert>
      )}
      <Card className="w-full max-w-3xl mx-auto bg-secondary/10 shadow-lg">
        <CardHeader className="relative pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-2 ring-primary">
              {user.profile_image ? (
                <AvatarImage 
                  src={user.profile_image}
                  alt={user.name} 
                  onError={(e) => {
                    console.error('Error loading image:', e);
                  }}
                />
              ) : (
                <AvatarImage src="/api/placeholder/400/400" alt={user.name} />
              )}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">{user.name}</h2>
              {user.role && <Badge className="mt-2" variant="secondary">{user.role}</Badge>}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleEdit} 
            className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isNavigating}
          >
            {isNavigating ? (
              <ClipLoader color="#ffffff" loading={isNavigating} size={20} />
            ) : (
              <Edit className="h-4 w-4" />
            )}
            <span className="sr-only">Edit Profile</span>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 opacity-70" /> <span>{user.email}</span>
          </div>
          {user.phone_number && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 opacity-70" /> <span>{user.phone_number}</span>
            </div>
          )}
          {user.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 opacity-70" /> <span>{user.address}</span>
            </div>
          )}
          {user.role && (
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 opacity-70" /> <span>{user.role}</span>
            </div>
          )}
          {user.company_that_worked_with && (
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 opacity-70" /> <span>{user.company_that_worked_with}</span>
            </div>
          )}
          {user.bio && (
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 opacity-70 mt-1" /> 
              <span className="flex-1">{user.bio}</span>
            </div>
          )}
        
          <div className="mt-4 space-y-2">
            <Button
              onClick={handleCompanyProfileClick}
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
              disabled={isNavigating}
            >
              {isNavigating ? (
                <ClipLoader color="#123abc" loading={isNavigating} size={20} />
              ) : (
                <Building className="w-5 h-5" />
              )}
              {companyProfile ? "My Company" : "Create New Company Profile"}
            </Button>
            
            <Button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2"
              variant="destructive"
              disabled={isNavigating}
            >
              {isNavigating ? (
                <ClipLoader color="#ffffff" loading={isNavigating} size={20} />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;