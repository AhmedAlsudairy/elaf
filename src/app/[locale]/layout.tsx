import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { getLangDir } from "rtl-detect";
import { Header } from "@/components/common/user/NavBar";
import { Footer } from "@/components/common/user/footer";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryClientProvider } from "@/providers/query-providers";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Favicon from "/public/favicon.ico";
import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { ProfileCheck } from "@/components/common/user/profile-check";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Elaf",
    template: "%s - Elaf",
  },
  description: "Elaf is a cutting-edge B2B tendering platform...",
  twitter: {
    card: "summary_large_image",
  },
  icons: [{ rel: "icon", url: Favicon.src }],
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Updated type
}>) {
  const { locale } = await params; // Await params
  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const direction = getLangDir(locale);

  // Check if user has a profile (server-side)
  let hasProfile = false;
  try {
    const { userId } = await auth();
    if (userId) {
      const userProfile = await prisma.userProfile.findUnique({
        where: { clerkUserId: userId },
        select: { id: true },
      });
      hasProfile = !!userProfile;
    }
  } catch (error) {
    console.error('Error checking user profile:', error);
  }

  return (
    <ClerkProvider>
      <ReactQueryClientProvider>
        <html lang={locale} dir={direction} suppressHydrationWarning>
          <body className={inter.className} suppressHydrationWarning>
            <SpeedInsights />
            <Analytics />
            <NextIntlClientProvider messages={messages}>
              <Header />
              <ProfileCheck hasProfile={hasProfile}>
                {children}
              </ProfileCheck>
              <Footer />
              <Toaster />
            </NextIntlClientProvider>
          </body>
        </html>
      </ReactQueryClientProvider>
    </ClerkProvider>
  );
}