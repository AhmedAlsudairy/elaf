import { useTranslations } from 'next-intl';
import { ELAF_LOGO_URL } from "@/constant/svg";

export const ContactHeader = () => {
  const t = useTranslations('ContactHeader'); 

  return (
    <section className="w-full bg-muted py-8 md:py-12 lg:py-12">
      <div className="container grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col items-start justify-center space-y-2">
          <div className="flex items-center space-x-6">
            <img src={ELAF_LOGO_URL} alt={t('logoAlt')} className="h-40 w-40" />
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{t('title')}</h1>
              <p className="text-lg text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
  