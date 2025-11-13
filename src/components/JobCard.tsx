import Link from 'next/link';
import { Briefcase, Building2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Job as DatabaseJob } from '@/lib/supabase';
import { Job as MockJob } from '@/lib/mock-data';
import { generateJobSlug } from '@/lib/utils';

interface JobCardProps {
  job: (Partial<DatabaseJob> & { company_name?: string }) | MockJob;
  className?: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
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

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-4 transition-all hover:shadow-lg hover:-translate-y-1 hover:border-blue-400 duration-150 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 rounded-full p-2">
          <Briefcase className="w-6 h-6 text-blue-500" />
        </div>
        <span className="text-base font-semibold tracking-tight text-gray-900">
          {job.title}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Building2 className="w-4 h-4" />
          {companyName}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {jobType}
        </span>
      </div>

      <p className="text-gray-600 text-sm mt-1 mb-2 flex-1">
        {job.description && job.description.length > 120
          ? `${job.description.substring(0, 120)}...`
          : job.description || ''
        }
        {job.description && job.description.length > 120 && (
          <Link
            href={`/jobs/${jobSlug}`}
            className="text-blue-500 font-medium hover:underline cursor-pointer ml-1"
          >
            Read more
          </Link>
        )}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-blue-500 font-medium">
          Posted {postedDate}
        </span>
        <Link
          href={`/jobs/${jobSlug}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-blue-100 rounded-md text-blue-500 font-semibold text-sm hover:bg-blue-50 transition-colors"
        >
          Apply <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
