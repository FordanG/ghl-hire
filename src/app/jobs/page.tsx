import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobsBoard from '@/components/JobsBoard';
import SubscribeForm from '@/components/SubscribeForm';
import GhlStartLinks from '@/components/GhlStartLinks';
import SuperClonerPanel from '@/components/SuperClonerPanel';
import { BOARD_JOB_SELECT, type BoardJob } from '@/lib/jobs';
import { FEATURED_REQUEST_PATH } from '@/lib/site';
import { createPublicClient } from '@/lib/supabase/public';

// Prebuilt and refreshed every ten minutes. Search and filters run in the
// browser, so browsing the board never invokes a server function.
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'GoHighLevel jobs: browse open GHL roles',
  description:
    'Open GoHighLevel roles for automation specialists, funnel builders, Voice AI builders, VAs and developers. Free to apply, free to post.',
  alternates: { canonical: 'https://ghlhire.com/jobs' },
};

async function getJobs(): Promise<BoardJob[]> {
  const { data, error } = await createPublicClient()
    .from('jobs')
    .select(BOARD_JOB_SELECT)
    .eq('status', 'active')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(300);

  // Throwing keeps the last good copy of the page instead of caching an empty board.
  if (error) throw new Error(`Could not load jobs: ${error.message}`);

  // Only what the list needs: long text is trimmed to keep the page light.
  return ((data ?? []) as unknown as BoardJob[]).map((job) => ({
    id: job.id,
    title: job.title,
    description: (job.description || '').slice(0, 600),
    location: job.location,
    job_type: job.job_type,
    experience_level: job.experience_level,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    salary_currency: job.salary_currency,
    salary_period: job.salary_period,
    remote: job.remote,
    is_featured: job.is_featured,
    created_at: job.created_at,
    apply_url: job.apply_url ? 'external' : null,
    external_company_name: job.external_company_name,
    company: job.company
      ? { company_name: job.company.company_name, logo_url: job.company.logo_url }
      : null,
  }));
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />

      <main>
        <section className="field-ink text-white">
          <div className="page-wrap pt-10 pb-24 md:pt-14 md:pb-28">
            <h1 className="display text-4xl font-semibold md:text-5xl">GoHighLevel jobs</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-300">
              Every open role on the board. Free to apply, and free for employers to post.
            </p>
          </div>
        </section>

        <div className="page-wrap relative z-10 -mt-16 grid gap-10 pb-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="min-w-0">
            <JobsBoard jobs={jobs} />
          </div>

          <aside className="space-y-6 lg:pt-24">
            <div className="rounded-xl border border-rule bg-white p-6">
              <h2 className="text-lg font-semibold tracking-tight">Get new roles by email</h2>
              <p className="mt-1 mb-4 text-[15px] text-ink-soft">The week&apos;s new GHL jobs in one short email.</p>
              <SubscribeForm source="jobs-sidebar" buttonLabel="Subscribe" stacked />
            </div>

            <div className="rounded-xl border border-rule bg-white p-6">
              <h2 className="text-lg font-semibold tracking-tight">Hiring for GoHighLevel work?</h2>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                Posting is free. Featured listings sit at the top of this page.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/post-job" className="press inline-flex h-11 items-center justify-center rounded-md bg-brand px-4 font-semibold text-white hover:bg-brand-dark">
                  Post a job free
                </Link>
                <Link href={FEATURED_REQUEST_PATH} className="press inline-flex h-11 items-center justify-center rounded-md border border-rule px-4 font-semibold text-ink hover:bg-surface">
                  Request a featured listing
                </Link>
              </div>
            </div>

            <SuperClonerPanel variant="card" title="Hired to rebuild funnels? Clone them in one click." />

            <GhlStartLinks variant="card" />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
