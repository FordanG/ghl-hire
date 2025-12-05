import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GoHighLevel Jobs - Browse GHL Career Opportunities',
  description: 'Explore hundreds of GoHighLevel job opportunities. Find roles in marketing automation, funnel building, CRM management, and more. Filter by job type, location, and experience level.',
  keywords: ['GoHighLevel jobs', 'GHL careers', 'marketing automation jobs', 'CRM jobs', 'funnel builder jobs', 'remote GHL jobs'],
  openGraph: {
    title: 'GoHighLevel Jobs - Browse GHL Career Opportunities',
    description: 'Explore hundreds of GoHighLevel job opportunities. Find your perfect role in marketing automation and CRM.',
    type: 'website',
    url: 'https://ghlhire.com/jobs',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoHighLevel Jobs - Browse GHL Career Opportunities',
    description: 'Explore hundreds of GoHighLevel job opportunities. Find your perfect role in marketing automation and CRM.',
  },
  alternates: {
    canonical: 'https://ghlhire.com/jobs',
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
