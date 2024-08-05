'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, MapPin, Briefcase, Mail, Edit } from 'lucide-react';
import { getCurrentUserProfile } from '@/actions/supabase/get-current-user-profile';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const profile = await getCurrentUserProfile();
      console.log('Fetched profile:', profile);
      console.log('Profile image URL:', profile.profile_image);
      setUser(profile);
    };
    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    if (user && user.id) {
      router.push(`/profile/myprofile/${user.id}`);
    } else {
      console.error('User ID is not available');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="my-16 sm:my-24">
      <Card className="w-full max-w-3xl mx-auto bg-secondary/10 shadow-lg">
        <CardHeader className="relative pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-2 ring-primary">
              {user.profile_image ? (
                <AvatarImage 
                  src={`${user.profile_image}`}
                  alt={user.name} 
                  onError={(e) => {
                    console.error('Error loading image:', e);
                    e.target.src = '/api/placeholder/400/400';
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
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Profile</span>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:text-base">
          {user.bio && (
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary" />
              <span className="flex-1">{user.bio}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <span className="break-all">{user.email}</span>
          </div>
          {user.phone_number && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <span>{user.phone_number}</span>
            </div>
          )}
          {user.address && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{user.address}</span>
            </div>
          )}
          {user.company_that_worked_with && (
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <span>{user.company_that_worked_with}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;