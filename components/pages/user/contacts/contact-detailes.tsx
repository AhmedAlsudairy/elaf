import React from 'react';
import { FacebookIcon, LinkedinIcon, LocateIcon, MailIcon, PhoneIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { getLangDir } from 'rtl-detect';

export const ContactDetails = () => {
  const t = useTranslations('ContactDetails');
  const locale = useLocale();
  const direction = getLangDir(locale);
  const isRTL = direction === 'rtl';

  return (
    <section className="w-full bg-background py-8 md:py-12 lg:py-16">
      <div className="container grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={`flex flex-col space-y-4 ${isRTL ? 'md:order-2' : ''}`}>
          <h2 className="text-2xl font-bold">{t('contactInformation')}</h2>
          <div className="space-y-2">
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <LocateIcon className="h-6 w-6 text-muted-foreground" />
              <p className="text-muted-foreground">{t('location')}</p>
            </div>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <PhoneIcon className="h-6 w-6 text-muted-foreground" />
              <p className="text-muted-foreground">{t('phoneNumber')}</p>
            </div>
            <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
              <MailIcon className="h-6 w-6 text-muted-foreground" />
              <p className="text-muted-foreground">{t('email')}</p>
            </div>
          </div>
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <Link href="https://www.linkedin.com/company/elaaaf" className={`text-muted-foreground hover:text-primary flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`} prefetch={false}>
              <LinkedinIcon className="h-6 w-6" />
              <span>{t('linkedin')}</span>
            </Link>
            {/* Uncomment and adjust as needed */}
            {/* <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <TwitterIcon className="h-6 w-6" />
            </Link> */}
            {/* <Link href="#" className="text-muted-foreground hover:text-primary" prefetch={false}>
              <FacebookIcon className="h-6 w-6" />
            </Link> */}
          </div>
        </div>
        <div className={`flex flex-col space-y-4 ${isRTL ? 'md:order-1' : ''}`}>
          <h2 className="text-2xl font-bold">{t('ourLocation')}</h2>
          <div className="rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113815.77225197365!2d56.61494920447613!3d24.367982403771315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e9f03d8db3798d7%3A0x6e84950af256f51e!2sSohar%2C%20Oman!5e0!3m2!1sen!2s!4v1692274392172!5m2!1sen!2s&markers=color:red%7Clabel:S%7C24.367982403771315,56.61494920447613"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};