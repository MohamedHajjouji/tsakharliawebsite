import type { Metadata } from "next";
import { Fraunces, DM_Sans, Amiri } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Tsakhar Lia - Ultra-Fast Moroccan Delivery Service",
  description: "Tsakhar Lia delivers anything from local stores to your doorstep in 15-35 minutes. Multi-store ordering, same store prices, no markup. Currently serving Benslimane, coming soon to Meknes.",
  keywords: ["delivery", "Morocco", "Benslimane", "Meknes", "multi-store", "fast delivery", "تسخر ليا", "توصيل", "المغرب"],
  authors: [{ name: "Tsakhar Lia" }],
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: "Tsakhar Lia - Ultra-Fast Moroccan Delivery Service",
    description: "Delivering anything from local stores to your doorstep in 15-35 minutes. Multi-store ordering, same store prices.",
    type: "website",
    locale: "en_MA",
    siteName: "Tsakhar Lia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tsakhar Lia - Ultra-Fast Moroccan Delivery Service",
    description: "Delivering anything from local stores to your doorstep in 15-35 minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} ${amiri.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}