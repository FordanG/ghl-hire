'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { FEATURED_EMAIL, featuredMailto } from '@/lib/site';
import { generateJobSlug } from '@/lib/utils';

interface ListingRow {
  id: string;
  title: string;
  is_featured: boolean | null;
}

export default function FeaturedListingsPage() {
  const { company, loading: authLoading } = useAuth();
  const [jobs, setJobs] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!company) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    supabase
      .from('jobs')
      .select('id, title, is_featured')
      .eq('company_id', company.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Error loading listings:', error);
          setFailed(true);
        }
        setJobs((data ?? []) as ListingRow[]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, company]);

  return (
    <CompanyDashboardLayout>
      <div className="max-w-3xl p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Featured listings</h1>
        <p className="mt-1 text-gray-600">
          Posting on GHL Hire is free, with no plan and nothing to bill. The one paid option is a featured listing, pinned to the top of the board.
        </p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">How to feature a job</h2>
          <p className="mt-1 text-gray-600">
            Email {FEATURED_EMAIL} with the role and your dates. We reply with the rate, and switch it on once it is agreed.
          </p>
          <a
            href={featuredMailto()}
            className="mt-4 inline-flex h-11 items-center rounded-md bg-blue-600 px-5 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Email {FEATURED_EMAIL}
          </a>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white">
          <h2 className="border-b border-gray-200 px-6 py-4 text-lg font-semibold text-gray-900">Your active listings</h2>

          {loading ? (
            <p className="px-6 py-8 text-gray-500">Loading your listings...</p>
          ) : failed ? (
            <p className="px-6 py-8 text-red-600">Your listings did not load. Refresh the page to try again.</p>
          ) : jobs.length === 0 ? (
            <div className="px-6 py-8">
              <p className="text-gray-600">You have no active listings yet.</p>
              <Link href="/post-job" className="mt-3 inline-flex h-11 items-center rounded-md bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700">
                Post a job free
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <li key={job.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <Link href={`/jobs/${generateJobSlug(job.title, job.id)}`} className="font-medium text-gray-900 hover:text-blue-600">
                    {job.title}
                  </Link>
                  {job.is_featured ? (
                    <span className="rounded-sm bg-amber-400 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-gray-900">Featured</span>
                  ) : (
                    <a href={featuredMailto(job.title)} className="inline-flex h-11 items-center font-semibold text-blue-600 hover:underline">
                      Ask to feature this
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
