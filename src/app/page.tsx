import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Target,
  Rocket,
  ShieldCheck,
  Zap,
  Star,
  LayoutDashboard,
  BarChart3,
  BellRing,
  FolderKanban,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import Reveal from '@/components/ui/Reveal';
import FeatureCard, { type Feature } from '@/components/home/FeatureCard';
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

// Static, presentational feature copy for the "Everything you need" grid.
const features: Feature[] = [
  {
    icon: Zap,
    title: 'Post jobs in minutes',
    description: 'Publish a GoHighLevel role with a guided form and reach specialists the same day.',
    audience: 'employer',
  },
  {
    icon: Star,
    title: 'Featured listings',
    description: 'Plan-based placement puts your opening at the top where qualified GHL talent looks first.',
    audience: 'employer',
  },
  {
    icon: LayoutDashboard,
    title: 'Applicant tracking',
    description: 'Review, shortlist, and manage every candidate from one employer dashboard.',
    audience: 'employer',
  },
  {
    icon: BarChart3,
    title: 'Hiring analytics',
    description: 'See views and applications on each role so you know exactly what is working.',
    audience: 'employer',
  },
  {
    icon: Target,
    title: 'GHL-specialized listings',
    description: 'Every role is GoHighLevel-specific — from funnel builders to white-label developers.',
    audience: 'talent',
  },
  {
    icon: BellRing,
    title: 'Saved jobs & email alerts',
    description: 'Bookmark roles and get notified the moment new GHL openings match your interests.',
    audience: 'talent',
  },
  {
    icon: FolderKanban,
    title: 'Portfolio on your profile',
    description: 'Showcase real GHL builds and projects so employers see your work, not just a resume.',
    audience: 'talent',
  },
  {
    icon: ClipboardList,
    title: 'Application tracking',
    description: 'Track every application in one place and always know where you stand.',
    audience: 'talent',
  },
  {
    icon: Sparkles,
    title: 'AI-powered matching',
    description: 'Smart recommendations that pair the right GHL talent with the right role — automatically.',
    audience: 'employer',
    comingSoon: true,
  },
];

const stats = [
  {
    icon: Briefcase,
    value: 'Live roles',
    label: 'Real openings from active GoHighLevel agencies and SaaS teams.',
  },
  {
    icon: Target,
    value: '100% GHL',
    label: 'Every listing is GoHighLevel-specific — no noise, no off-topic jobs.',
  },
  {
    icon: CheckCircle,
    value: 'Free to join',
    label: 'Create a profile, save jobs, and apply at no cost to job seekers.',
  },
];

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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 to-white">
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-14 md:pt-20 md:pb-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Copy */}
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-100 mb-5 fade-in fade-in-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              Built exclusively for GoHighLevel
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-5 fade-in fade-in-1">
              Find your next <span className="text-blue-600">GoHighLevel</span> role — or the expert to fill it
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto md:mx-0 mb-8 fade-in fade-in-2">
              GHL Hire is the only job board built exclusively for the GoHighLevel ecosystem — connecting agencies and SaaS teams with professionals who already know the platform inside and out.
            </p>
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 fade-in fade-in-3">
              <Link
                href="/jobs"
                className="press inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-blue-500 text-white font-semibold text-base shadow hover:bg-blue-600 transition-colors outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Browse Jobs <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/employers"
                className="press inline-flex items-center justify-center px-5 py-3 rounded-md border border-gray-200 bg-white font-semibold text-base hover:bg-blue-50 hover:border-blue-500 transition-colors outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-gray-900"
              >
                For Employers
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-gray-500 fade-in fade-in-4">
              <li className="inline-flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-500" aria-hidden="true" />
                Free for job seekers
              </li>
              <li className="inline-flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-500" aria-hidden="true" />
                GHL-specialized roles
              </li>
              <li className="inline-flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-500" aria-hidden="true" />
                No spam listings
              </li>
            </ul>
          </div>

          {/* Illustration */}
          <div className="fade-in fade-in-2">
            <Image
              src="/hero-illustration.png"
              alt="GoHighLevel marketing, development, and support professionals connected across the platform"
              width={1376}
              height={768}
              priority
              sizes="(max-width: 768px) 92vw, 45vw"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Social proof / stats strip */}
      <Reveal as="section" className="max-w-5xl mx-auto w-full px-4 -mt-2 md:-mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm sm:divide-x sm:divide-gray-200">
          {stats.map((stat) => (
            <div key={stat.value} className="flex flex-col items-center text-center px-4 py-2">
              <stat.icon className="w-7 h-7 text-blue-500 mb-3" aria-hidden="true" />
              <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
              <p className="text-sm text-gray-500 mt-1 max-w-[16rem]">{stat.label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Feature grid */}
      <section className="w-full bg-gray-50 border-y border-gray-100 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-3">
              Everything you need to hire GHL talent
            </h2>
            <p className="text-gray-500 text-lg">
              Whether you&apos;re building a GoHighLevel team or your GHL career, GHL Hire gives both sides the tools to move fast.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Reveal
                key={feature.title}
                delay={Math.min(index + 1, 4) as 1 | 2 | 3 | 4}
                className="h-full"
              >
                <FeatureCard {...feature} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Latest job openings */}
      <section className="max-w-6xl mx-auto w-full px-4 py-16">
        <Reveal className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Latest GHL job openings
          </h2>
          <Link
            href="/jobs"
            className="text-blue-500 font-medium hover:underline transition-colors"
          >
            View all jobs
          </Link>
        </Reveal>
        {featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredJobs.map((job, index) => (
              <Reveal
                key={job.id}
                delay={Math.min(index + 1, 4) as 1 | 2 | 3 | 4}
                className="h-full"
              >
                <JobCard job={job} className="h-full" />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="text-center py-12 bg-gray-50 rounded-lg">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Yet</h3>
            <p className="text-gray-600 mb-4">Be the first to post a job on GHL Hire!</p>
            <Link
              href="/post-job"
              className="press inline-flex items-center justify-center px-5 py-3 rounded-md bg-blue-500 text-white font-semibold text-base shadow hover:bg-blue-600 transition-colors"
            >
              Post a Job
            </Link>
          </Reveal>
        )}
      </section>

      <div className="max-w-6xl mx-auto w-full border-t border-gray-200"></div>

      {/* Why choose GHL Hire */}
      <Reveal as="section" className="max-w-4xl mx-auto w-full px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight mb-3">
          Why choose <span className="text-blue-500">GHL Hire?</span>
        </h2>
        <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
          In the fast-growing GoHighLevel community, finding the right talent or opportunity takes specialized knowledge — from funnel building and automation to white-label management and API integration. We focus on nothing else.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <Rocket className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="font-semibold text-gray-900">Faster hiring</div>
            <p className="text-gray-500 text-sm mt-1 max-w-[15rem]">A focused pool means better matches and quicker placements.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="font-semibold text-gray-900">Stronger teams</div>
            <p className="text-gray-500 text-sm mt-1 max-w-[15rem]">Connect with people who truly understand the GHL platform.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
              <Target className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="font-semibold text-gray-900">Precision matching</div>
            <p className="text-gray-500 text-sm mt-1 max-w-[15rem]">Specialized fit for the unique needs of agencies and SaaS companies.</p>
          </div>
        </div>
      </Reveal>

      {/* Final CTA band */}
      <Reveal as="section" className="w-full">
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 px-8 py-14 sm:px-14 text-center shadow-lg">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">
              Ready to build in the GoHighLevel ecosystem?
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto mb-8">
              Post a role to reach specialists who already know GHL — or browse openings and take the next step in your GoHighLevel career.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/post-job"
                className="press inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-white text-blue-600 font-semibold text-base shadow hover:bg-blue-50 transition-colors outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Post a Job <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/jobs"
                className="press inline-flex items-center justify-center px-6 py-3 rounded-md border border-white/70 text-white font-semibold text-base hover:bg-white/10 transition-colors outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <Footer />
    </div>
  );
}
