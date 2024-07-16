import React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layers, FileText, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-8 md:py-11 lg:py-14">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col items-start space-y-4 text-left">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Elevate Your Business with Elaf
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline your procurement process and connect with suppliers using our comprehensive suite of tools.
                </p>
                <Link
                  href="#"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Get Started
                </Link>
              </div>
              <div className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <img
                  src="https://img.freepik.com/free-photo/aerial-view-business-team_53876-124515.jpg?w=996&t=st=1721162778~exp=1721163378~hmac=073077d268b919250937f13940862dd23429e6f543146e91c9406359c4631a9d"
                  alt="Elaf Platform"
                  className="w-full h-auto object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Explore Elaf Key Features
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Elaf offers a comprehensive suite of tools to streamline your
                procurement process and connect with suppliers.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <Layers className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Tender Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Easily create, publish, and manage tenders on the platform.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <Users className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Supplier Profiles</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Discover and connect with qualified suppliers in your
                  industry.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Bid Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Streamline the bidding process and evaluate proposals
                  efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Elevate Your Social Media Presence
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Elaf social media platform allows you to showcase your
                company, share updates, and engage with potential customers.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <Layers className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Company Profiles</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Create a professional company profile to showcase your
                  services and expertise.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Social Sharing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Share updates, news, and content with your followers and
                  potential clients.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <Users className="h-8 w-8 mb-2 text-primary" />
                <h3 className="text-xl font-bold">Engagement Tools</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Interact with your audience through comments, likes, and
                  direct messaging.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Join the Elaf Community
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Sign up today and start leveraging the power of Elaf to grow
                your business.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="submit">Get Started</Button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By signing up, you agree to our{" "}
                <Link href="#" className="underline underline-offset-2">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Elaf. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Use
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}