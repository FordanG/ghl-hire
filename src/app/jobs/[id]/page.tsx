import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowLeft, Building2, MapPin, Clock, DollarSign, Calendar, ExternalLink, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobDetailClient from './JobDetailClient';
import ShareButtons from './ShareButtons';
import { supabase } from '@/lib/supabase';
import { extractJobIdFromSlug, generateJobSlug } from '@/lib/utils';

interface JobDetailPageProps {
  params: Promise<{
    id: string; // This is actually the slug now
  }>;
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return {
      title: 'Job Not Found | GHL Hire',
    };
  }

  const title = `${job.title} at ${job.company?.company_name || 'Company'} | GHL Hire`;
  const description = job.description.length > 155
    ? job.description.substring(0, 155) + '...'
    : job.description;

  const salary = job.salary_min && job.salary_max
    ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
    : null;

  // Generate SEO-friendly slug for URLs
  const jobSlug = generateJobSlug(job.title, job.id);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://ghlhire.com/jobs/${jobSlug}`,
      siteName: 'GHL Hire',
      images: job.company?.logo_url ? [
        {
          url: job.company.logo_url,
          width: 1200,
          height: 630,
          alt: `${job.company.company_name} logo`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: job.company?.logo_url ? [job.company.logo_url] : [],
    },
    alternates: {
      canonical: `https://ghlhire.com/jobs/${jobSlug}`,
    },
  };
}

async function getJob(slugOrId: string) {
  // Extract the short ID from the slug
  const shortId = extractJobIdFromSlug(slugOrId);

  // Use the custom database function to find the job by slug
  const { data, error } = await supabase
    .rpc('find_job_by_slug', { slug_prefix: shortId });

  if (error || !data || data.length === 0) {
    console.error('Error finding job:', error);
    return null;
  }

  // Transform the flat result into the expected nested structure
  const job = data[0];
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    salary_currency: job.salary_currency,
    location: job.location,
    remote: job.remote,
    job_type: job.job_type,
    experience_level: job.experience_level,
    company_id: job.company_id,
    status: job.status,
    is_featured: job.is_featured,
    views_count: job.views_count,
    applications_count: job.applications_count,
    expires_at: job.expires_at,
    created_at: job.created_at,
    updated_at: job.updated_at,
    company: {
      company_name: job.company_name,
      description: job.company_description,
      logo_url: job.company_logo_url,
      website: job.company_website,
      company_size: job.company_size,
      industry: job.company_industry,
    },
  };
}

async function getSimilarJobs(currentJobId: string, companyId: string, limit: number = 3) {
  // First try to get jobs from the same company
  const { data: companyJobs, error: companyError } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(company_name)
    `)
    .eq('status', 'active')
    .eq('company_id', companyId)
    .neq('id', currentJobId)
    .order('created_at', { ascending: false })
    .limit(limit);

  // If we have enough jobs from the same company, return them
  if (companyJobs && companyJobs.length >= limit) {
    return companyJobs;
  }

  // Otherwise, get other recent jobs to fill the list
  const remaining = limit - (companyJobs?.length || 0);
  const { data: otherJobs, error: otherError } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(company_name)
    `)
    .eq('status', 'active')
    .neq('id', currentJobId)
    .neq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(remaining);

  return [...(companyJobs || []), ...(otherJobs || [])];
}

async function incrementViewCount(jobId: string) {
  // Increment the view count
  await supabase.rpc('increment_job_views', { job_id: jobId });
}

function formatDate(dateString: string) {
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

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  // Increment view count (fire and forget - don't await to avoid blocking page load)
  incrementViewCount(job.id);

  const similarJobs = await getSimilarJobs(job.id, job.company_id, 3);

  const salary = job.salary_min && job.salary_max
    ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
    : null;

  // Generate JSON-LD structured data for job posting
  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    validThrough: job.expires_at || undefined,
    employmentType: job.job_type === 'Full-Time' ? 'FULL_TIME' :
                    job.job_type === 'Part-Time' ? 'PART_TIME' :
                    job.job_type === 'Contract' ? 'CONTRACTOR' :
                    job.job_type === 'Freelance' ? 'CONTRACTOR' : undefined,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company?.company_name || 'Company',
      sameAs: job.company?.website || undefined,
      logo: job.company?.logo_url || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'US',
      }
    },
    baseSalary: job.salary_min && job.salary_max ? {
      '@type': 'MonetaryAmount',
      currency: job.salary_currency || 'USD',
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salary_min,
        maxValue: job.salary_max,
        unitText: 'YEAR',
      }
    } : undefined,
    experienceRequirements: job.experience_level ? {
      '@type': 'OccupationalExperienceRequirements',
      monthsOfExperience: job.experience_level === 'Entry Level' ? 0 :
                          job.experience_level === 'Mid Level' ? 24 :
                          job.experience_level === 'Senior Level' ? 60 :
                          job.experience_level === 'Lead' ? 84 : 0,
    } : undefined,
    workHours: job.remote ? 'Remote' : undefined,
    jobLocationType: job.remote ? 'TELECOMMUTE' : undefined,
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />

      <Header />
      
      {/* Job Header */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link 
          href="/jobs" 
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-8 fade-in fade-in-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        {/* Job Title and Meta */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 border-b border-gray-200 pb-8 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4 text-gray-900 fade-in fade-in-2">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-gray-500 text-base mb-4 fade-in fade-in-3">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {job.company?.company_name}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
                {job.remote && ' (Remote)'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {job.job_type}
              </span>
              {salary && (
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {salary}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Posted {formatDate(job.created_at)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 fade-in fade-in-5">
            <JobDetailClient job={job} />
            <ShareButtons job={job} />
          </div>
        </div>

        {/* Job Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="fade-in fade-in-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="fade-in fade-in-2">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="fade-in fade-in-3">
                <h2 className="text-xl font-semibold mb-4">Benefits</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {job.benefits}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-gray-50 rounded-xl p-6 fade-in fade-in-3">
              <h3 className="font-semibold mb-4">About {job.company?.company_name}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {job.company?.description || 'A company in the GoHighLevel ecosystem.'}
              </p>
              {job.company?.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 font-medium hover:underline text-sm"
                >
                  Visit Website →
                </a>
              )}
            </div>

            {/* Job Stats */}
            <div className="bg-gray-50 rounded-xl p-6 fade-in fade-in-4">
              <h3 className="font-semibold mb-4">Job Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Job Type:</span>
                  <span className="font-medium">{job.job_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                {salary && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Salary:</span>
                    <span className="font-medium">{salary}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Posted:</span>
                  <span className="font-medium">{formatDate(job.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Views:</span>
                  <span className="font-medium">{job.views_count.toLocaleString()}</span>
                </div>
                {job.applications_count > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Applications:</span>
                    <span className="font-medium">{job.applications_count}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-gray-50 rounded-xl p-6 fade-in fade-in-5">
              <h3 className="font-semibold mb-4">
                {similarJobs.length > 0 && similarJobs[0].company_id === job.company_id
                  ? `More from ${job.company?.company_name}`
                  : 'Related Jobs'}
              </h3>
              <div className="space-y-3">
                {similarJobs.length > 0 ? (
                  similarJobs.map((similarJob) => {
                    const similarJobSlug = generateJobSlug(similarJob.title, similarJob.id);
                    return (
                      <Link
                        key={similarJob.id}
                        href={`/jobs/${similarJobSlug}`}
                        className="block p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
                      >
                      <div className="font-medium text-sm text-gray-900 mb-1">
                        {similarJob.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {similarJob.company?.company_name} • {similarJob.location}
                      </div>
                      {similarJob.company_id === job.company_id && (
                        <div className="text-xs text-blue-600 mt-1">Same company</div>
                      )}
                    </Link>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">No related jobs found</p>
                )}
              </div>
              <Link
                href="/jobs"
                className="block text-blue-500 font-medium hover:underline text-sm mt-4"
              >
                View All Jobs →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-blue-50 rounded-xl p-8 fade-in fade-in-6">
          <h3 className="text-xl font-semibold mb-2">Ready to Apply?</h3>
          <p className="text-gray-600 mb-6">
            Join the GoHighLevel community and take your career to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
              <ExternalLink className="w-5 h-5" />
              Apply Now
            </button>
            <Link 
              href="/jobs" 
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 font-semibold rounded-lg hover:bg-white transition-colors"
            >
              Browse More Jobs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}