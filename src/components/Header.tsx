'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Briefcase, Building } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, userType, profile, company, signOut, loading } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-2xl font-semibold tracking-tight fade-in fade-in-1 text-gray-900">
            GHL<span className="font-light text-blue-400">Hire</span>
          </Link>
          <span className="ml-4 px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-500 font-medium tracking-tight fade-in fade-in-2">
            GoHighLevel
          </span>
        </div>

        <nav className="hidden md:flex space-x-8 items-center">
          <Link
            href="/jobs"
            className="text-gray-500 px-2 py-1 transition-colors fade-in fade-in-3 hover:text-gray-900 hover:underline"
          >
            Jobs
          </Link>
          <Link
            href="/employers"
            className="text-gray-500 px-2 py-1 transition-colors fade-in fade-in-4 hover:text-gray-900 hover:underline"
          >
            Employers
          </Link>

          {!loading && !user && (
            <Link
              href="/signin"
              className="text-gray-500 px-2 py-1 transition-colors fade-in fade-in-5 hover:text-gray-900 hover:underline"
            >
              Sign In
            </Link>
          )}

          {!loading && user && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                {userType === 'jobseeker' && profile && (
                  <>
                    <User className="w-5 h-5" />
                    <span>{profile.full_name}</span>
                  </>
                )}
                {userType === 'employer' && company && (
                  <>
                    <Building className="w-5 h-5" />
                    <span>{company.company_name}</span>
                  </>
                )}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href={userType === 'jobseeker' ? '/dashboard' : '/company/dashboard'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={userType === 'jobseeker' ? '/dashboard/profile' : '/company/dashboard/profile'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={userType === 'jobseeker' ? '/dashboard/applications' : '/company/dashboard/applications'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    Applications
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {!loading && userType === 'employer' && (
          <Link
            href="/post-job"
            className="ml-6 px-4 py-2 rounded-md bg-blue-500 font-semibold tracking-tight shadow hover:bg-blue-600 transition-colors fade-in fade-in-6 text-white"
          >
            Post a Job
          </Link>
        )}

        {!loading && !user && (
          <Link
            href="/signup"
            className="ml-6 px-4 py-2 rounded-md bg-blue-500 font-semibold tracking-tight shadow hover:bg-blue-600 transition-colors fade-in fade-in-6 text-white"
          >
            Get Started
          </Link>
        )}
      </div>
    </header>
  );
}