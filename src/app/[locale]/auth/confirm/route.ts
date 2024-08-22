import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (token_hash && type) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    console.log('first', data)

    if (!error) {
      // Get the user after successful verification
      const { data: { user } } = await supabase.auth.getUser()
      console.log(user)

      if (user) {
        // Prepare user data for users table
        const usersData = {
          email: user.email,
          name: user.user_metadata.full_name || '', // Assuming full_name is stored in user_metadata
        }

        // Add user to users table
        const { error: usersError } = await supabase
          .from('users')
          .upsert(usersData, { onConflict: 'email' })

        if (usersError) {
          console.error('Error adding/updating user in users table:', usersError)
          // Handle this error as needed
        }

        // Prepare user data for user_profiles table
        const profilesData = {
          email: user.email,
          name: user.user_metadata.full_name || '',
          user_id: user.id,
          profile_image: user.user_metadata.avatar_url || user.user_metadata.picture
        }

        // Add user to user_profiles table
        const { error: profilesError } = await supabase
          .from('user_profiles')
          .upsert(profilesData)

        if (profilesError) {
          console.error('Error adding/updating user in user_profiles table:', profilesError)
          // Handle this error as needed
        }

        if (usersError || profilesError) {
          // If there were any errors, you might want to redirect to an error page
          redirect('/error')
        }
      }

      // Check if the msg exists in the data object
      if (data.user && 'msg' in data.user) {
        // Encode the msg as a URL parameter
        const params = new URLSearchParams({
          msg: data.user.msg as string
        })
        // Append the msg parameter to the next URL
        redirect(`${next}?${params.toString()}`)
      } else {
        // If no msg, just redirect to the next URL
        redirect(next)
      }
    } else {
      console.error('Verification error:', error)
      redirect('/error')
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}