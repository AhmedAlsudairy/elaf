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
  params: { locale: string };
}>) {
  const { locale } =  params;
  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });
  const direction = getLangDir(locale);

  return (
    <ClerkProvider>
      <ReactQueryClientProvider>
        <html lang={locale} dir={direction}>
          <body className={inter.className}>
            <SpeedInsights />
            <Analytics />
            <NextIntlClientProvider messages={messages}>
              <Header />
              {children}
              <Footer />
              <Toaster />
            </NextIntlClientProvider>
          </body>
        </html>
      </ReactQueryClientProvider>
    </ClerkProvider>
  );
}