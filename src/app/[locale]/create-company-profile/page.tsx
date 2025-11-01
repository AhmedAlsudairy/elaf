"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';
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

// Variation: Button that checks if user has company first (CLIENT-SIDE)
// Note: This makes a server action call on mount
export function CreateOrViewCompanyButton({ 
  variant = 'default', 
  size = 'default',
  className = ''
}: CreateCompanyButtonProps) {
  const router = useRouter();
  const [hasCompany, setHasCompany] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function checkCompany() {
      try {
        const company = await getCurrentCompanyProfile();
        setHasCompany(!!company);
      } catch (error) {
        console.error('Error checking company:', error);
        setHasCompany(false);
      } finally {
        setLoading(false);
      }
    }
    checkCompany();
  }, []);

  const handleClick = () => {
    if (hasCompany) {
      router.push('/profile'); // or company profile page
    } else {
      router.push('/create-company-profile');
    }
  };

  if (loading) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
        Loading...
      </Button>
    );
  }

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

// SERVER-SIDE version for navbar (better performance)
import { Loader2 } from 'lucide-react';

interface ServerCompanyButtonProps {
  hasCompany: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ServerCompanyButton({ 
  hasCompany,
  variant = 'default', 
  size = 'default',
  className = ''
}: ServerCompanyButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (hasCompany) {
      router.push('/profile');
    } else {
      router.push('/create-company-profile');
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