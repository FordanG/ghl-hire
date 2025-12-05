'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h1>

          <p className="text-gray-600 mb-8">
            We couldn't process your payment. This could be due to insufficient funds, an expired card, or a temporary issue with your payment provider.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Possible solutions:</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-medium text-gray-800">1.</span>
                <span>Check your card details and try again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-gray-800">2.</span>
                <span>Ensure you have sufficient funds available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-gray-800">3.</span>
                <span>Try a different payment method (GCash, Maya)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-gray-800">4.</span>
                <span>Contact your bank if the issue persists</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/pricing"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </Link>
            <Link
              href="/contact"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Link>
          </div>

          <Link
            href="/company/dashboard"
            className="inline-flex items-center gap-2 mt-6 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
