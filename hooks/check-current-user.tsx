'use client'
import { isCurrentUserCompanyProfile } from '@/actions/supabase/is-current-company-profile';
import { useState, useEffect } from 'react';

export function useIsOwnerOfCompany(companyProfileId: string | undefined) {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function checkOwnership() {
      if (!companyProfileId) {
        setIsOwner(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await isCurrentUserCompanyProfile(companyProfileId);
        setIsOwner(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setIsOwner(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkOwnership();
  }, [companyProfileId]);

  return { isOwner, isLoading, error };
}