import React from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { getLangDir } from 'rtl-detect';

export const HeroSection: React.FC = () => {
  const t = useTranslations('Hero');
  const locale = useLocale();
  const direction = getLangDir(locale);

  return (
    <section className="w-full py-8 md:py-11 lg:py-14">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className={`flex flex-col items-start space-y-4 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h1 className="text-3xl font-balooBhaijaan font-medium tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              {t('title')}
            </h1>
            <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
              {t('description')}
            </p>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              {t('cta')}
            </Link>
          </div>
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <img
              src="https://img.freepik.com/free-photo/aerial-view-business-team_53876-124515.jpg?w=996&t=st=1721162778~exp=1721163378~hmac=073077d268b919250937f13940862dd23429e6f543146e91c9406359c4631a9d"
              alt={t('imageAlt')}
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
