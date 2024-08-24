'use server'
import { z } from 'zod'
import { userProfileSchema, companySchema } from '@/schema'
import { createClient } from '@/lib/utils/supabase/server'

const supabase = createClient()

type UserProfileData = z.infer<typeof userProfileSchema>
type CompanyData = z.infer<typeof companySchema>

interface RegistrationResult {
  success: boolean
  message: string
  userId?: string
  companyId?: string
  error?: string
}

export async function submitFinalForm(
  userProfile: UserProfileData,
  company: CompanyData | null
): Promise<RegistrationResult> {
  try {
    console.log('Starting submitFinalForm...');

    // Validate the data
    const validatedUserProfile = userProfileSchema.parse(userProfile)
    const validatedCompany = company ? companySchema.parse(company) : null

    console.log('Data validated successfully');

    // Start a Supabase transaction
    console.log('Calling Supabase RPC...');
    const { data, error } = await supabase.rpc('register_user_and_company', {
      p_user_profile: validatedUserProfile,
      p_company: validatedCompany
    })
    await supabase.auth.updateUser({ email: validatedUserProfile.email });


    console.log("here",data)

    if (error) {
      console.error('Error in registration process:', error)
      return {
        success: false,
        message: 'Registration failed due to a database error',
        error: error.message
      }
    }

    if (!data) {
      console.error('No data returned from registration process')
      return {
        success: false,
        message: 'Registration failed due to an unexpected error',
        error: 'No data returned from database'
      }
    }

    console.log('Registration successful, data:', data);

    return {
      success: true,
      message: 'Registration completed successfully',
      
    }
  } catch (error) {
    console.error('Unexpected error during registration:', error)
    return {
      success: false,
      message: 'An unexpected error occurred during registration',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}