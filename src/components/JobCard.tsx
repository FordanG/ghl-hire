import Link from 'next/link';
import { Briefcase, Building2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Job } from '@/lib/mock-data';

interface JobCardProps {
  job: Job;
  className?: string;
}

export default function JobCard({ job, className = '' }: JobCardProps) {
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
          {job.company}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {job.type}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mt-1 mb-2 flex-1">
        {job.description.length > 120 
          ? `${job.description.substring(0, 120)}...` 
          : job.description
        }
        {job.description.length > 120 && (
          <Link 
            href={`/jobs/${job.id}`}
            className="text-blue-500 font-medium hover:underline cursor-pointer ml-1"
          >
            Read more
          </Link>
        )}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-blue-500 font-medium">
          Posted {job.postedDate}
        </span>
        <Link 
          href={`/jobs/${job.id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 border border-blue-100 rounded-md text-blue-500 font-semibold text-sm hover:bg-blue-50 transition-colors"
        >
          Apply <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}