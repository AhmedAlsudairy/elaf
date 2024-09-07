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

  title: {
    default: "Elaf",
    template: "%s - Elaf",
  },
  description: "Elaf is a cutting-edge B2B tendering platform that revolutionizes procurement and supplier management. Our e-tendering solution streamlines the entire process from RFP creation to bid submission for both government and private sector tenders. Elaf's robust marketplace connects businesses with diverse suppliers, facilitating efficient sourcing, proposal handling, and contract bidding. Whether you're a vendor seeking new opportunities or a company looking to optimize procurement, Elaf provides the tools and visibility needed to thrive in today's competitive business landscape. Join Elaf to simplify your tendering process, expand your network, and drive growth through strategic sourcing and bidding.",
  twitter: {
    card: "summary_large_image",
  },
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
