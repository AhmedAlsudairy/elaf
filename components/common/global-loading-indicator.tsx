// components/GlobalLoadingIndicator.tsx
"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Loader2 } from "lucide-react";

export function GlobalLoadingIndicator() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    // Listen for route changes
    window.addEventListener('routeChangeStart', handleStart);
    window.addEventListener('routeChangeComplete', handleStop);
    window.addEventListener('routeChangeError', handleStop);

    return () => {
      window.removeEventListener('routeChangeStart', handleStart);
      window.removeEventListener('routeChangeComplete', handleStop);
      window.removeEventListener('routeChangeError', handleStop);
    };
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50">
      <div className="h-full w-1/3 bg-blue-700 animate-pulse"><Loader2/></div>
    </div>
  );
}