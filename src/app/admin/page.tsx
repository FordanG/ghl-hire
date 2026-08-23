import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getAdminAccess } from '@/lib/admin/auth';
import { getAdminDashboardData } from '@/lib/admin/dashboard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Platform Command',
  description: 'GHL Hire administrator management dashboard.',
  robots: { index: false, follow: false },
};

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071426] text-white">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-cyan-300/20 border-t-cyan-300" />
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-slate-400">Loading platform command</p>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const access = await getAdminAccess();

  if (access.state === 'unauthenticated') {
    redirect('/signin?redirect=/admin');
  }

  if (access.state === 'forbidden') {
    redirect('/dashboard');
  }

  const data = await getAdminDashboardData(access);

  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminDashboard data={data} />
    </Suspense>
  );
}
