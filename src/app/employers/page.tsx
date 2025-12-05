import Link from 'next/link';
import { Metadata } from 'next';
import {
  Users,
  Target,
  Clock,
  TrendingUp,
  Shield,
  CheckCircle,
  Star
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function EmployersPage() {
  return (
    <div className="min-h-screen flex flex-col text-gray-900 bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center pt-20 pb-16 px-4 bg-white">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-4 fade-in fade-in-1">
          Hire the Best <span className="text-blue-500">GoHighLevel</span> Talent
        </h1>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8 fade-in fade-in-2">
          Connect with pre-vetted GoHighLevel professionals who understand your platform inside and out. From automation specialists to API developers, find the perfect talent for your agency or SaaS company.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 fade-in fade-in-3">
          <Link 
            href="/post-job" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-500 text-white font-semibold text-base shadow hover:bg-blue-600 transition-colors outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Post a Job
          </Link>
          <Link 
            href="#pricing" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-200 font-semibold text-base hover:bg-blue-50 hover:border-blue-500 transition-colors outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-gray-900"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="fade-in fade-in-1">
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">GHL Professionals</div>
            </div>
            <div className="fade-in fade-in-2">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Companies Hiring</div>
            </div>
            <div className="fade-in fade-in-3">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Match Success Rate</div>
            </div>
            <div className="fade-in fade-in-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">48hrs</div>
              <div className="text-gray-600">Average Hire Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose GHL Hire */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
            Why Choose GHL Hire for Your Hiring Needs?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto fade-in fade-in-2">
            We specialize exclusively in GoHighLevel talent, ensuring you connect with professionals who truly understand your platform and business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6 fade-in fade-in-3">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Specialized Talent Pool</h3>
            <p className="text-gray-600">
              Access thousands of pre-vetted GoHighLevel professionals with proven experience in marketing automation, funnel building, and CRM management.
            </p>
          </div>

          <div className="text-center p-6 fade-in fade-in-4">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Faster Hiring Process</h3>
            <p className="text-gray-600">
              Reduce your time-to-hire with candidates who already understand GoHighLevel, eliminating the need for extensive platform training.
            </p>
          </div>

          <div className="text-center p-6 fade-in fade-in-5">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
            <p className="text-gray-600">
              Every candidate is verified for their GoHighLevel expertise, ensuring you get professionals who can contribute from day one.
            </p>
          </div>

          <div className="text-center p-6 fade-in fade-in-6">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Grow Your Business</h3>
            <p className="text-gray-600">
              Scale your operations with talent that understands the nuances of GoHighLevel implementations and client success strategies.
            </p>
          </div>

          <div className="text-center p-6 fade-in fade-in-1">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
            <p className="text-gray-600">
              Our team provides personalized assistance throughout your hiring process, ensuring you find the perfect match for your needs.
            </p>
          </div>

          <div className="text-center p-6 fade-in fade-in-2">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium Experience</h3>
            <p className="text-gray-600">
              Enjoy a streamlined, professional hiring experience designed specifically for the GoHighLevel ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
              How It Works
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto fade-in fade-in-2">
              Our simple, three-step process gets you connected with top GoHighLevel talent quickly and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center fade-in fade-in-3">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Post Your Job</h3>
              <p className="text-gray-600">
                Create a detailed job posting with your specific GoHighLevel requirements, budget, and timeline.
              </p>
            </div>

            <div className="text-center fade-in fade-in-4">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Review Candidates</h3>
              <p className="text-gray-600">
                Browse through qualified candidates or let our AI matching system recommend the best fits for your role.
              </p>
            </div>

            <div className="text-center fade-in fade-in-5">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Make Your Hire</h3>
              <p className="text-gray-600">
                Interview your top choices and make an offer. We&apos;ll help facilitate the entire process from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto fade-in fade-in-2">
            Choose the plan that works best for your hiring needs. All plans include our full suite of recruiting tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="border border-gray-200 rounded-xl p-8 fade-in fade-in-3">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Basic</h3>
              <div className="text-3xl font-bold text-blue-600 mb-1">$29.99</div>
              <div className="text-gray-500">per job posting</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>30-day job posting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Access to candidate database</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Basic applicant tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Email support</span>
              </li>
            </ul>
            <Link 
              href="/post-job" 
              className="block w-full text-center px-6 py-3 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Professional Plan */}
          <div className="border-2 border-blue-500 rounded-xl p-8 relative fade-in fade-in-4">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Professional</h3>
              <div className="text-3xl font-bold text-blue-600 mb-1">$59.99</div>
              <div className="text-gray-500">per job posting</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>60-day job posting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Premium placement in search</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>AI-powered candidate matching</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Priority support</span>
              </li>
            </ul>
            <Link 
              href="/post-job" 
              className="block w-full text-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="border border-gray-200 rounded-xl p-8 fade-in fade-in-5">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-blue-600 mb-1">Custom</div>
              <div className="text-gray-500">contact for pricing</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Unlimited job postings</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Bulk hiring solutions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>24/7 phone support</span>
              </li>
            </ul>
            <Link 
              href="/contact" 
              className="block w-full text-center px-6 py-3 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm fade-in fade-in-2">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &ldquo;GHL Hire helped us find the perfect GoHighLevel specialist in just 3 days. The quality of candidates was exceptional.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">CEO, Marketing Pro Agency</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm fade-in fade-in-3">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &ldquo;The platform&apos;s focus on GoHighLevel talent made all the difference. We found developers who understood our needs immediately.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Mike Chen</div>
                  <div className="text-sm text-gray-500">CTO, AutomateCore</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm fade-in fade-in-4">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &ldquo;Outstanding service and results. GHL Hire has become our go-to platform for all GoHighLevel hiring needs.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Lisa Rodriguez</div>
                  <div className="text-sm text-gray-500">Director, Scale Solutions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-4 fade-in fade-in-1">
          Ready to Find Your Next GoHighLevel Expert?
        </h2>
        <p className="text-lg text-gray-500 mb-8 fade-in fade-in-2">
          Join hundreds of companies who have successfully hired through GHL Hire. Post your first job today and connect with qualified candidates within hours.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 fade-in fade-in-3">
          <Link 
            href="/post-job" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-blue-500 text-white font-semibold text-base shadow hover:bg-blue-600 transition-colors"
          >
            Post Your First Job
          </Link>
          <Link 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-200 font-semibold text-base hover:bg-gray-50 transition-colors"
          >
            Talk to Sales
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}