"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { getCurrentCompanyProfile } from '@/actions/supabase/get-current-company-profile';

interface CreateCompanyButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function CreateCompanyButton({ 
  variant = 'default', 
  size = 'default',
  className = '',
  showIcon = true,
  children
}: CreateCompanyButtonProps) {
  const router = useRouter();
  const locale = useLocale();

  const handleClick = () => {
    router.push(`/${locale}/create-company-profile`);
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleClick}
    >
      {showIcon && <Building2 className="mr-2 h-4 w-4" />}
      {children || 'Create Company Profile'}
    </Button>
  );
}

// This is the component your NavBar is importing
export function CreateOrViewCompanyButton({ 
  variant = 'default', 
  size = 'default',
  className = ''
}: CreateCompanyButtonProps) {
  const router = useRouter();
  const locale = useLocale();
  const [hasCompany, setHasCompany] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [companyId, setCompanyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function checkCompany() {
      try {
        const company = await getCurrentCompanyProfile();
        console.log('Company profile fetched:', company);
        if (company) {
          console.log('Company ID:', company.id);
          setHasCompany(true);
          setCompanyId(company.id);
        } else {
          console.log('No company profile found');
          setHasCompany(false);
          setCompanyId(null);
        }
      } catch (error) {
        console.error('Error checking company:', error);
        setHasCompany(false);
        setCompanyId(null);
      } finally {
        setLoading(false);
      }
    }
    checkCompany();
  }, []);

  const handleClick = () => {
    console.log('Button clicked - hasCompany:', hasCompany, 'companyId:', companyId, 'loading:', loading);
    
    // Prevent navigation if still loading
    if (loading) {
      console.log('Still loading, ignoring click');
      return;
    }
    
    // If we have a company but no ID, something is wrong - redirect to create
    if (hasCompany && !companyId) {
      console.warn('Company exists but no ID found, redirecting to create page');
      router.push(`/${locale}/create-company-profile`);
      return;
    }
    
    if (hasCompany && companyId && companyId !== 'undefined' && companyId.trim() !== '') {
      const url = `/${locale}/profile/companyprofiles/${companyId}`;
      console.log('Navigating to:', url);
      router.push(url);
    } else {
      console.log('No company found or invalid ID, redirecting to create page');
      router.push(`/${locale}/create-company-profile`);
    }
  };

  if (loading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
      </Button>
    );
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleClick}
      disabled={loading || (hasCompany === true && !companyId)}
    >
      {hasCompany ? (
        <>
          <Building2 className="mr-2 h-4 w-4" />
          View Profile
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Create Company
        </>
      )}
    </Button>
  );
}

// SERVER-SIDE version for navbar (better performance)
interface ServerCompanyButtonProps {
  hasCompany: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ServerCompanyButton({ 
  hasCompany,
  companyId,
  variant = 'default', 
  size = 'default',
  className = ''
}: ServerCompanyButtonProps & { companyId?: string | null }) {
  const router = useRouter();
  const locale = useLocale();

  const handleClick = () => {
    if (hasCompany && companyId) {
      router.push(`/${locale}/profile/companyprofiles/${companyId}`);
    } else {
      router.push(`/${locale}/create-company-profile`);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleClick}
    >
      {hasCompany ? (
        <>
          <Building2 className="mr-2 h-4 w-4" />
          View Profile
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Create Company
        </>
      )}
    </Button>
  );
}