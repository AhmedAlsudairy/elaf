'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendContactForm } from "@/actions/supabase/send-contact-email";
import { useTranslations } from 'next-intl';

export const ContactForm = () => {
  const t = useTranslations('ContactForm'); // Access the 'ContactForm' translations

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setStatusMessage('');

    try {
      const result = await sendContactForm(formData);
      if (result.success) {
        setSubmitStatus('success');
        setStatusMessage(result.message || t('successMessage'));
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
        setStatusMessage(result.error || t('errorMessage'));
      }
    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(t('unexpectedError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-muted py-8 md:py-8 lg:py-8">
      <div className="container grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col items-start justify-center space-y-4">
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">{t('nameLabel')}</Label>
                <Input 
                  id="name" 
                  placeholder={t('namePlaceholder')} 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{t('emailLabel')}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder={t('emailPlaceholder')} 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">{t('messageLabel')}</Label>
              <Textarea
                id="message"
                placeholder={t('messagePlaceholder')}
                className="min-h-[150px]"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
            {submitStatus !== 'idle' && (
              <p className={submitStatus === 'success' ? 'text-green-600' : 'text-red-600'}>
                {statusMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
