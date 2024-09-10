import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Terms from "@/components/common/terms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { getLangDir } from 'rtl-detect';

interface AuthProps {
  mode: 'login' | 'signup';
  isLoading: boolean;
  logoUrl: string;
  isSignedIn: boolean | (() => Promise<boolean>);
  googleAuthAction: () => Promise<void>;
  emailAuthAction: (data: { email: string; password: string; name?: string }) => Promise<{ error?: string; emailExists?: boolean }>;
  signOutAction: () => Promise<void>;
  resendConfirmationAction: (email: string) => Promise<void>;
}

const baseSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signUpSchema = baseSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormValues = z.infer<typeof signUpSchema>;

const Auth: React.FC<AuthProps> = ({ 
  mode, 
  isLoading, 
  logoUrl, 
  isSignedIn,
  googleAuthAction,
  emailAuthAction,
  signOutAction,
  resendConfirmationAction
}) => {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const direction = getLangDir(locale);

  const isLogin = mode === "login";
  const [showForm, setShowForm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [lastUsedEmail, setLastUsedEmail] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(isLogin ? baseSchema : signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleGoogleAuth = useCallback(async () => {
    setGoogleLoading(true);
    try {
      if (isSignedIn) {
        await signOutAction();
      } else {
        await googleAuthAction();
      }
    } finally {
      setGoogleLoading(false);
    }
  }, [isSignedIn, signOutAction, googleAuthAction]);

  const onSubmit = useCallback(async (values: FormValues) => {
    setEmailLoading(true);
    setEmailExists(false);
    setLastUsedEmail(values.email);
    try {
      const result = await emailAuthAction(values);
      if (result.emailExists) {
        setEmailExists(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setEmailLoading(false);
    }
  }, [emailAuthAction]);

  const handleResendConfirmation = useCallback(async () => {
    setEmailLoading(true);
    try {
      await resendConfirmationAction(lastUsedEmail);
    } catch (error) {
      console.error('Resend confirmation error:', error);
    } finally {
      setEmailLoading(false);
    }
  }, [resendConfirmationAction, lastUsedEmail]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  const title = isSignedIn ? t('welcomeBack') : (isLogin ? t('welcomeBack') : t('letsStart'));
  const buttonText = isSignedIn ? t('signOut') : (isLogin ? t('signInWithGoogle') : t('signUpWithGoogle'));

  return (
    <section className={`bg-gray-100 min-h-screen flex items-center justify-center p-4 ${direction === 'rtl' ? 'py-12 lg:py-8 md:py-12' : 'py-8 md:py-12 lg:py-12'}`}>
      <Card className="w-full max-w-[400px] sm:max-w-[500px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <img src={logoUrl} alt={t('logoAlt')} className="w-32 h-32 sm:w-40 sm:h-40" />
          </div>
          <CardTitle className="font-balooBhaijaan text-3xl sm:text-4xl">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <Button 
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className={`font-balooBhaijaan w-full h-10 text-md px-4 sm:px-6 mb-4 ${
              isSignedIn ? 'bg-red-500 hover:bg-red-600 text-white' : ''
            }`}
            variant={isSignedIn ? "destructive" : "default"}
          >
            {googleLoading ? (
              <ClipLoader color="#ffffff" size={20} />
            ) : (
              <>
                {!isSignedIn && <FaGoogle className={`${direction === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />}
                {buttonText}
              </>
            )}
          </Button>
          {!isSignedIn && (
            <Button
              onClick={() => setShowForm(!showForm)}
              variant="outline"
              className="w-full mt-2"
            >
              {showForm ? t('hideForm') : t(isLogin ? 'loginWithEmail' : 'signUpWithEmail')}
            </Button>
          )}
          {showForm && !isSignedIn && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                {!isLogin && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('namePlaceholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder={t('emailPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('password')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t('passwordPlaceholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={emailLoading}>
                  {emailLoading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    t(isLogin ? 'login' : 'signUp')
                  )}
                </Button>
                {isLogin && (
                  <div className="text-center mt-2">
                    <Link href="/forgotPassword" className="text-blue-500 hover:underline">
                      {t('forgotPassword')}
                    </Link>
                  </div>
                )}
              </form>
            </Form>
          )}
          {emailExists && (
            <div className="mt-4 p-4 border rounded-md shadow-sm">
              <p className="mb-2 text-center">{t('emailExistsMessage', { email: lastUsedEmail })}</p>
              <div className="flex justify-center">
                <Button onClick={handleResendConfirmation} disabled={emailLoading}>
                  {emailLoading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    t('resendConfirmationEmail')
                  )}
                </Button>
              </div>
            </div>
          )}
          <div className="mt-4 text-center">
            <Link href={isLogin ? "/signup" : "/login"} className="text-blue-500 hover:underline">
              {t(isLogin ? 'noAccountSignUp' : 'haveAccountLogin')}
            </Link>
          </div>
        </CardContent>
        {!isSignedIn && (
          <CardFooter className="flex justify-center text-center">
            <Terms linkText={t('termsOfService')} linkHref="/terms">
              {t('agreeToTerms', { action: t(isLogin ? 'signingIn' : 'signingUp') })}
            </Terms>
          </CardFooter>
        )}
      </Card>
    </section>
  );
};

export default Auth;