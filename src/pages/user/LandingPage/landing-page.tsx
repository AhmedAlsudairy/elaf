import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FeatureSection } from "./components/feature-section";
import { SocialMediaSection } from "./components/socialmedia-section";
import { HeroSection } from "./components/hero-section";
import SignUpSection from "./components/signup-section";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] font-balooBhaijaan">
      <main className="flex-1">
       <HeroSection/>
        <FeatureSection/>

       <SocialMediaSection/>

      <SignUpSection/>
      </main>

      
    </div>
  );
}
