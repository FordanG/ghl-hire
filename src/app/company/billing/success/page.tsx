'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, Loader2, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  // Whop appends a status param on return (e.g. ?status=success or ?status=error)
  const status = searchParams.get('status');
  const isError =
    status === 'error' || status === 'failed' || status === 'declined';

  useEffect(() => {
    // If Whop reported an error, send the user to the failure page.
    if (isError) {
      router.replace('/company/billing/failed');
      return;
    }

    // Otherwise give the webhook a moment to activate the subscription.
    const timer = setTimeout(() => setVerifying(false), 2000);
    return () => clearTimeout(timer);
  }, [isError, router]);

  if (isError) {
    // Redirecting to the failed page.
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-semibold mb-2">
            Processing your payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for subscribing to GHL Hire. Your payment was received and
          your account is being upgraded.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-start gap-3 text-left">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            Your new plan is activated automatically once payment is confirmed.
            This can take a few seconds. If your plan doesn&apos;t show up right
            away, refresh your billing page shortly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/company/dashboard/billing"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View Billing
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/company/dashboard"
            className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center px-4">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </PageShell>
  );
}
