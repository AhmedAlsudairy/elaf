import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Terms from '@/components/common/terms';
import Title from '@/components/common/tiltle';
import Description from '@/components/common/description';


export default function SignUpSection() {
  const t = useTranslations('SignUp');

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 border-t">
    <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
      <div className="space-y-3">
        <Title>{t('title')}</Title>

        <Description>{t('description')}</Description>
      </div>
      <div className="mx-auto w-full max-w-sm space-y-2">
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="font-balooBhaijaan w-full sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
            asChild
          >
            <Link href='/signup'>
            
              {t('ctaButton')}
            </Link>
          
          </Button>
        </div>
        <Terms linkText={t('termsLink')} linkHref="/terms">
          {t('termsText')}
        </Terms>
      </div>
    </div>
  </section>
  );
}