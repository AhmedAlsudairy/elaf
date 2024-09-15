import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations, useLocale } from 'next-intl';

const PrivacyPage = () => {
  const t = useTranslations('PrivacyPolicy');
  const locale = useLocale();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('privacy_policy')}</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">{t('information_we_collect_title')}</h2>
          <p className="mb-4">{t('information_we_collect_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('how_we_use_your_information_title')}</h2>
          <p className="mb-4">{t('how_we_use_your_information_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('information_sharing_title')}</h2>
          <p className="mb-4">{t('information_sharing_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('data_security_title')}</h2>
          <p className="mb-4">{t('data_security_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('your_rights_title')}</h2>
          <p className="mb-4">{t('your_rights_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('changes_to_privacy_policy_title')}</h2>
          <p className="mb-4">{t('changes_to_privacy_policy_content')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPage;