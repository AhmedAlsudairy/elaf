// app/actions/checkUserProfileAndRedirect.ts
'use server'

import { redirect } from 'next/navigation';

import supabaseClient from '@/lib/utils/supabase/supabase-call-client';
import { getUserProfile } from './get-user-profile';
import supabaseServer from '@/lib/utils/supabase/supabase-call-server';
import { getUserDetails } from './get-user-details';

export async function checkUserProfileAndRedirect() {
    const userDetails = await getUserDetails();
    if (userDetails) {
      const profile = await getUserProfile(supabaseServer, userDetails.id);
console.log(profile)
    if (profile) {
      // Redirect to profile page if user already has a profile
      redirect('/profile/myprofile');
    }
    }



}