// app/actions/getUserProfile.ts
'use server'

import { SupabaseClient } from '@supabase/supabase-js'

export const getUserProfile = async (supabase:SupabaseClient,userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  if (!data) {
    console.log('User profile not found')
    return null
  }

  return data
}