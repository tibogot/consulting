import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LenisProvider from "../components/LenisProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import PageLoader from "../components/PageLoader";
import PageTransition from "../components/PageTransition";

export const metadata: Metadata = {
  title: {
    default: "Sparagus | IT Consulting & Talent Solutions Across Europe",
    template: "%s | Sparagus",
  },
  description:
    "Expert IT consulting and talent acquisition across 11 countries. We help organizations fill mission-critical roles, execute complex initiatives, and scale operations with 100+ active consultants.",
  keywords: [
    "IT consulting",
    "talent acquisition",
    "recruitment",
    "digital transformation",
    "consulting partner",
    "Europe",
    "Belgium",
    "technology consulting",
  ],
  authors: [{ name: "Sparagus" }],
  creator: "Sparagus",
  publisher: "Sparagus",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sparagus",
    title: "Sparagus | IT Consulting & Talent Solutions Across Europe",
    description:
      "Expert IT consulting and talent acquisition across 11 countries. We help organizations fill mission-critical roles and execute complex digital initiatives.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparagus | IT Consulting & Talent Solutions",
    description:
      "Expert IT consulting and talent acquisition across 11 countries. Helping organizations scale with the right talent.",
  },
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
      <div className="flex min-h-screen flex-col antialiased">
        <PageLoader />
        <LenisProvider>
          <ScrollToTop />
          <Navbar />
          {/* <PageTransition> */}
          <main className="flex-1">{children}</main>
          {/* </PageTransition> */}
          <Footer />
        </LenisProvider>
      </div>
    </NextIntlClientProvider>
  );
}
