import { companySchema, userProfileSchema } from "@/schema";
import { LucideIcon } from "lucide-react";
import { z } from "zod";

export interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
  }
  

 export  interface TermsProps {
    children: React.ReactNode;
    linkText: string;
    linkHref: string;
  }
  export interface AuthProps {
    mode: "login" | "signup";
    isLoading: boolean;
    onAuth: () => void;
    onSignOut: () => void;
    logoUrl: string;
    user: boolean | (() => Promise<boolean>);
  }

 export  interface UserDetails {
    email: string;
    name: string;
    avatarUrl?: string; // optional property
  }
  
 export interface UpsertData {
    email: string;
    name: string;
    imageurl?: string; // optional property
  }
  export type UserProfile = z.infer<typeof userProfileSchema>;
  export type CompanyProfile = z.infer<typeof companySchema>;
  export interface UserMenuProps {
    userProfile: UserProfile | null;
    companyProfile: CompanyProfile | null;
    isMobile: boolean;
    onMenuItemClick: () => void;
    onSignOut: () => void;

  }

  export interface AuthButtonProps {
    isLoading: boolean;
    isAuthenticated: boolean;
    userProfile: any; // Replace 'any' with a more specific type if available
    companyProfile: any; // Replace 'any' with a more specific type if available
    onSignOut: () => void;
    isMobile?: boolean;
  }