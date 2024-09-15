import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfUsePage = () => {
  const t = useTranslations('TermsOfUse');

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">{t('acceptance_of_terms')}</h2>
          <p className="mb-4">{t('acceptance_of_terms_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('user_accounts')}</h2>
          <p className="mb-4">{t('user_accounts_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('content')}</h2>
          <p className="mb-4">{t('content_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('intellectual_property')}</h2>
          <p className="mb-4">{t('intellectual_property_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('termination')}</h2>
          <p className="mb-4">{t('termination_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('limitation_of_liability')}</h2>
          <p className="mb-4">{t('limitation_of_liability_content')}</p>

          <h2 className="text-xl font-semibold mb-4">{t('changes')}</h2>
          <p className="mb-4">{t('changes_content')}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfUsePage;
