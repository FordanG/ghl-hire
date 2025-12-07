'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentSuccessPage() {
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Give webhooks time to process
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col text-gray-900 bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-semibold mb-2">Processing your payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your subscription.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for subscribing to GHL Hire. Your account has been upgraded and you now have access to all the features included in your plan.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">What's next?</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Post job listings to find GHL talent</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Review applications from qualified candidates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Access your billing dashboard anytime</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/post-job"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Post a Job
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

      <Footer />
    </div>
  );
}
