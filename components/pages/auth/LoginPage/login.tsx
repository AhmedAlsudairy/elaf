"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Auth from "../components/auth";
import { ELAF_LOGO_URL } from "@/constant/svg";
import { IsLoggedIn } from "@/actions/supabase/is-user-login";
import { SignOut } from "@/actions/supabase/signout";
import { OauthSignin } from "@/actions/supabase/oauth-signin";
import { useReusableToast } from "@/components/common/success-toast";
import { login } from "@/actions/supabase/auth-with-creditial";


const LoginPage = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [isSignedIn, setIsSignedIn] = useState(false);
   const showToast = useReusableToast();
   const router = useRouter();

   useEffect(() => {
     const checkLoginStatus = async () => {
       const loggedIn = await IsLoggedIn();
       setIsSignedIn(loggedIn);
     };
     checkLoginStatus();
   }, []);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      await OauthSignin();
      setIsSignedIn(await IsLoggedIn());
      showToast('success', 'Logged in successfully');
      router.push('/'); // Redirect to home page after successful login
    } catch (error) {
      showToast('error', 'OAuth sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await SignOut();
      setIsSignedIn(false);
      showToast('success', 'Signed out successfully');
    } catch (error) {
      showToast('error', 'Sign-out failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      const result = await login(formData);
      
      if (result.error) {
        showToast('error', result.error);
        return { error: result.error };
      }

      setIsSignedIn(true);
      showToast('success', 'Logged in successfully');
      router.push('/'); // Redirect to home page after successful login
      return {};
    } catch (error) {
      console.error('Login error:', error);
      showToast('error', 'An unexpected error occurred. Please try again.');
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Auth
      mode="login"
      isLoading={isLoading}
      googleAuthAction={handleAuth}
      signOutAction={handleSignOut}
      logoUrl={ELAF_LOGO_URL}
      isSignedIn={isSignedIn}
      emailAuthAction={handleEmailAuth}
      resendConfirmationAction={() => Promise.resolve()} // Placeholder for resend confirmation action
    />
  );
};

export default LoginPage;