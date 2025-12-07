'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setMessage('Password updated successfully! Redirecting to sign in...');

      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while updating password');
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
        </div>
      </header>

      {/* Update Password Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 fade-in fade-in-1">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
              Update password
            </h1>
            <p className="text-gray-500">
              Choose a new password for your account
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 fade-in fade-in-2">
            <form onSubmit={handleUpdatePassword} className="space-y-6">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="At least 8 characters"
                  disabled={loading}
                  minLength={8}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                  placeholder="Re-enter your password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating password...' : 'Update password'}
              </button>
            </form>
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
