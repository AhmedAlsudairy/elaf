import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ELAF_LOGO_URL } from "@/constant/svg"
import { getLangDir } from 'rtl-detect'

export default function ContactHeader() {
  const t = useTranslations('ContactHeader')
  const locale = useLocale()
  const direction = getLangDir(locale)

  return (
    <section className="w-full bg-muted py-8 md:py-12 lg:py-12">
      <div className={`container ${direction === 'rtl' ? 'pl-4 md:pl-6 lg:pl-8' : 'pr-4 md:pr-6 lg:pr-8'}`}>
        <div className={`flex ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex flex-col ${direction === 'rtl' ? 'items-end' : 'items-start'}`}>
            <img src={ELAF_LOGO_URL} alt={t('logoAlt')} className="h-40 w-40 mb-4" />
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
  )
}