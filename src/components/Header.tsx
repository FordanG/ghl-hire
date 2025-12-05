'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Building, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';

export default function Header() {
  const { user, userType, profile, company, signOut, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setShowMobileMenu(false);
      }
      if (!target.closest('.user-menu') && !target.closest('.user-menu-button')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    setShowMobileMenu(false);
    window.location.href = '/';
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-xl sm:text-2xl font-semibold tracking-tight fade-in fade-in-1 text-gray-900">
            GHL<span className="font-light text-blue-400">Hire</span>
          </Link>
          <span className="hidden sm:inline-block ml-4 px-2 py-0.5 text-xs rounded bg-blue-50 text-blue-500 font-medium tracking-tight fade-in fade-in-2">
            GoHighLevel
          </span>
        </div>

        {/* Desktop Navigation */}
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
            <>
              <NotificationBell />
              <div className="relative user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="user-menu-button flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                {userType === 'jobseeker' && profile && (
                  <>
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">{profile.full_name}</span>
                  </>
                )}
                {userType === 'employer' && company && (
                  <>
                    <Building className="w-5 h-5" />
                    <span className="hidden lg:inline">{company.company_name}</span>
                  </>
                )}
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href={userType === 'jobseeker' ? '/dashboard' : '/company/dashboard'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={userType === 'jobseeker' ? '/dashboard/profile' : '/company/dashboard/profile'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={userType === 'jobseeker' ? '/dashboard/applications' : '/company/dashboard/applications'}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
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
            </>
          )}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          {!loading && userType === 'employer' && (
            <Link
              href="/post-job"
              className="px-4 py-2 rounded-md bg-blue-500 font-semibold tracking-tight shadow hover:bg-blue-600 transition-colors fade-in fade-in-6 text-white min-h-[44px] flex items-center"
            >
              Post a Job
            </Link>
          )}

          {!loading && !user && (
            <Link
              href="/signup"
              className="px-4 py-2 rounded-md bg-blue-500 font-semibold tracking-tight shadow hover:bg-blue-600 transition-colors fade-in fade-in-6 text-white min-h-[44px] flex items-center"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="mobile-menu-button md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle mobile menu"
        >
          {showMobileMenu ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu md:hidden border-t border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link
              href="/jobs"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
              onClick={() => setShowMobileMenu(false)}
            >
              Jobs
            </Link>
            <Link
              href="/employers"
              className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
              onClick={() => setShowMobileMenu(false)}
            >
              Employers
            </Link>

            {!loading && !user && (
              <>
                <Link
                  href="/signin"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-center min-h-[44px] flex items-center justify-center"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Get Started
                </Link>
              </>
            )}

            {!loading && user && (
              <>
                <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200 mt-2 pt-3">
                  {userType === 'jobseeker' && profile && (
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span>{profile.full_name}</span>
                    </div>
                  )}
                  {userType === 'employer' && company && (
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      <span>{company.company_name}</span>
                    </div>
                  )}
                </div>

                <Link
                  href={userType === 'jobseeker' ? '/dashboard' : '/company/dashboard'}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href={userType === 'jobseeker' ? '/dashboard/profile' : '/company/dashboard/profile'}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  href={userType === 'jobseeker' ? '/dashboard/applications' : '/company/dashboard/applications'}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Applications
                </Link>

                {userType === 'employer' && (
                  <Link
                    href="/post-job"
                    className="block px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-center min-h-[44px] flex items-center justify-center"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Post a Job
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 rounded-lg flex items-center gap-2 border-t border-gray-200 mt-2 pt-3 min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
