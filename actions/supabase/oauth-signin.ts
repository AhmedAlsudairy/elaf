'use client'


import { redirect } from 'next/navigation';
import supabaseClient from "@/lib/utils/supabase/supabase-call-client";

export type AuthResult = 
  | { error: string; emailExists?: boolean }
  | { success: string };

export type SignupResult = AuthResult;
export type SignOutResult = AuthResult;


export const OauthSignin = async () => {
  try {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      return { error: error.message };
    }

    if (data?.url) {
      redirect(data.url);
    }
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred' };
  }
};