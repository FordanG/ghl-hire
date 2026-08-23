'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Building, Menu, ShieldCheck, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';
import { getHeaderAuthView } from './header-auth';

export default function Header() {
  const { user, userType, profile, company, adminRole, signOut, loading } = useAuth();
  const isAdmin = adminRole === 'admin';
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const authView = getHeaderAuthView({
    loading,
    userEmail: user?.email,
    userType,
    profileName: profile?.full_name,
    companyName: company?.company_name,
  });

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
          <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-semibold tracking-tight fade-in fade-in-1 text-[#0B1F3A]">
            <Image src="/logo-mark.png" alt="GHL Hire logo" width={32} height={32} priority className="h-8 w-8" />
            <span>GHL<span className="font-light text-blue-600">Hire</span></span>
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

          {authView.state === 'signed-out' && (
            <Link
              href="/signin"
              className="text-gray-500 px-2 py-1 transition-colors fade-in fade-in-5 hover:text-gray-900 hover:underline"
            >
              Sign In
            </Link>
          )}

          {authView.state === 'signed-in' && (
            <>
              <NotificationBell />
              <div className="relative user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="user-menu-button flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                {authView.isEmployer ? (
                  <Building className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="max-w-36 truncate">{authView.accountLabel}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href={authView.dashboardHref}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={authView.profileHref}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href={authView.applicationsHref}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Applications
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 font-medium text-blue-700 hover:bg-blue-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Console
                    </Link>
                  )}
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
          {authView.state === 'signed-in' && authView.isEmployer && (
            <Link
              href="/post-job"
              className="px-4 py-2 rounded-md bg-blue-500 font-semibold tracking-tight shadow hover:bg-blue-600 transition-colors fade-in fade-in-6 text-white min-h-[44px] flex items-center"
            >
              Post a Job
            </Link>
          )}

          {authView.state === 'signed-in' && isAdmin && (
            <Link
              href="/admin"
              className="flex min-h-[44px] items-center rounded-md bg-[#0B1F3A] px-4 py-2 font-semibold tracking-tight text-white shadow transition-colors hover:bg-slate-800"
            >
              Admin Console
            </Link>
          )}

          {authView.state === 'signed-in' && !authView.isEmployer && !isAdmin && (
            <Link
              href={authView.dashboardHref}
              className="px-4 py-2 rounded-md bg-blue-600 font-semibold tracking-tight shadow hover:bg-blue-700 transition-colors fade-in fade-in-6 text-white min-h-[44px] flex items-center"
            >
              Dashboard
            </Link>
          )}

          {authView.state === 'signed-out' && (
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

            {authView.state === 'signed-out' && (
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

            {authView.state === 'signed-in' && (
              <>
                <div className="px-4 py-2 text-sm text-gray-500 border-t border-gray-200 mt-2 pt-3">
                  <div className="flex items-center gap-2">
                    {authView.isEmployer ? (
                      <Building className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <span className="truncate">{authView.accountLabel}</span>
                  </div>
                </div>

                <Link
                  href={authView.dashboardHref}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href={authView.profileHref}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  href={authView.applicationsHref}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors min-h-[44px]"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Applications
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-3 font-medium text-blue-700 transition-colors hover:bg-blue-50"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <ShieldCheck className="h-5 w-5" />
                    Admin Console
                  </Link>
                )}

                {authView.isEmployer && (
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
