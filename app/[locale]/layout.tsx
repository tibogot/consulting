import type { Metadata } from "next";
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
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div
        className={`${ppNeueMontreal.variable} antialiased flex min-h-screen flex-col`}
      >
        <PageLoader />
        <LenisProvider>
          <ScrollToTop />
          <Navbar />
          <PageTransition>
            <main className="flex-1">{children}</main>
          </PageTransition>
          <Footer />
        </LenisProvider>
      </div>
    </NextIntlClientProvider>
  );
}

