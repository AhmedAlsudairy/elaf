'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import SignUpSection from "./components/signup-section";
import HeroSection from "./components/hero-section";
import FeatureSection from "./components/feature-section";
import SocialMediaSection from "./components/socialmedia-section";
import { checkAuthAndProfiles } from "@/actions/supabase/check-auth-and-profile";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function LandingPage({ searchParams }: { searchParams: { msg: string | undefined } }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const msg = searchParams.msg;
  const { toast } = useToast();

  const palestineFlag = "\ud83c\uddf5\ud83c\uddf8";

  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated, userProfile } = await checkAuthAndProfiles();
      
      if (isAuthenticated && userProfile) {
        // Redirect to profile page with the message as a query parameter
        const redirectUrl = `/profile/myprofile${msg ? `?message=${encodeURIComponent(msg)}` : ''}`;
        router.push(redirectUrl);
      } else {
        setIsLoading(false);
        
        // Show toast notification
        toast({
          title: "تذكير",
          description: `لا تنسو اخوانكم في غزة بدعاء ${palestineFlag}`,
        });
        
        // Log the message
        console.log(`لا تنسو اخوانكم في غزة بدعاء ${palestineFlag}`);
      }
    };
    checkAuth();
  }, [router, msg, toast]);

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