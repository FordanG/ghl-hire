import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobRow from '@/components/JobRow';
import SubscribeForm from '@/components/SubscribeForm';
import SuperClonerPanel from '@/components/SuperClonerPanel';
import {
  BOARD_JOB_SELECT,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  safeSearchTerm,
  type BoardJob,
} from '@/lib/jobs';
import { featuredMailto } from '@/lib/site';
import { createPublicClient } from '@/lib/supabase/public';

const JOBS_PER_PAGE = 20;

type SearchParams = Record<string, string | string[] | undefined>;

interface JobsPageProps {
  searchParams: Promise<SearchParams>;
}

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
}

function readFilters(params: SearchParams) {
  // ?search= and ?category= are older link formats that still arrive from outside.
  const q = first(params.q) || first(params.search) || first(params.category).replaceAll('-', ' ');
  const type = JOB_TYPES.find((value) => value === first(params.type)) ?? '';
  const level = EXPERIENCE_LEVELS.find((value) => value === first(params.level)) ?? '';
  const remote = first(params.remote) === '1';
  const sort = first(params.sort) === 'pay' ? 'pay' : 'newest';
  const page = Math.max(1, Math.min(500, parseInt(first(params.page), 10) || 1));
  return { q, type, level, remote, sort, page };
}

type Filters = ReturnType<typeof readFilters>;

function buildHref(filters: Filters, overrides: Partial<Filters> = {}): string {
  const next = { ...filters, ...overrides };
  const query = new URLSearchParams();
  if (next.q) query.set('q', next.q);
  if (next.type) query.set('type', next.type);
  if (next.level) query.set('level', next.level);
  if (next.remote) query.set('remote', '1');
  if (next.sort !== 'newest') query.set('sort', next.sort);
  if (next.page > 1) query.set('page', String(next.page));
  const text = query.toString();
  return text ? `/jobs?${text}` : '/jobs';
}

export async function generateMetadata({ searchParams }: JobsPageProps): Promise<Metadata> {
  const filters = readFilters(await searchParams);
  const filtered = Boolean(filters.q || filters.type || filters.level || filters.remote || filters.page > 1);
  return {
    title: filters.q ? `${filters.q} jobs in GoHighLevel` : 'GoHighLevel jobs: browse open GHL roles',
    description:
      'Open GoHighLevel roles for automation specialists, funnel builders, Voice AI builders, VAs and developers. Free to apply, free to post.',
    alternates: { canonical: 'https://ghlhire.com/jobs' },
    // Filtered views are for people, not the index.
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

async function getJobs(filters: Filters): Promise<{ jobs: BoardJob[]; total: number; failed: boolean }> {
  try {
    const supabase = createPublicClient();
    let query = supabase
      .from('jobs')
      .select(BOARD_JOB_SELECT, { count: 'exact' })
      .eq('status', 'active');

    if (filters.type) query = query.eq('job_type', filters.type);
    if (filters.level) query = query.eq('experience_level', filters.level);
    if (filters.remote) query = query.eq('remote', true);

    // Every word must appear somewhere in the listing, in any order.
    const words = safeSearchTerm(filters.q).split(' ').filter(Boolean).slice(0, 5);
    for (const word of words) {
      query = query.or(
        `title.ilike.%${word}%,description.ilike.%${word}%,requirements.ilike.%${word}%,location.ilike.%${word}%,external_company_name.ilike.%${word}%`
      );
    }

    query = query.order('is_featured', { ascending: false });
    query =
      filters.sort === 'pay'
        ? query.order('salary_max', { ascending: false, nullsFirst: false })
        : query.order('created_at', { ascending: false });

    const from = (filters.page - 1) * JOBS_PER_PAGE;
    const { data, count, error } = await query.range(from, from + JOBS_PER_PAGE - 1);
    if (error) throw error;

    return { jobs: (data ?? []) as unknown as BoardJob[], total: count ?? 0, failed: false };
  } catch (error) {
    console.error('Error loading jobs:', error);
    return { jobs: [], total: 0, failed: true };
  }
}

const fieldClass =
  'h-12 w-full rounded-md border border-rule bg-white px-3 text-base text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30';

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const filters = readFilters(await searchParams);
  const { jobs, total, failed } = await getJobs(filters);
  const hasFilters = Boolean(filters.q || filters.type || filters.level || filters.remote);
  const totalPages = Math.max(1, Math.ceil(total / JOBS_PER_PAGE));
  const start = total === 0 ? 0 : (filters.page - 1) * JOBS_PER_PAGE + 1;
  const end = Math.min(filters.page * JOBS_PER_PAGE, total);

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />

      <main>
        <section className="field-ink text-white">
          <div className="page-wrap py-10 md:py-14">
            <h1 className="display text-4xl font-semibold md:text-5xl">GoHighLevel jobs</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-300">
              Every open role on the board. Free to apply, and free for employers to post.
            </p>

            <form action="/jobs" method="get" role="search" className="mt-7 rounded-xl bg-white p-3 text-ink sm:p-4">
              <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
                <div>
                  <label htmlFor="q" className="sr-only">Search</label>
                  <input id="q" name="q" type="search" defaultValue={filters.q} placeholder="Role, skill or company" className={fieldClass} />
                </div>
                <div>
                  <label htmlFor="type" className="sr-only">Job type</label>
                  <select id="type" name="type" defaultValue={filters.type} className={fieldClass}>
                    <option value="">Any job type</option>
                    {JOB_TYPES.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="level" className="sr-only">Experience level</label>
                  <select id="level" name="level" defaultValue={filters.level} className={fieldClass}>
                    <option value="">Any level</option>
                    {EXPERIENCE_LEVELS.map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="press h-12 rounded-md bg-brand px-6 text-base font-semibold text-white transition-colors hover:bg-brand-dark">
                  Search
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-1">
                <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-[15px] text-ink-soft">
                  <input type="checkbox" name="remote" value="1" defaultChecked={filters.remote} className="h-4 w-4 accent-[#2563eb]" />
                  Remote only
                </label>
                {hasFilters && (
                  <Link href="/jobs" className="inline-flex min-h-[44px] items-center text-[15px] font-medium text-brand hover:underline">
                    Clear filters
                  </Link>
                )}
              </div>
            </form>
          </div>
        </section>

        <div className="page-wrap grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 lg:py-12">
          <section aria-labelledby="results-heading">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="results-heading" className="text-[15px] text-ink-soft">
                {total === 0 ? (
                  'No roles found'
                ) : (
                  <>
                    Showing <span className="font-semibold text-ink">{start} to {end}</span> of{' '}
                    <span className="font-semibold text-ink">{total}</span> {total === 1 ? 'role' : 'roles'}
                    {filters.q && <> for &ldquo;{filters.q}&rdquo;</>}
                  </>
                )}
              </h2>
              <p className="flex items-center gap-1 text-[15px] text-mute">
                Sort:
                <Link
                  href={buildHref(filters, { sort: 'newest', page: 1 })}
                  aria-current={filters.sort === 'newest' ? 'true' : undefined}
                  className={`inline-flex min-h-[44px] min-w-0 items-center rounded-md px-2 ${filters.sort === 'newest' ? 'font-semibold text-ink' : 'text-brand hover:underline'}`}
                >
                  Newest
                </Link>
                <Link
                  href={buildHref(filters, { sort: 'pay', page: 1 })}
                  aria-current={filters.sort === 'pay' ? 'true' : undefined}
                  className={`inline-flex min-h-[44px] min-w-0 items-center rounded-md px-2 ${filters.sort === 'pay' ? 'font-semibold text-ink' : 'text-brand hover:underline'}`}
                >
                  Highest pay
                </Link>
              </p>
            </div>

            {jobs.length > 0 ? (
              <ul className="divide-y divide-rule overflow-hidden rounded-xl border border-rule">
                {jobs.map((job) => (
                  <JobRow key={job.id} job={job} />
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-rule bg-surface px-6 py-14 text-center">
                <p className="text-xl font-semibold">
                  {failed ? 'The board did not load' : hasFilters ? 'Nothing matches those filters' : 'No open roles right now'}
                </p>
                <p className="mx-auto mt-2 max-w-md text-ink-soft">
                  {failed
                    ? 'Something went wrong on our side. Refresh the page to try again.'
                    : hasFilters
                      ? 'Try a broader search, or clear the filters to see every open role.'
                      : 'New roles are added every week. Leave your email and we will send them to you.'}
                </p>
                {hasFilters && !failed && (
                  <Link href="/jobs" className="press mt-5 inline-flex h-12 items-center rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-dark">
                    See all jobs
                  </Link>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-between gap-4" aria-label="Pagination">
                {filters.page > 1 ? (
                  <Link href={buildHref(filters, { page: filters.page - 1 })} rel="prev" className="press inline-flex h-11 items-center rounded-md border border-rule px-4 font-semibold text-ink hover:bg-surface">
                    Previous
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-[15px] text-mute">Page {filters.page} of {totalPages}</span>
                {filters.page < totalPages ? (
                  <Link href={buildHref(filters, { page: filters.page + 1 })} rel="next" className="press inline-flex h-11 items-center rounded-md border border-rule px-4 font-semibold text-ink hover:bg-surface">
                    Next
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border border-rule p-6">
              <h2 className="text-lg font-semibold tracking-tight">Get new roles by email</h2>
              <p className="mt-1 mb-4 text-[15px] text-ink-soft">The week&apos;s new GHL jobs in one short email.</p>
              <SubscribeForm source="jobs-sidebar" buttonLabel="Subscribe" stacked />
            </div>

            <div className="rounded-xl border border-rule p-6">
              <h2 className="text-lg font-semibold tracking-tight">Hiring for GoHighLevel work?</h2>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                Posting is free. Featured listings sit at the top of this page and are arranged by email.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/post-job" className="press inline-flex h-11 items-center justify-center rounded-md bg-brand px-4 font-semibold text-white hover:bg-brand-dark">
                  Post a job free
                </Link>
                <a href={featuredMailto()} className="press inline-flex h-11 items-center justify-center rounded-md border border-rule px-4 font-semibold text-ink hover:bg-surface">
                  Ask about featuring
                </a>
              </div>
            </div>

            <SuperClonerPanel variant="card" />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
