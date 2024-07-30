// app/actions/registration.ts
'use server'

import { z } from 'zod'
import { userProfileSchema, companySchema } from '@/schema'
import { createClient } from '@/lib/utils/supabase/server'

const supabase = createClient()

export async function submitUserProfile(data: z.infer<typeof userProfileSchema>) {
  // Validate the data
  const validatedData = userProfileSchema.parse(data)
const {error}=await supabase.auth.updateUser({
    data: { avatar_url:validatedData.profile_image ,
        full_name:validatedData.name,
        email: validatedData.email

    }

  })

console.log(error)
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
  
  // Here you would typically save both profiles to your database
  console.log('Saving final submission:', { userProfile: validatedUserProfile, company: validatedCompany })
  
  // Return some response
  return { success: true, message: 'Registration completed successfully' }
}