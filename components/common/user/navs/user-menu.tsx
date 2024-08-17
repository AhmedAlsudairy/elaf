import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserMenuProps } from '@/types';
import { SignOut } from '@/actions/supabase/signout';

export const ProfileMenu = ({ userProfile, companyProfile, isMobile, onMenuItemClick, onSignOut }: UserMenuProps) => {
  const t = useTranslations('Navbar');

  const handleSignOut = async () => {
    await SignOut();
    onSignOut(); // This will update the state in the Header component
  };

  const menuItems = [
    { label: 'myProfile', href: '/profile/myprofile' },
    { 
      label: companyProfile ? 'myCompany' : 'newCompany', 
      href: companyProfile ? `/profile/companyprofiles/${companyProfile.company_profile_id}` : '/profile/companyprofile/new' 
    },
    { label: 'logout', action: handleSignOut }
  ];

  if (isMobile) {
    return menuItems.map((item, index) => (
      item.action ? (
        <button
          key={index}
          className="block text-lg font-medium px-4 py-2 w-full text-left"
          onClick={() => {
            item.action();
            onMenuItemClick();
          }}
        >
          {t(item.label)}
        </button>
      ) : (
        <Link
          key={index}
          href={item.href}
          className="block text-lg font-medium px-4 py-2"
          onClick={onMenuItemClick}
        >
          {t(item.label)}
        </Link>
      )
    ));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
          <Image 
            src={userProfile?.profile_image || companyProfile?.profile_image || "/placeholder-user.jpg"} 
            width={36} 
            height={36} 
            alt={userProfile?.name || companyProfile?.company_title || "User avatar"} 
            className="overflow-hidden rounded-full" 
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{userProfile?.name || companyProfile?.company_title || t('myAccount')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item, index) => (
          <DropdownMenuItem key={index}>
            {item.action ? (
              <button onClick={item.action} className="w-full text-left">
                {t(item.label)}
              </button>
            ) : (
              <Link href={item.href}>{t(item.label)}</Link>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};