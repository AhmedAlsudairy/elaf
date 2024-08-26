"use client"
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Auth from "../components/auth";
import { ELAF_LOGO_URL } from "@/constant/svg";
import { IsLoggedIn } from "@/actions/supabase/is-user-login";
import { SignOut } from "@/actions/supabase/signout";
import { OauthSignin } from "@/actions/supabase/oauth-signin";
import { useReusableToast } from "@/components/common/success-toast";
import { login } from "@/actions/supabase/auth-with-creditial";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
   const [isLoading, setIsLoading] = useState(true);
   const [isSignedIn, setIsSignedIn] = useState(false);
   const showToast = useReusableToast();
   const router = useRouter();

   useEffect(() => {
     const checkLoginStatus = async () => {
       setIsLoading(true);
       try {
         const loggedIn = await IsLoggedIn();
         setIsSignedIn(loggedIn);
         if (loggedIn) {
           router.push('/profile/myprofile');
         }
       } finally {
         setIsLoading(false);
       }
     };
     checkLoginStatus();
   }, [router]);

  const handleAuth = async () => {
    try {
      await OauthSignin();
      // The redirection will be handled by the OauthSignin function
    } catch (error) {
      showToast('error', 'OAuth sign-in failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await SignOut();
      setIsSignedIn(false);
      showToast('success', 'Signed out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      showToast('error', 'Sign-out failed');
    }
  };

  const handleEmailAuth = async (data: { email: string; password: string }) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      const result = await login(formData);
      
      if (result && result.error) {
        showToast('error', result.error);
        return { error: result.error };
      }
      
      // Successful login is handled by the login function, including redirection
      return {};
    } catch (error) {
      console.error('Login error:', error);
      showToast('error', 'An unexpected error occurred. Please try again.');
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="ml-2 text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <Auth
      mode="login"
      isLoading={isLoading}
      googleAuthAction={handleAuth}
      signOutAction={handleSignOut}
      logoUrl={ELAF_LOGO_URL}
      isSignedIn={isSignedIn}
      emailAuthAction={handleEmailAuth}
      resendConfirmationAction={() => Promise.resolve()}
    />
  );
};

export default LoginPage;