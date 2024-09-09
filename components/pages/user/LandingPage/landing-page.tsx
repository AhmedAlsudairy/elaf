'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import SignUpSection from "./components/signup-section";
import HeroSection from "./components/hero-section";
import FeatureSection from "./components/feature-section";
import SocialMediaSection from "./components/socialmedia-section";
import { checkAuthAndProfiles } from "@/actions/supabase/check-auth-and-profile";
import { Loader2 } from 'lucide-react';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated, userProfile } = await checkAuthAndProfiles();
      
      // Get the message from URL parameters
      const msg = searchParams.get('msg') || '';
      
      if (isAuthenticated && userProfile) {
        // Redirect to profile page with the message as a query parameter
        const redirectUrl = `/profile/myprofile${msg ? `?message=${encodeURIComponent(msg)}` : ''}`;
        router.push(redirectUrl);
      } else {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [router, searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] font-balooBhaijaan">
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <SocialMediaSection />
        <SignUpSection />
      </main>
    </div>
  );
}