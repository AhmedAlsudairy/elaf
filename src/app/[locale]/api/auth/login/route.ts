import { createClient } from '@/lib/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function POST(request: NextRequest) {
  const supabase = createClient()

  // Parse JSON data from the request body
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  // Revalidate the layout to update the user session
  revalidatePath('/', 'layout')

  // Use Next.js redirect
  redirect('/profile/myprofile')
}