//app/auth/callback

import { upsertUserDetails } from '@/actions/supabase/add-user-db'
import { getUserDetails } from '@/actions/supabase/get-user-details'
import { createClient } from '@/lib/utils/supabase/server'
import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
  
    const { error } = await supabase.auth.exchangeCodeForSession(code)
 upsertUserDetails()

    if (!error) {
 
    
      return NextResponse.redirect(`${origin}${next}`)
    }

  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}`)
}


