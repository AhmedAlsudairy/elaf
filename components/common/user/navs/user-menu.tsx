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
import { useClerk } from '@clerk/nextjs';

export const ProfileMenu = ({ userProfile, companyProfile, isMobile, onMenuItemClick, onSignOut }: UserMenuProps) => {
  const t = useTranslations('Navbar');
  const router = useRouter();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    onSignOut(); // This will update the state in the Header component
    router.push('/'); // Redirect to home page
    router.refresh(); // Revalidate the current path
  };

  // Safely get company ID, ensuring it's never undefined
  const getCompanyId = () => {
    if (!companyProfile) return null;
    const id = (companyProfile as any).id || (companyProfile as any).company_profile_id;
    return id && id !== 'undefined' ? id : null;
  };

  const companyId = getCompanyId();
  const companyHref = companyId 
    ? `/profile/companyprofiles/${companyId}` 
    : '/profile/companyprofiles/new';

  const menuItems = [
    { label: 'myProfile', href: '/profile/myprofile' },
    { label: 'chats', href: '/chats' },
    { 
      label: companyProfile ? 'myCompany' : 'newCompany', 
      href: companyHref
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
        <DropdownMenuLabel>{userProfile?.name || (companyProfile as any)?.company_title || (companyProfile as any)?.companyTitle || t('myAccount')}</DropdownMenuLabel>
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