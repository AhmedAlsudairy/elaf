"use client"

import { useState, useEffect } from "react";
import Auth from "../components/auth";
import { ELAF_LOGO_URL } from "@/constant/svg";
import { IsLoggedIn } from "@/actions/supabase/is-user-login";
import { SignOut } from "@/actions/supabase/signout";
import { OauthSignin } from "@/actions/supabase/oauth-signin";
import { Signup, ResendConfirmationEmail, AuthResult } from "@/actions/supabase/auth-with-creditial";
import { useReusableToast } from "@/components/common/success-toast";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [lastUsedEmail, setLastUsedEmail] = useState('');
  const showToast = useReusableToast();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await IsLoggedIn();
      setIsSignedIn(loggedIn);
    };
    checkLoginStatus();
  }, []);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const result = await OauthSignin();
      // Handle the result if needed
    } catch (error) {
      console.error('Google auth error:', error);
      showToast('error', 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await SignOut();
      // The SignOut function will redirect, so we don't need to do anything here
    } catch (error) {
      console.error('Sign out error:', error);
      showToast('error', 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (data: { email: string; password: string; name?: string }): Promise<{ error?: string; emailExists?: boolean }> => {
    setIsLoading(true);
    setEmailExists(false);
    setLastUsedEmail(data.email);
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.name) {
        formData.append('name', data.name);
      }

      const result = await Signup(formData);
      if ('error' in result) {
        if ('emailExists' in result && result.emailExists) {
          setEmailExists(true);
          return { emailExists: true };
        }
        showToast('error', result.error);
        return { error: result.error };
      } else {
        showToast('success', result.success);
        return {};
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during signup';
      showToast('error', errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await ResendConfirmationEmail(email);
      if ('error' in result) {
        showToast('error', result.error);
      } else {
        showToast('success', result.success);
      }
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'An unexpected error occurred while resending confirmation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Auth
        mode="signup"
        isLoading={isLoading}
        googleAuthAction={handleGoogleAuth}
        emailAuthAction={handleEmailAuth}
        signOutAction={handleSignOut}
        resendConfirmationAction={handleResendConfirmation}
        logoUrl={ELAF_LOGO_URL}
        isSignedIn={isSignedIn}
      />
    </>
  );
};

export default SignUp;