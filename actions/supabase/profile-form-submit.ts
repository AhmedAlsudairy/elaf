// app/actions/registration.ts
'use server'

import { z } from 'zod'
import { userProfileSchema, companySchema } from '@/schema'
import { createClient } from '@/lib/utils/supabase/server'

const supabase = createClient()

export async function submitUserProfile(data: z.infer<typeof userProfileSchema>) {
  // Validate the data
  const validatedData = userProfileSchema.parse(data)
  // Here you would typically save the data to your database
  console.log('Saving user profile:', validatedData)

  // Return some response
  return { success: true, message: 'User profile saved successfully' }
}

export async function submitCompany(data: z.infer<typeof companySchema>) {
  // Validate the data
  const validatedData = companySchema.parse(data)
  
  // Here you would typically save the data to your database
  console.log('Saving company profile:', validatedData)
  
  // Return some response
  return { success: true, message: 'Company profile saved successfully' }
}

export async function submitFinalForm(userProfile: z.infer<typeof userProfileSchema>, company: z.infer<typeof companySchema> | null) {
  // Validate the data
  const validatedUserProfile = userProfileSchema.parse(userProfile)
  const validatedCompany = company ? companySchema.parse(company) : null
  const { data, error } = await supabase.rpc('upsert_user_and_profile', {
    p_email: validatedUserProfile.email,
    p_name: validatedUserProfile.name,
    p_imageurl: validatedUserProfile.profile_image,
    p_bio: validatedUserProfile.bio || null,
    p_phone_number: validatedUserProfile.phone_number || null,
    p_address: validatedUserProfile.address || null,
    p_role: validatedUserProfile.role || null,
    p_company_that_worked_with: validatedUserProfile.company_that_worked_with || null
  })

  if (error) {
    console.error('Error upserting user and profile:', error)
    return { success: false, message: 'Failed to save user data', error: error.message }
  }

  // Here you would typically save the company profile if it exists
  if (validatedCompany) {
    console.log('Saving company profile:', validatedCompany)
    // Implement company profile saving logic here
  }
  return { success: true, message: 'Registration completed successfully', user: data }
}