'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type UserRole = 'jobseeker' | 'employer';

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<UserRole>('jobseeker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Validation
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

    if (role === 'jobseeker' && !fullName.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    if (role === 'employer' && !companyName.trim()) {
      setError('Please enter your company name');
      setLoading(false);
      return;
    }

    try {
      // Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name: role === 'jobseeker' ? fullName : undefined,
            company_name: role === 'employer' ? companyName : undefined,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create profile or company using API route (bypasses RLS)
        const profileResponse = await fetch('/api/auth/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authData.user.id,
            role,
            fullName,
            companyName,
            email,
          }),
        });

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
          throw new Error(profileData.error || 'Failed to create profile');
        }

        setMessage('Account created successfully! Please check your email to verify your account.');

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/auth/sign-in');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'An error occurred during sign up');
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
            Already have an account? <span className="text-blue-500 font-medium">Sign in</span>
          </Link>
        </div>
      </header>

      {/* Sign Up Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 fade-in fade-in-1">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">
              Join GHL Hire
            </h1>
            <p className="text-gray-500">
              Create your account to get started
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 fade-in fade-in-2">
            <form onSubmit={handleSignUp} className="space-y-6">
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

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('jobseeker')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === 'jobseeker'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">👤</div>
                      <div className="font-medium text-gray-900">Job Seeker</div>
                      <div className="text-xs text-gray-500 mt-1">Looking for work</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      role === 'employer'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🏢</div>
                      <div className="font-medium text-gray-900">Employer</div>
                      <div className="text-xs text-gray-500 mt-1">Hiring talent</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Conditional Name/Company Field */}
              {role === 'jobseeker' ? (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-900 mb-2">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                    placeholder="Your Company Inc."
                    disabled={loading}
                  />
                </div>
              )}

              {/* Email */}
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                  Confirm Password
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
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-blue-500 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-500 hover:underline">
                  Privacy Policy
                </Link>
              </p>
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
