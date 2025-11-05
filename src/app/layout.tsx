import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GHL Hire - Premier Job Board for GoHighLevel Professionals",
  description: "The dedicated career platform connecting talented professionals with exciting opportunities in the GoHighLevel ecosystem. Find your perfect GHL job or hire expert talent.",
  keywords: "GoHighLevel jobs, GHL careers, marketing automation jobs, CRM jobs, funnel builder jobs",
  openGraph: {
    title: "GHL Hire - Premier Job Board for GoHighLevel Professionals",
    description: "Connect with the best GoHighLevel opportunities and talent in the industry.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-3CXJJSEKBQ" />
    </html>
  );
}
