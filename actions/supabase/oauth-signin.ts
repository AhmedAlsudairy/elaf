'use client'


import { redirect } from 'next/navigation';
import supabaseClient from "@/lib/utils/supabase/supabase-call-client";

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