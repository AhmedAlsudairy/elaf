import { SectorEnum } from "@/constant/text";
import * as z from "zod";


export const userProfileSchema = z.object({
  id: z.string().uuid().optional(),
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    bio: z.string().optional(),
    phone_number: z.string().optional(),
    address: z.string().optional(),
    profile_image: z.string().optional(),
    role: z.string().optional(),
    company_that_worked_with: z.string().optional(),
  });
  
  export const companySchema = z.object({
    id: z.string().uuid().optional(),
    company_profile_id: z.string().uuid().optional(),

    company_title: z.string().min(2, { message: "Company title must be at least 2 characters." }),
    company_number: z.string().optional(),
    company_website: z.string().url({ message: "Please enter a valid URL." }).optional(),
    company_email: z.string().email({ message: "Please enter a valid email address." }),
    sectors: z.array(z.nativeEnum(SectorEnum)).optional(),
    bio: z.string().optional(),
    phone_number: z.string().optional(),
    address: z.string().optional(),
    profile_image: z.string().optional(),
   
})

export const TenderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  tender_sectors: z.array(z.nativeEnum(SectorEnum)).min(1, "At least one sector is required"),
  pdf_url: z.string().url("Invalid URL"),
  end_date: z.date({
    required_error: "End date is required",
  }),
  terms: z.string().min(1, "Terms are required"),
  scope_of_works: z.string().min(1, "Scope of works is required"),
  pdf_choice: z.enum(['upload', 'generate']),
  custom_fields: z.array(z.object({
    title: z.string(),
    description: z.string()
  }))
})

export type TenderFormValues = z.infer<typeof TenderSchema>;