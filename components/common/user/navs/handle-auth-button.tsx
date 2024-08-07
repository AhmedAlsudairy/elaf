import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AuthButtonProps } from '@/types';
import { ProfileMenu } from './user-menu';

export const AuthButton = ({ 
  isLoading, 
  isAuthenticated, 
  userProfile, 
  companyProfile, 
  onSignOut, 
  isMobile = false 
}:AuthButtonProps) => {
  const t = useTranslations('Navbar');

  if (isLoading) {
    return (
      <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
        <span className="animate-spin">⌛</span>
      </Button>
    );
  } else if (isAuthenticated && userProfile) {
    return (
      <ProfileMenu 
        userProfile={userProfile}
        companyProfile={companyProfile}
        isMobile={isMobile}
        onMenuItemClick={() => {}}
        onSignOut={onSignOut}
      />
    );
  } else {
    return (
      <Button
        asChild
        variant="outline"
        className="text-primary border-primary hover:bg-primary hover:text-white font-balooBhaijaan"
      >
        <Link href='/login'>
          {t('signin')}
        </Link>
      </Button>
    );
  }
};