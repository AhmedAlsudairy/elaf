"use client"

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { getLangDir } from 'rtl-detect';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import LocalSwitcher from '../local-switcher';
import { ELAF_LOGO_URL, MenuIcon, XIcon } from '@/constant/svg';

import { getCurrentUserProfile } from '@/actions/supabase/get-current-user-profile';
import { getCurrentCompanyProfile } from '@/actions/supabase/get-current-company-profile';
import { ProfileMenu } from './navs/user-menu';
import supabaseClient from '@/lib/utils/supabase/supabase-call-client';
import { AuthButton } from './navs/handle-auth-button';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const direction = useMemo(() => getLangDir(locale), [locale]);
  const pathName = usePathname();
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      setIsAuthenticated(!!user);
      if (user) {
        const [userData, companyData] = await Promise.all([
          getCurrentUserProfile(),
          getCurrentCompanyProfile()
        ]);
        setUserProfile(userData);
        setCompanyProfile(companyData);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setCompanyProfile(null);
    router.push('/');
  }, [router]);

  const navItems = useMemo(() => ["tenders", "profile/companyprofiles", "contact"], []);
  const isRTL = direction === 'rtl';

  const renderNavItems = useCallback((isMobile = false) => 
    navItems.map((item) => (
      <Link
        key={item}
        href={`/${locale}/${item}`}
        className={`${isMobile ? 'block' : ''} text-lg md:text-base lg:text-lg font-medium px-4 py-2 ${pathName?.includes(item) ? 'bg-primary text-white rounded-md' : ''}`}
        prefetch={false}
        onClick={isMobile ? () => setIsMenuOpen(false) : undefined}
      >
        {t(item)}
      </Link>
    )), [navItems, locale, pathName, t]);

  return (
    <header className={`px-4 lg:px-6 h-14 flex items-center justify-between font-balooBhaijaan`} dir={direction}>
      <Link href={`/${locale}`} className="flex items-center justify-center" prefetch={false}>
        <img src={ELAF_LOGO_URL} alt="Elaf Logo" className="h-20 w-20" />
        <span className="sr-only">Elaf</span>
      </Link>
      <nav className={`hidden md:flex flex-row items-center font-balooBhaijaan`}>
        {renderNavItems()}
      </nav>
      <div className={`hidden md:flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
        <LocalSwitcher />
        <AuthButton
          isLoading={isLoading}
          isAuthenticated={isAuthenticated}
          userProfile={userProfile}
          companyProfile={companyProfile}
          onSignOut={handleSignOut}
        />
      </div>
      <div className="md:hidden flex items-center">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Menu"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </Button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white py-4 shadow-md md:hidden font-balooBhaijaan">
          {renderNavItems(true)}
          <div className="px-4 py-2 space-y-2">
            <LocalSwitcher />
            <AuthButton
              isLoading={isLoading}
              isAuthenticated={isAuthenticated}
              userProfile={userProfile}
              companyProfile={companyProfile}
              onSignOut={handleSignOut}
              isMobile={true}
            />
          </div>
        </div>
      )}
    </header>
  );
};