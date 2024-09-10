import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ELAF_LOGO_URL } from "@/constant/svg";
import { getLangDir } from 'rtl-detect';

export const ContactHeader: React.FC = () => {
  const t = useTranslations('ContactHeader');
  const locale = useLocale();
  const direction = getLangDir(locale);

  const sectionPadding = direction === 'rtl'
    ? 'py-12 lg:py-8 md:py-12'
    : 'py-8 md:py-12 lg:py-12';

  return (
    <section className={` bg-muted ${sectionPadding}`}>
      <div className="container">
        <div className={`flex ${direction==='rtl'?'justify-end':"justify-start"} ${direction === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex items-center gap-8">
            <img src={ELAF_LOGO_URL} alt={t('logoAlt')} className="h-40 w-40" />
            <div className={`text-${direction === 'rtl' ? 'right' : 'left'}`}>
              <h1 className="text-3xl font-bold">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};