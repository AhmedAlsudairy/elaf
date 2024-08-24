import React from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserMenuProps } from '@/types';
import { SignOut } from '@/actions/supabase/signout';

export const ProfileMenu = ({ userProfile, companyProfile, isMobile, onMenuItemClick, onSignOut }: UserMenuProps) => {
  const t = useTranslations('Navbar');
  const router = useRouter();

  const handleSignOut = async () => {
    await SignOut();
    onSignOut(); // This will update the state in the Header component
    router.push('/'); // Redirect to home page
    router.refresh(); // Revalidate the current path
  };

  const menuItems = [
    { label: 'myProfile', href: '/profile/myprofile' },
    { 
      label: companyProfile ? 'myCompany' : 'newCompany', 
      href: companyProfile ? `/profile/companyprofiles/${companyProfile.company_profile_id}` : '/profile/companyprofiles/new' 
    },
    { label: 'logout', action: handleSignOut }
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarFallback>
              {getInitials(userProfile?.name ||  'User')}
            </AvatarFallback>
          </Avatar>
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