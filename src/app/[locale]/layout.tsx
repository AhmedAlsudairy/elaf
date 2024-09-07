import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, unstable_setRequestLocale} from 'next-intl/server';
import {getLangDir} from 'rtl-detect';
import { Header } from "@/components/common/user/NavBar";
import { Footer } from "@/components/common/user/footer";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryClientProvider } from "@/providers/query-providers";
import Favicon from "/public/favicon.ico"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elaf",
  description: "Tender  make life easier",
  icons: [{ rel: "icon", url: Favicon.src }],

};

 

export default async function RootLayout({
  children,
  params: {locale}

}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};

}>) {


  const messages = await getMessages();
  const direction = getLangDir(locale);



  return (
    <ReactQueryClientProvider>

    <html lang={locale} dir={direction}>
      <body className={inter.className}>

      <NextIntlClientProvider messages={messages}>
        <Header/>
        {children}
       

        <Footer/>
         <Toaster />

        </NextIntlClientProvider>
  
        </body>
    </html>
    </ReactQueryClientProvider>

  );
}
