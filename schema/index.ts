import { SectorEnum } from "@prisma/client";
import * as z from "zod";

// User Profile Schema
export const userProfileSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
  role: z.string().optional(),
  companyThatWorkedWith: z.string().optional(),
});

// Company Schema
export const companySchema = z.object({
  id: z.string().uuid().optional(),
  companyProfileId: z.string().nullish(),
  companyTitle: z.string().min(2, { message: "Company title must be at least 2 characters." }),
  companyNumber: z.string().nullish(),
  companyWebsite: z.string().url({ message: "Please enter a valid URL." }).nullish().or(z.literal("")),
  companyEmail: z.string().email({ message: "Please enter a valid email address." }),
  sectors: z.array(z.nativeEnum(SectorEnum)).nullish(),
  bio: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  address: z.string().nullish(),
  profileImage: z.string().nullish(),
});

// Tender Schema
export const TenderSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  tenderSectors: z.array(z.nativeEnum(SectorEnum)).min(1, "At least one sector is required"),
  currency: z.enum(['OMR', 'EGP', 'SAR', 'AED']),
  pdfUrl: z.string().optional().or(z.literal('')),
  endDate: z.date({
    required_error: "End date is required",
  }),
  terms: z.string().min(1, "Terms are required"),
  scopeOfWorks: z.string().min(1, "Scope of works is required"),
  pdfChoice: z.enum(['upload', 'generate']).optional(),
  customFields: z.array(z.object({
    title: z.string(),
    description: z.string()
  })).optional(),
  companyId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
});

// Type exports
export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
export type CompanyFormValues = z.infer<typeof companySchema>;
export type TenderFormValues = z.infer<typeof TenderSchema>;