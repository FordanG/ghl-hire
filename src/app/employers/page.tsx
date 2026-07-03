import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  Users,
  Target,
  Clock,
  TrendingUp,
  Shield,
  CheckCircle,
  Star,
  FileText,
  ClipboardList,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/ui/Reveal';

export const metadata: Metadata = {
  title: 'For Employers - Hire GoHighLevel Talent',
  description: 'Connect with pre-vetted GoHighLevel professionals. From automation specialists to API developers, find the perfect talent for your agency or SaaS company. 95% match success rate.',
  keywords: ['hire GHL experts', 'GoHighLevel recruitment', 'GHL talent pool', 'marketing automation hiring'],
  openGraph: {
    title: 'For Employers - Hire GoHighLevel Talent',
    description: 'Connect with pre-vetted GoHighLevel professionals for your agency or SaaS company.',
    type: 'website',
    url: 'https://ghlhire.com/employers',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Employers - Hire GoHighLevel Talent',
    description: 'Connect with pre-vetted GoHighLevel professionals for your agency or SaaS company.',
  },
  alternates: {
    canonical: 'https://ghlhire.com/employers',
  },
};

const primaryBtn =
  'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-blue-500 text-white font-semibold text-base shadow hover:bg-blue-600 transition-colors outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 press';
const secondaryBtn =
  'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-gray-200 font-semibold text-base text-gray-900 hover:bg-blue-50 hover:border-blue-500 transition-colors outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 press';

const benefits = [
  {
    icon: Target,
    title: 'Specialized Talent Pool',
    body: 'Access thousands of pre-vetted GoHighLevel professionals with proven experience in marketing automation, funnel building, and CRM management.',
  },
  {
    icon: Clock,
    title: 'Faster Hiring Process',
    body: 'Reduce your time-to-hire with candidates who already understand GoHighLevel, eliminating the need for extensive platform training.',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    body: 'Every candidate is verified for their GoHighLevel expertise, ensuring you get professionals who can contribute from day one.',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    body: 'Scale your operations with talent that understands the nuances of GoHighLevel implementations and client success strategies.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    body: 'Our team provides personalized assistance throughout your hiring process, ensuring you find the perfect match for your needs.',
  },
  {
    icon: Star,
    title: 'Premium Experience',
    body: 'Enjoy a streamlined, professional hiring experience designed specifically for the GoHighLevel ecosystem.',
  },
];

const employerFeatures = [
  {
    icon: FileText,
    title: 'Job Postings',
    body: 'Publish roles across your agency or SaaS and keep them live while you hire — start with your first posting free.',
  },
  {
    icon: Star,
    title: 'Featured Listings',
    body: 'Boost priority roles to the top of search so the strongest GoHighLevel candidates see them first.',
  },
  {
    icon: ClipboardList,
    title: 'Applicant Tracking',
    body: 'Review, shortlist, and manage every applicant from one organized dashboard built for hiring teams.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    body: 'Track views, applications, and conversion on every listing so you always know what is working.',
  },
];

const steps = [
  {
    title: 'Post Your Job',
    body: 'Create a detailed job posting with your specific GoHighLevel requirements, budget, and timeline.',
  },
  {
    title: 'Review Candidates',
    body: 'Browse through qualified candidates or let our AI matching system recommend the best fits for your role.',
  },
  {
    title: 'Make Your Hire',
    body: 'Interview your top choices and make an offer. We’ll help facilitate the entire process from start to finish.',
  },
];

const testimonials = [
  {
    quote:
      'GHL Hire helped us find the perfect GoHighLevel specialist in just 3 days. The quality of candidates was exceptional.',
    name: 'Sarah Johnson',
    role: 'CEO, Marketing Pro Agency',
  },
  {
    quote:
      'The platform’s focus on GoHighLevel talent made all the difference. We found developers who understood our needs immediately.',
    name: 'Mike Chen',
    role: 'CTO, AutomateCore',
  },
  {
    quote:
      'Outstanding service and results. GHL Hire has become our go-to platform for all GoHighLevel hiring needs.',
    name: 'Lisa Rodriguez',
    role: 'Director, Scale Solutions',
  },
];

const stats = [
  { value: '10,000+', label: 'GHL Professionals' },
  { value: '500+', label: 'Companies Hiring' },
  { value: '95%', label: 'Match Success Rate' },
  { value: '48hrs', label: 'Average Hire Time' },
];

const planTiers = ['Free', 'Basic', 'Premium'];

export default function EmployersPage() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto w-full pt-16 md:pt-20 pb-16 px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-5 fade-in fade-in-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true" />
              Built for the GoHighLevel ecosystem
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4 fade-in fade-in-2">
              Hire the Best <span className="text-blue-500">GoHighLevel</span> Talent
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 mb-8 fade-in fade-in-3">
              Connect with pre-vetted GoHighLevel professionals who understand your platform inside and out. From automation specialists to API developers, find the perfect talent for your agency or SaaS company.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 fade-in fade-in-4">
              <Link href="/post-job" className={primaryBtn}>
                Post a Job
              </Link>
              <Link href="#pricing" className={secondaryBtn}>
                View Pricing
              </Link>
            </div>
            <p className="mt-5 text-sm text-gray-400 fade-in fade-in-5">
              Start free · Post your first job in minutes · No setup fees
            </p>
          </div>

          <div className="fade-in fade-in-3">
            <Image
              src="/hero-illustration.png"
              alt="Employers reviewing GoHighLevel candidate profiles on GHL Hire"
              width={1376}
              height={768}
              priority
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose GHL Hire */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Why Choose GHL Hire for Your Hiring Needs?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We specialize exclusively in GoHighLevel talent, ensuring you connect with professionals who truly understand your platform and business needs.
          </p>
        </Reveal>

        <Reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center p-6">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-gray-600">{body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Everything you need to hire (mirrors plan capabilities) */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4">
              Everything You Need to Hire
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              A complete toolkit for GoHighLevel hiring — from posting the role to tracking every applicant and measuring what drives the best candidates.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {employerFeatures.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                <div className="h-full bg-white border border-gray-200 rounded-xl p-6 flex items-start gap-4 hover-lift">
                  <div className="bg-blue-50 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
                    <p className="text-gray-600">{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">How It Works</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Our simple, three-step process gets you connected with top GoHighLevel talent quickly and efficiently.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
              <div className="text-center">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="max-w-6xl mx-auto w-full px-4 py-16">
        <Reveal className="rounded-2xl border border-gray-200 bg-gradient-to-b from-blue-50 to-white p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Pricing That Scales With Your Hiring
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Start free with your first job posting. Upgrade to Basic or Premium for featured listings, advanced analytics, and AI-powered screening as your team grows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {planTiers.map((tier) => (
              <span
                key={tier}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 font-medium text-sm"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                {tier}
              </span>
            ))}
          </div>
          <Link href="/pricing" className={primaryBtn}>
            View Full Pricing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight">What Our Clients Say</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                <div className="h-full bg-white rounded-xl p-6 shadow-sm hover-lift">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, s) => (
                        <Star key={s} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="max-w-6xl mx-auto w-full px-4 py-16">
        <Reveal className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            Ready to Find Your Next GoHighLevel Expert?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of companies who have successfully hired through GHL Hire. Post your first job today and connect with qualified candidates within hours.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/post-job"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 press"
            >
              Post Your First Job
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-400 transition-colors outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 press"
            >
              Talk to Sales
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
