'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { getLangDir } from 'rtl-detect';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import LocalSwitcher from '../local-switcher';
import { ELAF_LOGO_URL, MenuIcon, XIcon } from '@/constant/svg';

import { AuthButton } from './navs/handle-auth-button';
import { checkAuthAndProfiles } from '@/actions/supabase/check-auth-and-profile';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userProfile: null,
    companyProfile: null,
    isLoading: true
  });
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const direction = useMemo(() => getLangDir(locale), [locale]);
  const pathName = usePathname();
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const result = await checkAuthAndProfiles();
      setAuthState({
        isAuthenticated: result.isAuthenticated,
        userProfile: result.userProfile,
        companyProfile: result.companyProfile,
        isLoading: false
      });
    } catch (error) {
      console.error('Error checking auth and profiles:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const intervalId = setInterval(checkAuth, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, [checkAuth]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
    setAuthState({
      isAuthenticated: false,
      userProfile: null,
      companyProfile: null,
      isLoading: false
    });
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
        {/* <LocalSwitcher /> */}
        <AuthButton
          isLoading={authState.isLoading}
          isAuthenticated={authState.isAuthenticated}
          userProfile={authState.userProfile}
          companyProfile={authState.companyProfile}
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
        <div className="absolute top-14 left-0 right-0 bg-white py-4 shadow-md md:hidden font-balooBhaijaan z-50">
          {renderNavItems(true)}
          <div className="px-4 py-2 space-y-2">
            {/* <LocalSwitcher /> */}
            <AuthButton
              isLoading={authState.isLoading}
              isAuthenticated={authState.isAuthenticated}
              userProfile={authState.userProfile}
              companyProfile={authState.companyProfile}
              onSignOut={handleSignOut}
              isMobile={true}
            />
          </div>
        </div>
      )}
    </header>
  );
};