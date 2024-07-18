"use client"

import React, { useState } from 'react';
import Link from "next/link";
import { ELAF_LOGO_URL, EraserIcon, MenuIcon, XIcon } from '@/constant/svg';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { getLangDir } from 'rtl-detect';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import LocalSwitcher from './local-switcher';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const direction = getLangDir(locale);
  const pathName = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = ["posts", "tenders", "companies", "contact"];
  const isRTL = direction === 'rtl';

  return (
    <header className={`px-4 lg:px-6 h-14 flex items-center justify-between font-balooBhaijaan`} dir={direction}>
      <Link href={`/${locale}`} className="flex items-center justify-center" prefetch={false}>
      <img src={ELAF_LOGO_URL} alt="Elaf Logo" className="h-20 w-20" /> {/* Use the logo here */}

        <span className="sr-only">Elaf</span>
      </Link>
      <nav className={`hidden md:flex flex-row items-center font-balooBhaijaan`}>
        {navItems.map((item) => (
          <Link
            key={item}
            href={`/${locale}/${item}`}
            className={`text-lg md:text-base lg:text-lg font-medium px-4 py-2 ${pathName?.includes(item) ? 'bg-primary text-white rounded-md' : ''}`}
            prefetch={false}
          >
            {t(item)}
          </Link>
        ))}
      </nav>
      <div className={`hidden md:flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
        <LocalSwitcher />
        <Button
          variant="outline"
          className="text-primary border-primary hover:bg-primary hover:text-white font-balooBhaijaan"
        >
          {t('signin')}
        </Button>
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
          {navItems.map((item) => (
            <Link
              key={item}
              href={`/${locale}/${item}`}
              className={`block text-lg font-medium px-4 py-2 ${pathName?.includes(item) ? 'bg-primary text-white rounded-md' : ''}`}
              prefetch={false}
              onClick={() => setIsMenuOpen(false)}
            >
              {t(item)}
            </Link>
          ))}
          <div className="px-4 py-2 space-y-2">
            <LocalSwitcher />
            <Button
              variant="outline"
              className="text-primary border-primary w-full hover:bg-primary hover:text-white"
            >
              {t('signin')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
