import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";
import LenisProvider from "../components/LenisProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import PageLoader from "../components/PageLoader";
import PageTransition from "../components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Switzer Variable Font - Variable fonts use a single file for all weights
// Using root-level fonts folder for better Next.js path resolution
const switzer = localFont({
  src: "../../fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  display: "swap", // Best practice: ensures text remains visible during font load
  fallback: ["sans-serif"], // Fallback font family
  weight: "100 900", // Variable fonts support weight range (adjust if your font supports different range)
  preload: true, // Preloads the font for better performance
});

// PP Neue Montreal Variable Font
const ppNeueMontreal = localFont({
  src: "../../fonts/PP Neue Montreal-Variable.ttf",
  variable: "--font-pp-neue-montreal",
  display: "swap",
  fallback: ["sans-serif"],
  weight: "100 900",
  preload: true,
});

export const metadata: Metadata = {
  title: "Sparagus",
  description: "Des solutions d'expertes au service de votre succès",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${switzer.variable} ${ppNeueMontreal.variable} antialiased flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <PageLoader />
          <LenisProvider>
            <ScrollToTop />
            <Navbar />
            <PageTransition>
              <main className="flex-1">{children}</main>
            </PageTransition>
            <Footer />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

