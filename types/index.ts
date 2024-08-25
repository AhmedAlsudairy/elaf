import { tenderRequestSchema } from "@/components/pages/user/tenders/requesttender/request-tender-form";
import { SectorEnum, TenderStatus } from "@/constant/text";
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

  
  
  interface CustomField {
    title: string;
    description: string;
    pdfUrl: string;
  }
  
  export interface CompanyProfileCardProps {
    profile: CompanyProfile;
    setProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
    customFields: CustomField[];
    setCustomFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
    isCurrentUser: boolean;
  }
  
  export interface ProfileHeaderProps {
    profile: {
      company_title: string;
      bio?: string;
      profile_image?: string;
    };
    isCurrentUser: boolean;
    isEditing: boolean;
    isLoading?: boolean;

    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    onSave: () => void;
  }
  export interface CustomSection {
    id?: string;
    title: string;
    description: string;
    file_url: string;
    tab_name?: string;
    company_profile_id?: string;
  }
  
  export interface CustomSectionProps {
    section: CustomSection;
    onUpdate: (updatedSection: CustomSection) => void;
    onRemove?: (id: string) => void;
    isEditing: boolean;
  }
  
  export interface SectionTab {
  id: string;
  tab_name: string;
  title: string;
}

export interface SidebarProps {
  sections: SectionTab[];
  activeTab: string;
}

export interface ProfileInfoProps {
  profile: CompanyProfile;
  setProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  customSections: CustomSection[];
  setCustomSections: React.Dispatch<React.SetStateAction<CustomSection[]>>;
  isEditing: boolean;
}

export  interface ProfileContentProps {
  profile: CompanyProfile;
  setProfile: React.Dispatch<React.SetStateAction<CompanyProfile>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
}


export interface SearchParams {
  query: string;
  sector: SectorEnum | null;
  status: TenderStatus | null;
}

export interface Tender {
  id: string;
  tender_id: string;
  company_profile_id: string;
  company_title: string;
  profile_image: string;
  tender_sectors: SectorEnum[];
  created_at: string;
  end_date: string;
  title: string;
  summary: string;
  status: TenderStatus;
  address: string;
}

export interface SearchResult {
  success: Tender[];
  error?: string;
}

export const currencyEnum = z.enum(['OMR', 'EGP', 'SAR', 'AED']);
export type currencyT=z.infer<typeof tenderRequestSchema>['currency'];