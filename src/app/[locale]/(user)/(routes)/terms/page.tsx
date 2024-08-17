import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfUsePage = () => {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Terms of Use</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using our service, you agree to be bound by these Terms of Use.
            If you disagree with any part of the terms, you may not access the service.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. User Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide accurate and complete information.
            You are responsible for safeguarding the password and for all activities that occur under your account.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. Content</h2>
          <p className="mb-4">
            Our service allows you to post, link, store, share and otherwise make available certain information, text,
            graphics, videos, or other material. You are responsible for the content you post.
          </p>

          <h2 className="text-xl font-semibold mb-4">4. Intellectual Property</h2>
          <p className="mb-4">
            The service and its original content, features, and functionality are and will remain the exclusive
            property of our company and its licensors.
          </p>

          <h2 className="text-xl font-semibold mb-4">5. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall our company, nor its directors, employees, partners, agents, suppliers, or affiliates,
            be liable for any indirect, incidental, special, consequential or punitive damages.
          </p>

          <h2 className="text-xl font-semibold mb-4">7. Changes</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing
            to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfUsePage;