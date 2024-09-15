import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const Footer: React.FC = () => {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col gap-4 sm:flex-row py-6 w-full shrink-0 items-center justify-between px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400 order-2 sm:order-1">
        {t('copyright', { year: currentYear })}
      </p>
      <nav className="flex gap-4 sm:gap-6 order-1 sm:order-2">
        <Link href="/privacy" className="text-xs hover:underline underline-offset-4">
          {t('privacy')}
        </Link>
        <Link href="/terms" className="text-xs hover:underline underline-offset-4">
          {t('terms')}
        </Link>
        <Link href="/contact" className="text-xs hover:underline underline-offset-4">
          {t('contact')}
        </Link>
      </nav>
    </footer>
  );
};