import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - GHL Hire Subscription Plans',
  description: 'Simple, transparent pricing for hiring GoHighLevel talent. Choose from Free, Basic (₱2,499/mo), or Premium (₱7,499/mo) plans. All plans include a 14-day free trial.',
  keywords: ['GHL Hire pricing', 'job posting pricing', 'GoHighLevel recruitment costs', 'hiring plans'],
  openGraph: {
    title: 'Pricing - GHL Hire Subscription Plans',
    description: 'Simple, transparent pricing for hiring GoHighLevel talent. Start with a 14-day free trial.',
    type: 'website',
    url: 'https://ghlhire.com/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing - GHL Hire Subscription Plans',
    description: 'Simple, transparent pricing for hiring GoHighLevel talent. Start with a 14-day free trial.',
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
