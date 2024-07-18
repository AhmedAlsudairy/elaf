import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SignUpSection() {
  const t = useTranslations('SignUp');

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-balooBhaijaan font-medium tracking-tighter md:text-4xl/tight">
            {t('title')}
          </h2>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            {t('description')}
          </p>
        </div>
        <div className="mx-auto w-full max-w-sm space-y-2">
        <div className="flex justify-center">
            <Button 
              type="submit" 
              className="font-balooBhaijaan w-full sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
            >
              {t('ctaButton')}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('termsText')}{" "}
            <Link href="#" className="underline underline-offset-2">
              {t('termsLink')}
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}