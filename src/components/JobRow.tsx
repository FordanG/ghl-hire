import Link from 'next/link';
import CompanyMark from './CompanyMark';
import { generateJobSlug } from '@/lib/utils';
import {
  type BoardJob,
  companyName,
  formatSalary,
  isNew,
  locationLabel,
  postedAgo,
  splitEmployer,
} from '@/lib/jobs';

interface JobRowProps {
  job: BoardJob;
  /** Compact rows drop the tag line (homepage board). */
  compact?: boolean;
}

/**
 * One line of the board. The whole row is the link; featured rows carry the
 * gold edge so paid placement is always visibly labelled.
 */
export default function JobRow({ job, compact = false }: JobRowProps) {
  const fullName = companyName(job);
  const { name, unnamed } = splitEmployer(fullName);
  const salary = formatSalary(job);
  const featured = Boolean(job.is_featured);
  const fresh = isNew(job.created_at);

  return (
    <li className={`relative ${featured ? 'bg-gold-soft' : 'bg-white'}`}>
      {featured && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gold" />}
      <Link
        href={`/jobs/${generateJobSlug(job.title, job.id)}`}
        className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 px-4 py-4 outline-none transition-colors hover:bg-brand-soft/60 focus-visible:bg-brand-soft sm:px-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-5 md:py-5"
      >
        <CompanyMark name={fullName} logoUrl={job.company?.logo_url} featured={featured} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-ink group-hover:text-brand">
              {job.title}
            </h3>
            {featured && (
              <span className="rounded-sm bg-gold px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">
                Featured
              </span>
            )}
            {!featured && fresh && (
              <span className="hidden rounded-sm bg-brand-soft px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand sm:inline">
                New
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[15px] text-ink-soft">
            <span className="font-medium text-ink">{name}</span>
            {unnamed && <span className="text-mute">, employer not named</span>}
          </p>
          <p className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-sm text-mute">
            <span>{locationLabel(job)}</span>
            <span aria-hidden="true">·</span>
            <span>{job.job_type}</span>
            {!compact && job.experience_level && (
              <>
                <span aria-hidden="true">·</span>
                <span>{job.experience_level}</span>
              </>
            )}
            {!compact && job.apply_url && (
              <>
                <span aria-hidden="true">·</span>
                <span>Apply on employer site</span>
              </>
            )}
          </p>
        </div>

        <div className="col-start-2 flex items-baseline justify-between gap-4 md:col-start-3 md:flex-col md:items-end md:justify-center md:gap-1">
          <span className="text-[15px] font-semibold tabular-nums text-ink">
            {salary || <span className="font-normal text-mute">Pay not listed</span>}
          </span>
          <span className="text-sm text-mute">{postedAgo(job.created_at)}</span>
        </div>
      </Link>
    </li>
  );
}
