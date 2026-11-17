'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import JobRow from './JobRow';
import { EXPERIENCE_LEVELS, JOB_TYPES, companyName, searchTokens, type BoardJob } from '@/lib/jobs';

const JOBS_PER_PAGE = 20;

interface Filters {
  q: string;
  type: string;
  level: string;
  remote: boolean;
  sort: 'newest' | 'pay';
  page: number;
}

const EMPTY: Filters = { q: '', type: '', level: '', remote: false, sort: 'newest', page: 1 };

function readFilters(params: URLSearchParams | null): Filters {
  if (!params) return EMPTY;
  // ?search= and ?category= are older link formats that still arrive from outside.
  const q = (params.get('q') || params.get('search') || (params.get('category') || '').replaceAll('-', ' ')).trim().slice(0, 80);
  const type = JOB_TYPES.find((value) => value === params.get('type')) ?? '';
  const level = EXPERIENCE_LEVELS.find((value) => value === params.get('level')) ?? '';
  return {
    q,
    type,
    level,
    remote: params.get('remote') === '1',
    sort: params.get('sort') === 'pay' ? 'pay' : 'newest',
    page: Math.max(1, parseInt(params.get('page') || '1', 10) || 1),
  };
}

function toQuery(filters: Filters): string {
  const query = new URLSearchParams();
  if (filters.q) query.set('q', filters.q);
  if (filters.type) query.set('type', filters.type);
  if (filters.level) query.set('level', filters.level);
  if (filters.remote) query.set('remote', '1');
  if (filters.sort !== 'newest') query.set('sort', filters.sort);
  if (filters.page > 1) query.set('page', String(filters.page));
  const text = query.toString();
  return text ? `/jobs?${text}` : '/jobs';
}

function matches(job: BoardJob, filters: Filters): boolean {
  if (filters.type && job.job_type !== filters.type) return false;
  if (filters.level && job.experience_level !== filters.level) return false;
  if (filters.remote && !job.remote) return false;
  if (!filters.q) return true;
  const haystack =
    job.search_text ?? searchTokens(`${job.title} ${companyName(job)} ${job.location} ${job.description}`).join(' ');
  // Every word must appear somewhere in the listing, in any order. The query
  // is split the same way as the index, so punctuation cannot hide a match.
  return searchTokens(filters.q).every((word) => haystack.includes(word));
}

const fieldClass =
  'h-12 w-full rounded-md border border-rule bg-white px-3 text-base text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30';

function Board({ jobs, initial }: { jobs: BoardJob[]; initial: Filters }) {
  const [filters, setFilters] = useState<Filters>(initial);

  // A link to /jobs?... clicked while already on this page changes the URL
  // without remounting the board, so follow the URL when it stops matching.
  // Our own edits write the URL first, so they compare equal and are skipped.
  const initialQuery = toQuery(initial);
  useEffect(() => {
    setFilters((current) => (toQuery(current) === initialQuery ? current : initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // Filtering happens in the browser on the prebuilt list, so searching costs
  // no server calls. The address bar is kept in step so results can be shared.
  const update = (patch: Partial<Filters>) => {
    const next = { ...filters, page: 1, ...patch };
    setFilters(next);
    window.history.replaceState(null, '', toQuery(next));
  };

  const results = useMemo(() => {
    const list = jobs.filter((job) => matches(job, filters));
    if (filters.sort === 'pay') {
      const pay = (job: BoardJob) => job.salary_max ?? job.salary_min ?? -1;
      list.sort((a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured)) || pay(b) - pay(a));
    }
    return list;
  }, [jobs, filters]);

  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / JOBS_PER_PAGE));
  const page = Math.min(filters.page, totalPages);
  const start = total === 0 ? 0 : (page - 1) * JOBS_PER_PAGE + 1;
  const end = Math.min(page * JOBS_PER_PAGE, total);
  const visible = results.slice(start === 0 ? 0 : start - 1, end);
  const hasFilters = Boolean(filters.q || filters.type || filters.level || filters.remote);

  const goToPage = (next: number) => {
    update({ page: next });
    document.getElementById('results-heading')?.scrollIntoView({ block: 'start' });
  };

  const sortButton = (value: Filters['sort'], label: string) => (
    <button
      type="button"
      onClick={() => update({ sort: value })}
      aria-pressed={filters.sort === value}
      className={`inline-flex min-h-[44px] min-w-0 items-center rounded-md px-2 ${filters.sort === value ? 'font-semibold text-ink' : 'text-brand hover:underline'}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="rounded-xl bg-white p-3 text-ink shadow-[0_24px_60px_-28px_rgba(11,31,58,0.45)] ring-1 ring-rule sm:p-4"
      >
        <div className="grid grid-cols-2 gap-3 md:grid-cols-[2fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="q" className="sr-only">Search</label>
            <input
              id="q"
              type="search"
              value={filters.q}
              onChange={(event) => update({ q: event.target.value })}
              placeholder="Role, skill or company"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="type" className="sr-only">Job type</label>
            <select id="type" value={filters.type} onChange={(event) => update({ type: event.target.value })} className={fieldClass}>
              <option value="">Any job type</option>
              {JOB_TYPES.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="level" className="sr-only">Experience level</label>
            <select id="level" value={filters.level} onChange={(event) => update({ level: event.target.value })} className={fieldClass}>
              <option value="">Any level</option>
              {EXPERIENCE_LEVELS.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 px-1">
          <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-[15px] text-ink-soft">
            <input type="checkbox" checked={filters.remote} onChange={(event) => update({ remote: event.target.checked })} className="h-4 w-4 accent-[#2563eb]" />
            Remote only
          </label>
          {hasFilters && (
            <button type="button" onClick={() => update({ ...EMPTY, sort: filters.sort })} className="inline-flex min-h-[44px] items-center text-[15px] font-medium text-brand hover:underline">
              Clear filters
            </button>
          )}
        </div>
      </form>

      <section aria-labelledby="results-heading" className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="results-heading" className="scroll-mt-24 text-[15px] text-ink-soft" aria-live="polite">
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
            {sortButton('newest', 'Newest')}
            {sortButton('pay', 'Highest pay')}
          </p>
        </div>

        {visible.length > 0 ? (
          <ul className="divide-y divide-rule overflow-hidden rounded-xl border border-rule">
            {visible.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-rule bg-surface px-6 py-14 text-center">
            <p className="text-xl font-semibold">{hasFilters ? 'Nothing matches those filters' : 'No open roles right now'}</p>
            <p className="mx-auto mt-2 max-w-md text-ink-soft">
              {hasFilters
                ? 'Try a broader search, or clear the filters to see every open role.'
                : 'New roles are added every week. Leave your email and we will send them to you.'}
            </p>
            {hasFilters && (
              <button type="button" onClick={() => update({ ...EMPTY })} className="press mt-5 inline-flex h-12 items-center rounded-md bg-brand px-5 font-semibold text-white hover:bg-brand-dark">
                See all jobs
              </button>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-between gap-4" aria-label="Pagination">
            <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)} className="press inline-flex h-11 items-center rounded-md border border-rule px-4 font-semibold text-ink hover:bg-surface disabled:invisible">
              Previous
            </button>
            <span className="text-[15px] text-mute">Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => goToPage(page + 1)} className="press inline-flex h-11 items-center rounded-md border border-rule px-4 font-semibold text-ink hover:bg-surface disabled:invisible">
              Next
            </button>
          </nav>
        )}
      </section>
    </>
  );
}

function BoardFromUrl({ jobs }: { jobs: BoardJob[] }) {
  const params = useSearchParams();
  return <Board jobs={jobs} initial={readFilters(params)} />;
}

/**
 * The jobs list. The page is prebuilt with every open role; this component
 * filters, sorts and pages them in the browser. The Suspense fallback is the
 * unfiltered list, so the prebuilt HTML still contains every role.
 */
export default function JobsBoard({ jobs }: { jobs: BoardJob[] }) {
  return (
    <Suspense fallback={<Board jobs={jobs} initial={EMPTY} />}>
      <BoardFromUrl jobs={jobs} />
    </Suspense>
  );
}
