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

  const navLink =
    'rounded-md px-3 py-2 text-[15px] font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand';
  const mobileLink =
    'flex min-h-[48px] items-center rounded-md px-3 text-base font-medium text-ink hover:bg-surface';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rule bg-white/95 backdrop-blur">
      <div className="page-wrap flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight text-ink">
            <Image src="/logo-mark.png" alt="" width={32} height={32} priority className="h-8 w-8" />
            <span>
              GHL<span className="font-normal text-brand">Hire</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            <Link href="/jobs" className={navLink}>Jobs</Link>
            <Link href="/blog" className={navLink}>AI guides</Link>
            <Link href="/employers" className={navLink}>For employers</Link>
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {authView.state === 'signed-out' && (
            <Link href="/signin" className={navLink}>Sign in</Link>
          )}

          {authView.state === 'signed-in' && (
            <>
              <NotificationBell />
              <div className="relative user-menu">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="user-menu-button flex items-center gap-2 rounded-md px-3 py-2 text-[15px] font-medium text-ink transition-colors hover:bg-surface"
                  aria-expanded={showUserMenu}
                >
                  {authView.isEmployer ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  <span className="max-w-36 truncate">{authView.accountLabel}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-rule bg-white py-2 shadow-lg">
                    <Link href={authView.dashboardHref} className="block px-4 py-2 text-ink hover:bg-surface" onClick={() => setShowUserMenu(false)}>
                      Dashboard
                    </Link>
                    <Link href={authView.profileHref} className="block px-4 py-2 text-ink hover:bg-surface" onClick={() => setShowUserMenu(false)}>
                      Profile
                    </Link>
                    <Link href={authView.applicationsHref} className="block px-4 py-2 text-ink hover:bg-surface" onClick={() => setShowUserMenu(false)}>
                      Applications
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 font-medium text-brand hover:bg-brand-soft" onClick={() => setShowUserMenu(false)}>
                        <ShieldCheck className="h-4 w-4" />
                        Admin console
                      </Link>
                    )}
                    <hr className="my-2 border-rule" />
                    <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-surface">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {authView.state === 'signed-in' && !authView.isEmployer ? (
            <Link href={authView.dashboardHref} className="press inline-flex h-11 items-center rounded-md bg-ink px-4 text-[15px] font-semibold text-white transition-colors hover:bg-ink-2">
              Dashboard
            </Link>
          ) : (
            <Link href="/post-job" className="press inline-flex h-11 items-center rounded-md bg-brand px-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark">
              Post a job free
            </Link>
          )}
        </div>

        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="mobile-menu-button flex h-11 w-11 items-center justify-center rounded-md hover:bg-surface md:hidden"
          aria-label="Toggle menu"
          aria-expanded={showMobileMenu}
        >
          {showMobileMenu ? <X className="h-6 w-6 text-ink" /> : <Menu className="h-6 w-6 text-ink" />}
        </button>
      </div>

      {showMobileMenu && (
        <div className="mobile-menu border-t border-rule bg-white md:hidden">
          <nav className="page-wrap space-y-1 py-4" aria-label="Mobile">
            <Link href="/jobs" className={mobileLink} onClick={() => setShowMobileMenu(false)}>Jobs</Link>
            <Link href="/blog" className={mobileLink} onClick={() => setShowMobileMenu(false)}>AI guides</Link>
            <Link href="/employers" className={mobileLink} onClick={() => setShowMobileMenu(false)}>For employers</Link>

            {authView.state === 'signed-out' && (
              <Link href="/signin" className={mobileLink} onClick={() => setShowMobileMenu(false)}>Sign in</Link>
            )}

            {authView.state === 'signed-in' && (
              <>
                <div className="mt-2 flex items-center gap-2 border-t border-rule px-3 pt-4 pb-1 text-sm text-mute">
                  {authView.isEmployer ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  <span className="truncate">{authView.accountLabel}</span>
                </div>
                <Link href={authView.dashboardHref} className={mobileLink} onClick={() => setShowMobileMenu(false)}>Dashboard</Link>
                <Link href={authView.profileHref} className={mobileLink} onClick={() => setShowMobileMenu(false)}>Profile</Link>
                <Link href={authView.applicationsHref} className={mobileLink} onClick={() => setShowMobileMenu(false)}>Applications</Link>
                {isAdmin && (
                  <Link href="/admin" className={`${mobileLink} gap-2 text-brand`} onClick={() => setShowMobileMenu(false)}>
                    <ShieldCheck className="h-5 w-5" />
                    Admin console
                  </Link>
                )}
                <button onClick={handleSignOut} className="flex min-h-[48px] w-full items-center gap-2 rounded-md px-3 text-left text-base font-medium text-red-600 hover:bg-surface">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            )}

            <Link
              href="/post-job"
              className="mt-3 flex min-h-[48px] items-center justify-center rounded-md bg-brand px-4 text-base font-semibold text-white"
              onClick={() => setShowMobileMenu(false)}
            >
              Post a job free
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
