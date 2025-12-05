'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, Zap, TrendingUp, Sparkles } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'PHP',
    interval: 'forever',
    description: 'Perfect for trying out GHL Hire',
    icon: Zap,
    color: 'gray',
    features: [
      { name: '1 active job posting', included: true },
      { name: 'Basic applicant tracking', included: true },
      { name: 'Email support', included: true },
      { name: 'Job posting analytics', included: false },
      { name: 'Featured listings', included: false },
      { name: 'Priority support', included: false },
      { name: 'AI-powered tools', included: false },
      { name: 'Team collaboration', included: false },
    ],
    limits: {
      jobPosts: 1,
      featuredJobs: 0,
      teamMembers: 1,
    },
    cta: 'Get Started',
    highlighted: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 2499,
    currency: 'PHP',
    interval: 'month',
    description: 'Great for small teams and growing companies',
    icon: TrendingUp,
    color: 'blue',
    features: [
      { name: '5 active job postings', included: true },
      { name: 'Advanced applicant tracking', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Job posting analytics', included: true },
      { name: '1 featured job listing', included: true },
      { name: 'Up to 3 team members', included: true },
      { name: 'AI-powered tools', included: false },
      { name: 'Unlimited team members', included: false },
    ],
    limits: {
      jobPosts: 5,
      featuredJobs: 1,
      teamMembers: 3,
    },
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 7499,
    currency: 'PHP',
    interval: 'month',
    description: 'For companies serious about hiring top GHL talent',
    icon: Sparkles,
    color: 'purple',
    features: [
      { name: 'Unlimited job postings', included: true },
      { name: 'Advanced analytics & insights', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced job analytics', included: true },
      { name: '5 featured job listings', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'AI-powered applicant screening', included: true },
      { name: 'AI resume analysis', included: true },
    ],
    limits: {
      jobPosts: -1, // Unlimited
      featuredJobs: 5,
      teamMembers: -1, // Unlimited
    },
    cta: 'Start Free Trial',
    highlighted: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (planId === 'free') {
      router.push('/company/dashboard');
      return;
    }

    try {
      setLoading(planId);

      // Get company ID
      const companyResponse = await fetch('/api/user/company');
      const companyData = await companyResponse.json();

      if (!companyData.company) {
        alert('Please create a company profile first');
        router.push('/company/dashboard/profile');
        return;
      }

      // Create checkout session
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          companyId: companyData.company.id,
          successUrl: `${window.location.origin}/company/billing/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Maya checkout
      window.location.href = data.redirectUrl;

    } catch (error: any) {
      console.error('Error selecting plan:', error);
      alert(error.message || 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Choose the perfect plan for your hiring needs. All plans include a 14-day free trial.
          </p>

          {/* Billing Toggle
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingInterval === 'month'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:text-blue-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingInterval === 'year'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:text-blue-100'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
          */}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const displayPrice = billingInterval === 'year' ? plan.price * 12 * 0.8 : plan.price;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                  plan.highlighted ? 'ring-2 ring-blue-600 scale-105' : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-blue-600 text-white text-center py-2 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8">
                  <div className={`w-12 h-12 rounded-lg bg-${plan.color}-100 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.currency === 'PHP' ? '₱' : '$'}{displayPrice.toLocaleString()}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-gray-600">
                        /{billingInterval === 'year' ? 'year' : 'month'}
                      </span>
                    )}
                    {plan.interval === 'forever' && (
                      <span className="text-gray-600"> forever</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={loading === plan.id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-8 ${
                      plan.highlighted
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading === plan.id ? 'Loading...' : plan.cta}
                  </button>

                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, GCash, and PayMaya through our secure payment processor.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes! All paid plans include a 14-day free trial. No credit card required to start.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Absolutely. Cancel your subscription anytime with no penalties. You'll retain access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 sm:p-12 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to hire top GHL talent?</h2>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of companies finding and hiring the best GoHighLevel professionals
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-8 py-3 min-h-[44px] rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="bg-blue-500 text-white px-8 py-3 min-h-[44px] rounded-lg font-semibold hover:bg-blue-400 transition-colors flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
