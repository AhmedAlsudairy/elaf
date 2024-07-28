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
    companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
    website: z.string().url({ message: "Please enter a valid URL." }).optional(),
  });