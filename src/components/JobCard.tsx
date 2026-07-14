import Link from 'next/link';
import { Briefcase, Building2, MapPin, Clock, DollarSign, ArrowRight, Sparkles, Wifi } from 'lucide-react';
import { Job as DatabaseJob } from '@/lib/supabase';
import { Job as MockJob } from '@/lib/mock-data';
import { generateJobSlug } from '@/lib/utils';
import SaveJobButton from './SaveJobButton';

// Type for jobs fetched with company join from Supabase
interface JobWithCompany {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  remote: boolean | null;
  created_at: string | null;
  company: {
    id: string;
    company_name: string;
    logo_url: string | null;
  } | null;
}

interface JobCardProps {
  job: (Partial<DatabaseJob> & { company_name?: string }) | MockJob | JobWithCompany;
  className?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function formatSalary(min?: number | null, max?: number | null): string {
  if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  if (min) return `From $${min.toLocaleString()}`;
  if (max) return `Up to $${max.toLocaleString()}`;
  return '';
}

export default function JobCard({ job, className = '' }: JobCardProps) {
  // Handle both database and mock job types
  const companyName =
    ('company' in job && job.company && typeof job.company === 'object' && 'company_name' in job.company) ? job.company.company_name :
    ('company' in job && typeof job.company === 'string') ? job.company :
    ('company_name' in job) ? job.company_name :
    'Company';

  const jobType = ('job_type' in job) ? job.job_type : ('type' in job) ? job.type : '';
  const postedDate = ('created_at' in job && job.created_at) ? formatDate(job.created_at) :
                     ('postedDate' in job) ? job.postedDate : '';

  // Generate SEO-friendly slug
  const jobSlug = generateJobSlug(job.title || '', job.id || '');

  // Presentational-only derived display fields (no data fetching / logic change)
  const salaryDisplay =
    ('salary' in job && job.salary) ? job.salary :
    ('salary_min' in job || 'salary_max' in job)
      ? formatSalary(
          ('salary_min' in job) ? job.salary_min : undefined,
          ('salary_max' in job) ? job.salary_max : undefined,
        )
      : '';

  const isRemote =
    ('remote' in job) ? Boolean(job.remote) :
    (typeof job.location === 'string' && job.location.toLowerCase().includes('remote'));

  const isFeatured = ('is_featured' in job) ? Boolean(job.is_featured) : false;

  return (
    <div
      className={`group hover-lift relative flex h-full flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm ${
        isFeatured
          ? 'border-blue-300 ring-1 ring-blue-100'
          : 'border-gray-200 hover:border-blue-300'
      } ${className}`}
    >
      {/* Title + company + save */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className={`flex-shrink-0 rounded-xl p-2.5 ${isFeatured ? 'bg-blue-100' : 'bg-blue-50'}`}>
            <Briefcase className="h-5 w-5 text-blue-500" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-blue-600">
              {job.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-500">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{companyName}</span>
            </p>
          </div>
        </div>
        <SaveJobButton jobId={job.id || ''} size="sm" />
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap items-center gap-2">
        {isFeatured && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
            <Sparkles className="h-3.5 w-3.5" />
            Featured
          </span>
        )}
        {jobType && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            <Clock className="h-3.5 w-3.5" />
            {jobType}
          </span>
        )}
        {isRemote && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            <Wifi className="h-3.5 w-3.5" />
            Remote
          </span>
        )}
        {job.location && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </span>
        )}
      </div>

      {/* Description */}
      <p className="flex-1 text-sm leading-relaxed text-gray-600">
        {job.description && job.description.length > 120
          ? `${job.description.substring(0, 120)}...`
          : job.description || ''
        }
        {job.description && job.description.length > 120 && (
          <Link
            href={`/jobs/${jobSlug}`}
            className="ml-1 cursor-pointer font-medium text-blue-500 hover:underline"
          >
            Read more
          </Link>
        )}
      </p>

      {/* Footer: salary / posted + apply */}
      <div className="flex items-end justify-between gap-4 border-t border-gray-100 pt-4">
        <div className="min-w-0">
          {salaryDisplay ? (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-900">
              <DollarSign className="h-4 w-4 flex-shrink-0 text-blue-500" />
              <span className="truncate">{salaryDisplay}</span>
            </span>
          ) : (
            <span className="text-sm font-medium text-blue-500">
              {postedDate ? `Posted ${postedDate}` : 'View role'}
            </span>
          )}
          {salaryDisplay && postedDate && (
            <span className="mt-0.5 block text-xs text-gray-400">Posted {postedDate}</span>
          )}
        </div>
        <Link
          href={`/jobs/${jobSlug}`}
          className="press inline-flex min-h-[44px] min-w-[44px] flex-shrink-0 items-center justify-center gap-1 rounded-md border border-blue-100 bg-blue-50/60 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100"
        >
          Apply <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
