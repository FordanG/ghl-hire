import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - Create Your GHL Hire Account',
  description: 'Join GHL Hire for free. Create your account as a job seeker or employer and start connecting with the GoHighLevel community.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sign Up - Create Your GHL Hire Account',
    description: 'Join GHL Hire for free and start connecting with GoHighLevel opportunities.',
    type: 'website',
    url: 'https://ghlhire.com/signup',
  },
  alternates: {
    canonical: 'https://ghlhire.com/signup',
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
