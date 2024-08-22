'use server'

import { createClient } from '@/lib/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation';

export type AuthResult = 
  | { error: string; emailExists?: boolean }
  | { success: string };

export type SignupResult = AuthResult;

export async function Signup(formData: FormData): Promise<SignupResult> {
  const supabase = createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!email || !password || !name) {
    return { error: 'Email, password, and name are required' }
  }



  // If user doesn't exist, proceed with signup
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    }
  })

  if (error) {
    console.error('Signup error:', error.message)
    return { error: error.message }
  }

  // Check if the user was actually created
  if (data?.user?.identities?.length === 0) {
    return { error: 'User already exists. Please sign in with your existing account.', emailExists: true }
  }

  await ResendConfirmationEmail(email)
  console.log('User signed up:', data)
  revalidatePath('/', 'layout')

  return { success: 'Confirmation email sent. Please check your inbox.' }
}

export async function ResendConfirmationEmail(email: string): Promise<AuthResult> {
  const supabase = createClient()

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })

  if (error) {
    console.error('Resend confirmation error:', error.message)
    return { error: error.message }
  }

  return { success: 'Confirmation email resent. Please check your inbox.' }
}




export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const supabase = createClient();
  const email = formData.get("email") as string;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
  });
  if (error) {
    return { error: error.message };
  }
  return { success: "Password reset email sent. Please check your inbox." };
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const supabase = createClient();
  const new_password = formData.get("password") as string;
  const { error } = await supabase.auth.updateUser({ password: new_password });
  if (error) {
    console.log(error);
    return { error: error.message };
  }
  return { success: "Password updated successfully." };
}