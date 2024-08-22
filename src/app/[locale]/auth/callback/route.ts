import { createClient } from '@/lib/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
  
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Add user to users table if not exists
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (userCheckError && userCheckError.code !== 'PGRST116') {
        console.error('Error checking existing user:', userCheckError)
        return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent('Error checking user')}`)
      }

      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({ id: data.user.id, email: data.user.email })

        if (insertError) {
          console.error('Error inserting user:', insertError)
          return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent('Error creating user')}`)
        }

        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({ 
            user_id: data.user.id,
            email: data.user.email,
            profile_image: data.user.user_metadata.avatar_url || data.user.user_metadata.picture
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
          return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent('Error creating user profile')}`)
        }
      }

      return NextResponse.redirect(`${origin}${next}/profile/myprofile`)
    }

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent(error.message)}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?message=${encodeURIComponent('No code provided')}`)
}