import { SectorEnum } from "@/constant/text";
import * as z from "zod";


export const userProfileSchema = z.object({
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