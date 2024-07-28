import { LucideIcon } from "lucide-react";

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