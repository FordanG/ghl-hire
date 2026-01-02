import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthProvider } from "@/contexts/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import PromoBanner from "@/components/PromoBanner";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "GHL Hire - Premier Job Board for GoHighLevel Professionals",
    template: "%s | GHL Hire"
  },
  description: "The dedicated career platform connecting talented professionals with exciting opportunities in the GoHighLevel ecosystem. Find your perfect GHL job or hire expert talent.",
  keywords: ["GoHighLevel jobs", "GHL careers", "marketing automation jobs", "CRM jobs", "funnel builder jobs", "GoHighLevel careers", "SaaS jobs", "automation specialist jobs"],
  authors: [{ name: "GHL Hire" }],
  creator: "GHL Hire",
  publisher: "GHL Hire",
  metadataBase: new URL("https://ghlhire.com"),
  openGraph: {
    title: "GHL Hire - Premier Job Board for GoHighLevel Professionals",
    description: "Connect with the best GoHighLevel opportunities and talent in the industry.",
    type: "website",
    locale: "en_US",
    url: "https://ghlhire.com",
    siteName: "GHL Hire",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GHL Hire - GoHighLevel Job Board",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GHL Hire - Premier Job Board for GoHighLevel Professionals",
    description: "Connect with the best GoHighLevel opportunities and talent in the industry.",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
