import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthProvider } from "@/contexts/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import PromoBanner from "@/components/PromoBanner";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0b1f3a',
};

export const metadata: Metadata = {
  title: {
    default: "GHL Hire: the free job board for GoHighLevel work",
    template: "%s | GHL Hire"
  },
  description: "GoHighLevel jobs for automation specialists, funnel builders, Voice AI builders, VAs and developers. Free to post, free to apply.",
  keywords: ["GoHighLevel jobs", "GHL careers", "marketing automation jobs", "CRM jobs", "funnel builder jobs", "GoHighLevel careers", "SaaS jobs", "automation specialist jobs"],
  authors: [{ name: "GHL Hire" }],
  creator: "GHL Hire",
  publisher: "GHL Hire",
  metadataBase: new URL("https://ghlhire.com"),
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },
  openGraph: {
    title: "GHL Hire: the free job board for GoHighLevel work",
    description: "GoHighLevel jobs, free to post and free to apply.",
    type: "website",
    locale: "en_US",
    url: "https://ghlhire.com",
    siteName: "GHL Hire",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GHL Hire - The GoHighLevel Job Board",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GHL Hire: the free job board for GoHighLevel work",
    description: "GoHighLevel jobs, free to post and free to apply.",
    images: ["/og-image.png"],
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={hanken.variable}>
      <body className="font-sans antialiased">
        <PromoBanner />
        <AuthProvider>
          {children}
        </AuthProvider>
        <CookieConsent />
      </body>
      <GoogleAnalytics gaId="G-3CXJJSEKBQ" />
    </html>
  );
}
