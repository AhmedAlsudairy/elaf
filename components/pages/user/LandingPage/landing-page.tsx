'use client';

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { checkAuthAndProfiles } from "@/actions/supabase/check-auth-and-profile";

const SignUpSection = dynamic(() => import("./components/signup-section"));
const HeroSection = dynamic(() => import("./components/hero-section"));
const FeatureSection = dynamic(() => import("./components/feature-section"));
const SocialMediaSection = dynamic(() => import("./components/socialmedia-section"));

function AuthCheck() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const { isAuthenticated, userProfile } = await checkAuthAndProfiles();
        
        if (!isMounted) return;

        if (isAuthenticated && userProfile) {
          const msg = searchParams.get('msg');
          const url = new URL('/profile/myprofile', window.location.origin);
          if (msg) {
            url.searchParams.set('message', msg);
          }
          router.push(url.toString());
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsChecking(false);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) return null;
  return null;
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] font-balooBhaijaan">
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }>
        <AuthCheck />
        <main className="flex-1">
          <HeroSection />
          <FeatureSection />
          <SocialMediaSection />
          <SignUpSection />
        </main>
      </Suspense>
    </div>
  );
}