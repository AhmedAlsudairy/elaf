import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPage = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create an account,
            submit a form, or communicate with us.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services,
            to communicate with you, and to comply with legal obligations.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not share your personal information with third parties except as described
            in this privacy policy or with your consent.
          </p>

          <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-4">
            We take reasonable measures to help protect your personal information from loss,
            theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
          </p>

          <h2 className="text-xl font-semibold mb-4">5. Your Rights and Choices</h2>
          <p className="mb-4">
            You have the right to access, update, or delete your personal information. You can
            also choose to opt-out of certain communications or data collection practices.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify you of any
            changes by posting the new privacy policy on this page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPage;