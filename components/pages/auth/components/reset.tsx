'use client'

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const ForgotPasswordForm: React.FC = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            Please use the Forgot Password link on the login page to reset your password.
          </p>
          <Button asChild className='w-full'>
            <Link href='/auth/login'>Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const UpdatePasswordForm: React.FC = () => {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Update Password</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-muted-foreground'>
              Please manage your password updating through your profile settings.
            </p>
            <Button asChild className='w-full'>
              <Link href='/'>Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

