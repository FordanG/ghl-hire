import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - GHL Hire',
  description: 'Sign in to your GHL Hire account. Access your dashboard, manage applications, and connect with GoHighLevel opportunities.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sign In - GHL Hire',
    description: 'Sign in to your GHL Hire account and access GoHighLevel career opportunities.',
    type: 'website',
    url: 'https://ghlhire.com/signin',
  },
  alternates: {
    canonical: 'https://ghlhire.com/signin',
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
