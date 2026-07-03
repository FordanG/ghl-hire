import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - GHL Hire Subscription Plans',
  description: 'Simple, transparent pricing for hiring GoHighLevel talent. Choose from Free, Basic ($29.99/mo), or Premium ($59.99/mo) plans. Start free and upgrade anytime.',
  keywords: ['GHL Hire pricing', 'job posting pricing', 'GoHighLevel recruitment costs', 'hiring plans'],
  openGraph: {
    title: 'Pricing - GHL Hire Subscription Plans',
    description: 'Simple, transparent pricing for hiring GoHighLevel talent. Start free and upgrade anytime.',
    type: 'website',
    url: 'https://ghlhire.com/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - GHL Hire Subscription Plans',
    description: 'Simple, transparent pricing for hiring GoHighLevel talent. Start free and upgrade anytime.',
  },
  alternates: {
    canonical: 'https://ghlhire.com/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
