import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";

// PP Neue Montreal Variable Font - defined once at root level
const ppNeueMontreal = localFont({
  src: "../fonts/PP Neue Montreal-Variable.ttf",
  variable: "--font-pp-neue-montreal",
  display: "swap",
  fallback: ["sans-serif"],
  weight: "100 900",
  preload: true,
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={ppNeueMontreal.variable}>
      <body>{children}</body>
    </html>
  );
}
