import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompanyMark from '@/components/CompanyMark';
import JobText from '@/components/JobText';
import SubscribeForm from '@/components/SubscribeForm';
import SuperClonerPanel from '@/components/SuperClonerPanel';
import JobDetailClient from './JobDetailClient';
import ShareButtons from './ShareButtons';
import { supabase } from '@/lib/supabase';
import { extractJobIdFromSlug, generateJobSlug } from '@/lib/utils';
import { companyName, formatSalary, locationLabel, postedAgo } from '@/lib/jobs';
import { featuredMailto } from '@/lib/site';

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
    return { title: 'Job not found' };
  }

  const title = `${job.title} at ${job.company.company_name}`;
  const plain = job.description.replace(/\s+/g, ' ').trim();
  const description = plain.length > 155 ? `${plain.substring(0, 155)}...` : plain;
  const jobSlug = generateJobSlug(job.title, job.id);
  const closed = job.status !== 'active';

  return {
    title,
    description,
    robots: closed ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${title} | GHL Hire`,
      description,
      type: 'website',
      url: `https://ghlhire.com/jobs/${jobSlug}`,
      siteName: 'GHL Hire',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | GHL Hire`,
      description,
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
    apply_url: (job.apply_url ?? null) as string | null,
    source_name: (job.source_name ?? null) as string | null,
    salary_period: (job.salary_period ?? null) as string | null,
    is_curated: Boolean(job.is_curated),
    company: {
      company_name: (job.company_name as string | null) || 'Company',
      description: job.company_description,
      logo_url: job.company_logo_url,
      website: job.company_website,
      company_size: job.company_size,
      industry: job.company_industry,
    },
  };
}

async function getSimilarJobs(currentJobId: string, companyId: string | null, limit: number = 4) {
  if (!companyId) {
    const { data } = await supabase
      .from('jobs')
      .select('*, company:companies(company_name)')
      .eq('status', 'active')
      .neq('id', currentJobId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  }

  // First try to get jobs from the same company
  const { data: companyJobs } = await supabase
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
  const { data: otherJobs } = await supabase
    .from('jobs')
    .select(`
      *,
      company:companies(company_name)
    `)
    .eq('status', 'active')
    .neq('id', currentJobId)
    .or(`company_id.is.null,company_id.neq.${companyId}`)
    .order('created_at', { ascending: false })
    .limit(remaining);

  return [...(companyJobs || []), ...(otherJobs || [])];
}

async function incrementViewCount(jobId: string) {
  // Increment the view count
  await supabase.rpc('increment_job_views', { job_id: jobId });
}

const EMPLOYMENT_TYPE: Record<string, string> = {
  'Full-Time': 'FULL_TIME',
  'Part-Time': 'PART_TIME',
  Contract: 'CONTRACTOR',
  Freelance: 'CONTRACTOR',
};

const SALARY_UNIT: Record<string, string> = { year: 'YEAR', month: 'MONTH', hour: 'HOUR' };

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  // Fire and forget: do not block the page on the counter.
  incrementViewCount(job.id);

  const similarJobs = await getSimilarJobs(job.id, job.company_id, 4);
  const name = job.company.company_name;
  const salary = formatSalary(job);
  const isOpen = job.status === 'active' && !(job.expires_at && new Date(job.expires_at).getTime() < Date.now());
  const period = job.salary_period || ((job.salary_max ?? job.salary_min ?? 0) < 1000 ? 'hour' : 'year');

  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: [job.description, job.requirements, job.benefits].filter(Boolean).join('\n\n'),
    datePosted: job.created_at,
    validThrough: job.expires_at || undefined,
    employmentType: EMPLOYMENT_TYPE[job.job_type],
    directApply: !job.apply_url,
    hiringOrganization: {
      '@type': 'Organization',
      name,
      sameAs: job.company.website || undefined,
      logo: job.company.logo_url || undefined,
    },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location },
    },
    jobLocationType: job.remote ? 'TELECOMMUTE' : undefined,
    baseSalary:
      job.salary_min || job.salary_max
        ? {
            '@type': 'MonetaryAmount',
            currency: job.salary_currency || 'USD',
            value: {
              '@type': 'QuantitativeValue',
              minValue: job.salary_min || undefined,
              maxValue: job.salary_max || undefined,
              unitText: SALARY_UNIT[period],
            },
          }
        : undefined,
  };

  const facts: [string, string][] = [
    ['Job type', job.job_type],
    ['Location', locationLabel(job)],
  ];
  if (job.experience_level) facts.push(['Experience', job.experience_level]);
  facts.push(['Pay', salary || 'Not listed']);
  facts.push(['Posted', postedAgo(job.created_at)]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      {isOpen && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }} />
      )}

      <Header />

      <main>
        <section className="border-b border-rule bg-surface">
          <div className="page-wrap py-8 md:py-12">
            <p className="text-sm">
              <Link href="/jobs" className="inline-flex min-h-[40px] items-center font-medium text-brand hover:underline">
                All jobs
              </Link>
            </p>

            <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="flex min-w-0 gap-4 sm:gap-5">
                <CompanyMark name={name} logoUrl={job.company.logo_url} featured={Boolean(job.is_featured)} size="lg" />
                <div className="min-w-0">
                  <h1 className="display text-3xl font-semibold md:text-[2.75rem]">{job.title}</h1>
                  <p className="mt-2 text-lg text-ink-soft">
                    <span className="font-semibold text-ink">{name}</span>
                    <span className="mx-2 text-mute" aria-hidden="true">·</span>
                    {locationLabel(job)}
                  </p>
                  <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-ink-soft">
                    {job.is_featured && (
                      <span className="rounded-sm bg-gold px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">Featured</span>
                    )}
                    <span>{job.job_type}</span>
                    {job.experience_level && <span>{job.experience_level}</span>}
                    {salary && <span className="font-semibold text-ink">{salary}</span>}
                    <span className="text-mute">Posted {postedAgo(job.created_at).toLowerCase()}</span>
                  </p>
                </div>
              </div>

              <div id="apply-actions" className="w-full shrink-0 scroll-mt-24 lg:w-72">
                <JobDetailClient job={job} />
                {job.apply_url && isOpen && (
                  <p className="mt-2 text-sm text-mute">
                    {job.is_curated
                      ? `Opens the original posting${job.source_name ? ` on ${job.source_name}` : ''}.`
                      : `You apply on ${name}'s own site.`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="page-wrap grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
          <article className="min-w-0 max-w-3xl space-y-10">
            {job.is_curated && (
              <p className="rounded-md border border-rule bg-surface px-4 py-3 text-[15px] text-ink-soft">
                We found this role{job.source_name ? ` on ${job.source_name}` : ''} and summarised it here. The original posting is the source of truth for details and deadlines, and it is where you apply.
              </p>
            )}

            <section aria-labelledby="about-role">
              <h2 id="about-role" className="mb-4 text-2xl font-semibold tracking-tight">About the role</h2>
              <JobText text={job.description} />
            </section>

            {job.is_curated && job.benefits && (
              <section aria-labelledby="duties">
                <h2 id="duties" className="mb-4 text-2xl font-semibold tracking-tight">
                  What you will do
                </h2>
                <JobText text={job.benefits} />
              </section>
            )}

            {job.requirements && (
              <section aria-labelledby="requirements">
                <h2 id="requirements" className="mb-4 text-2xl font-semibold tracking-tight">What you need</h2>
                <JobText text={job.requirements} />
              </section>
            )}

            {!job.is_curated && job.benefits && (
              <section aria-labelledby="benefits">
                <h2 id="benefits" className="mb-4 text-2xl font-semibold tracking-tight">
                  What you get
                </h2>
                <JobText text={job.benefits} />
              </section>
            )}

            <section className="flex flex-col gap-4 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
              {isOpen ? (
                <a href="#apply-actions" className="press inline-flex h-12 items-center justify-center rounded-md bg-brand px-6 text-base font-semibold text-white hover:bg-brand-dark">
                  Apply now
                </a>
              ) : (
                <Link href="/jobs" className="press inline-flex h-12 items-center justify-center rounded-md bg-brand px-6 text-base font-semibold text-white hover:bg-brand-dark">
                  Browse open roles
                </Link>
              )}
              <ShareButtons job={job} />
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-rule p-6">
              <h2 className="text-lg font-semibold tracking-tight">At a glance</h2>
              <dl className="mt-3 divide-y divide-rule text-[15px]">
                {facts.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-mute">{label}</dt>
                    <dd className="text-right font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-xl border border-rule p-6">
              <h2 className="text-lg font-semibold tracking-tight">Get roles like this by email</h2>
              <p className="mt-1 mb-4 text-[15px] text-ink-soft">New GoHighLevel jobs, once a week.</p>
              <SubscribeForm source="job-detail" buttonLabel="Subscribe" stacked />
            </div>

            {(job.company.description || job.company.website) && (
              <div className="rounded-xl border border-rule p-6">
                <h2 className="text-lg font-semibold tracking-tight">About {name}</h2>
                {job.company.description && (
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{job.company.description}</p>
                )}
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="mt-2 inline-flex min-h-[44px] items-center text-[15px] font-semibold text-brand hover:underline"
                  >
                    Visit company website
                  </a>
                )}
              </div>
            )}

            {similarJobs.length > 0 && (
              <div className="rounded-xl border border-rule p-6">
                <h2 className="text-lg font-semibold tracking-tight">More open roles</h2>
                <ul className="mt-2 divide-y divide-rule">
                  {similarJobs.map((similarJob) => (
                    <li key={similarJob.id}>
                      <Link href={`/jobs/${generateJobSlug(similarJob.title, similarJob.id)}`} className="group block py-3">
                        <span className="block text-[15px] font-semibold text-ink group-hover:text-brand">{similarJob.title}</span>
                        <span className="block text-sm text-mute">
                          {companyName(similarJob)} · {similarJob.location}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-rule p-6">
              <h2 className="text-lg font-semibold tracking-tight">Hiring too?</h2>
              <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">
                Post your GoHighLevel role for free, or feature it at the top of the board.
              </p>
              <p className="mt-3 flex flex-wrap gap-x-5 text-[15px] font-semibold">
                <Link href="/post-job" className="inline-flex min-h-[44px] items-center text-brand hover:underline">Post a job free</Link>
                <a href={featuredMailto()} className="inline-flex min-h-[44px] items-center text-brand hover:underline">Feature a job</a>
              </p>
            </div>

            <SuperClonerPanel variant="card" title="Hired to rebuild funnels? Clone them in one click." />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
