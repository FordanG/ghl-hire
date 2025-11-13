'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (resetError) throw resetError;

      setMessage('Password reset email sent! Please check your inbox.');
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-semibold tracking-tight text-gray-900">
              GHL<span className="font-light text-blue-400">Hire</span>
            </span>
            <span className="ml-4 px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-500 font-medium tracking-tight">
              GoHighLevel
            </span>
          </Link>
          <Link
            href="/auth/sign-in"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Back to <span className="text-blue-500 font-medium">Sign in</span>
          </Link>
        </div>
      </header>

      {/* Reset Password Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 fade-in fade-in-1">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
              Reset password
            </h1>
            <p className="text-gray-500">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 fade-in fade-in-2">
            <form onSubmit={handleResetPassword} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  {message}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Remember your password?{' '}
                <Link href="/auth/sign-in" className="text-blue-500 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(24px);
          filter: blur(7px);
          animation: fadeInSlide 0.7s forwards;
        }
        .fade-in-1 {
          animation-delay: 0.18s;
        }
        .fade-in-2 {
          animation-delay: 0.36s;
        }
        @keyframes fadeInSlide {
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
}
