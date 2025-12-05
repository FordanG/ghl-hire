import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Search, Users, Briefcase, CheckCircle, Rocket, ShieldCheck, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { createClient } from '@/lib/supabase/server';

// Organization JSON-LD schema for homepage
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GHL Hire',
  description: 'The premier job board connecting GoHighLevel professionals with career opportunities in marketing automation and CRM.',
  url: 'https://ghlhire.com',
  logo: 'https://ghlhire.com/logo.png',
  sameAs: [
    'https://twitter.com/ghlhire',
    'https://linkedin.com/company/ghlhire',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@ghlhire.com',
  },
};

// WebSite schema for search functionality
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GHL Hire',
  url: 'https://ghlhire.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://ghlhire.com/jobs?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

async function getFeaturedJobs() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(`
      id,
      title,
      description,
      location,
      job_type,
      salary_min,
      salary_max,
      remote,
      created_at,
      company:companies (
        id,
        company_name,
        logo_url
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured jobs:', error);
    return [];
  }

  return jobs || [];
}

export default async function Home() {
  const featuredJobs = await getFeaturedJobs();

  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <Header />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center pt-20 pb-16 px-4 bg-white">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4 fade-in fade-in-1">
          The Premier Job Board for <span className="text-blue-500">GoHighLevel</span> Professionals
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 fade-in fade-in-2">
          Welcome to <span className="font-semibold text-gray-900">GHL Hire</span>, the dedicated career platform connecting talented professionals with exciting opportunities in the GoHighLevel ecosystem. Whether you&apos;re a seasoned GHL expert or looking to break in, we&apos;re your gateway to career growth in marketing automation and CRM.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 fade-in fade-in-3">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-blue-500 text-white font-semibold text-base shadow hover:bg-blue-600 transition-colors outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Browse Jobs
          </Link>
          <Link
            href="/employers"
            className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-gray-200 font-semibold text-base hover:bg-blue-50 hover:border-blue-500 transition-colors outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-gray-900"
          >
            For Employers
          </Link>
        </div>
      </section>

      {/* Job Listings */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight fade-in fade-in-1">
            Latest Job Openings
          </h2>
          <Link
            href="/jobs"
            className="text-blue-500 font-medium hover:underline transition-colors fade-in fade-in-2"
          >
            View All Jobs
          </Link>
        </div>
        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                className={`fade-in fade-in-${Math.min(index + 3, 6)}`}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Yet</h3>
            <p className="text-gray-600 mb-4">Be the first to post a job on GHL Hire!</p>
            <Link
              href="/post-job"
              className="inline-flex items-center justify-center px-5 py-3 rounded-md bg-blue-500 text-white font-semibold text-base shadow hover:bg-blue-600 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        )}
      </section>

      <div className="max-w-6xl mx-auto border-t border-gray-200"></div>

      {/* What We Do */}
      <section className="max-w-5xl mx-auto px-4 pt-8 pb-12 bg-white">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2 fade-in fade-in-1">
            <Image
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
              alt="Team working"
              width={600}
              height={400}
              className="w-full rounded-lg shadow-md border border-gray-200 object-cover aspect-video"
            />
          </div>
          <div className="w-full md:w-1/2 md:pl-8">
            <h2 className="text-2xl font-semibold tracking-tight mb-2 fade-in fade-in-2">
              What We Do
            </h2>
            <p className="text-gray-500 mb-4 fade-in fade-in-3">
              GHL Hire is the central hub for GoHighLevel agencies, SaaS companies, and businesses to find skilled professionals who understand the platform inside and out. We specialize exclusively in GHL-related positions, making us the go-to resource for this unique ecosystem.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 fade-in fade-in-4">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="text-gray-900">Niche job matching for GHL roles</span>
              </li>
              <li className="flex items-center gap-3 fade-in fade-in-5">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span className="text-gray-900">Opportunities for agencies & SaaS businesses</span>
              </li>
              <li className="flex items-center gap-3 fade-in fade-in-6">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span className="text-gray-900">Pre-vetted talent & streamlined hiring</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto border-t border-gray-200"></div>

      {/* For Job Seekers & Employers */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white">
        {/* For Job Seekers */}
        <div className="rounded-xl border border-gray-200 bg-blue-50 px-8 py-8 shadow fade-in fade-in-2">
          <div className="flex items-center gap-3 mb-3">
            <Search className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">For Job Seekers</h3>
          </div>
          <ul className="space-y-3 text-gray-600 text-base">
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Browse hundreds of GHL-specific roles from account managers to developers
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Filter opportunities by expertise level, location, and specialty
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Connect directly with agencies and companies using GoHighLevel
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Access resources to improve your GHL skills and certifications
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Build your profile to showcase your GHL experience and achievements
            </li>
          </ul>
        </div>

        {/* For Employers */}
        <div className="rounded-xl border border-gray-200 bg-blue-50 px-8 py-8 shadow fade-in fade-in-3">
          <div className="flex items-center gap-3 mb-3">
            <Briefcase className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">For Employers</h3>
          </div>
          <ul className="space-y-3 text-gray-600 text-base">
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Post jobs to reach qualified GHL professionals
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Access a pre-vetted talent pool familiar with the platform
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Save time by connecting with candidates who already understand GHL
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Build your company profile to attract top talent
            </li>
            <li className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              Streamline your hiring process with specialized tools
            </li>
          </ul>
        </div>
      </section>

      <div className="max-w-6xl mx-auto border-t border-gray-200"></div>

      {/* Why Choose GHL Hire */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-center bg-white">
        <h2 className="text-2xl font-semibold tracking-tight mb-3 fade-in fade-in-1">
          Why Choose <span className="text-blue-500">GHL Hire?</span>
        </h2>
        <p className="text-gray-500 mb-8 fade-in fade-in-2">
          In the fast-growing GoHighLevel community, finding the right talent or opportunity requires specialized knowledge. We understand the unique skills needed to succeed with GHL: from funnel building and automation, to white-label management and API integration.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col items-center fade-in fade-in-3">
            <Rocket className="w-8 h-8 text-blue-500 mb-2" />
            <div className="font-semibold text-gray-900">Faster Hiring</div>
            <p className="text-gray-500 text-sm mt-1">Our focused approach means better matches and rapid placements.</p>
          </div>
          <div className="flex flex-col items-center fade-in fade-in-4">
            <ShieldCheck className="w-8 h-8 text-blue-500 mb-2" />
            <div className="font-semibold text-gray-900">Stronger Teams</div>
            <p className="text-gray-500 text-sm mt-1">Connect with professionals who truly understand the GHL platform.</p>
          </div>
          <div className="flex flex-col items-center fade-in fade-in-5">
            <Target className="w-8 h-8 text-blue-500 mb-2" />
            <div className="font-semibold text-gray-900">Precision Matching</div>
            <p className="text-gray-500 text-sm mt-1">Specialized vetting for agencies and SaaS companies&apos; unique needs.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full bg-blue-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center fade-in fade-in-1">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-gray-900">
            Join the Future of GoHighLevel Hiring
          </h2>
          <p className="text-gray-500 mb-6">
            Thousands of professionals and companies are already building their futures on GHL Hire. Your next opportunity in the GoHighLevel ecosystem starts here.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-500 text-white font-semibold text-base shadow hover:bg-blue-600 transition-colors outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Get Started
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
