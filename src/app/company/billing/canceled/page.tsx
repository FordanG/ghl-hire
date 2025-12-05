'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, CreditCard } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentCanceledPage() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="bg-yellow-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-yellow-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Canceled
          </h1>

          <p className="text-gray-600 mb-8">
            Your payment was canceled. No charges were made to your account.
            You can try again whenever you're ready to upgrade your subscription.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">Still thinking about it?</h3>
            <p className="text-blue-700 text-sm">
              Our paid plans include premium features like unlimited job postings,
              advanced analytics, and priority support. Start with a 14-day free trial!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/pricing"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              View Plans
            </Link>
            <Link
              href="/company/dashboard"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
