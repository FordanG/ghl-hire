'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Briefcase,
  Download,
  AlertCircle,
  Loader2,
  ArrowRight,
  Calendar,
  FileText,
  Sparkles,
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, Subscription } from '@/lib/supabase';
import { getPlanById, formatPriceForDisplay } from '@/lib/payments/plans';

interface Invoice {
  id: string;
  invoice_number: string;
  amount_cents: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string | null;
}

export default function BillingPage() {
  const router = useRouter();
  const { user, company, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeJobs, setActiveJobs] = useState(0);

  // Redirect signed-out / non-company users (mirrors sibling dashboard pages)
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
    if (!authLoading && !company) {
      router.push('/signup');
    }
  }, [authLoading, user, company, router]);

  useEffect(() => {
    if (company) {
      loadBillingData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company]);

  const loadBillingData = async () => {
    if (!company) return;

    setLoading(true);

    try {
      // Subscription row (every company has one via DB trigger)
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('company_id', company.id)
        .maybeSingle();

      setSubscription((sub as Subscription) ?? null);

      // Invoices, most recent first
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select(
          'id, invoice_number, amount_cents, currency, status, paid_at, created_at'
        )
        .eq('company_id', company.id)
        .order('created_at', { ascending: false });

      setInvoices((invoiceData as Invoice[]) ?? []);

      // Current count of active jobs
      const { count } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('status', 'active');

      setActiveJobs(count ?? 0);
    } catch (err) {
      console.error('Error loading billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSubStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
        return 'bg-red-100 text-red-800';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'open':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'void':
      case 'uncollectible':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <CompanyDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading billing...</span>
          </div>
        </div>
      </CompanyDashboardLayout>
    );
  }

  if (!company) {
    return null;
  }

  // Derive plan details. Prefer canonical config, fall back to the stored row.
  const planType = subscription?.plan_type ?? 'free';
  const plan = getPlanById(planType);
  const isFree = planType === 'free';
  const planName =
    plan?.name ??
    `${planType.charAt(0).toUpperCase()}${planType.slice(1)} Plan`;

  const priceCents = plan ? plan.price : subscription?.price_cents ?? 0;
  const currency = plan ? plan.currency : subscription?.currency ?? 'USD';
  const priceLabel = isFree
    ? 'Free'
    : `${formatPriceForDisplay(priceCents / 100, currency)}/month`;

  const status = subscription?.status ?? 'active';
  const renewalDate = formatDate(subscription?.current_period_end ?? null);
  const cancelAtPeriodEnd = subscription?.cancel_at_period_end ?? false;

  const jobLimit =
    subscription?.job_post_limit ?? plan?.limits.jobPosts ?? 1;
  const unlimitedJobs = jobLimit === -1;
  const usagePct = unlimitedJobs
    ? 0
    : Math.min(100, jobLimit > 0 ? (activeJobs / jobLimit) * 100 : 0);

  return (
    <CompanyDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Billing &amp; Subscription
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your subscription and view your billing history
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {isFree ? 'Upgrade Plan' : 'Change Plan'}
          </Link>
        </div>

        {/* Cancellation notice */}
        {cancelAtPeriodEnd && (
          <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900">
                Your subscription is set to cancel
              </p>
              <p className="text-sm text-amber-800 mt-1">
                {renewalDate
                  ? `Your plan remains active until ${renewalDate}, after which you'll be moved to the Free plan.`
                  : "Your plan will be moved to the Free plan at the end of the current period."}
              </p>
            </div>
          </div>
        )}

        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Plan */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Current Plan
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getSubStatusBadge(
                  status
                )}`}
              >
                {status.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {planName}
                </p>
                <p className="text-gray-600">{priceLabel}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
              <Calendar className="w-4 h-4 text-gray-400" />
              {isFree || !renewalDate ? (
                <span>Never expires</span>
              ) : (
                <span>
                  {cancelAtPeriodEnd ? 'Access ends' : 'Renews'} on{' '}
                  <span className="font-medium text-gray-900">
                    {renewalDate}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Usage */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Usage
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active job postings</p>
                <p className="text-xl font-semibold text-gray-900">
                  {activeJobs}
                  <span className="text-sm font-normal text-gray-500">
                    {' '}
                    of {unlimitedJobs ? 'Unlimited' : jobLimit}
                  </span>
                </p>
              </div>
            </div>
            {!unlimitedJobs && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    usagePct >= 100 ? 'bg-red-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            )}
            {!unlimitedJobs && activeJobs >= jobLimit && (
              <p className="text-xs text-gray-500 mt-3">
                You&apos;ve reached your plan limit.{' '}
                <Link
                  href="/pricing"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Upgrade
                </Link>{' '}
                to post more jobs.
              </p>
            )}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Billing History
            </h3>
          </div>

          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Invoice
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-100"
                    >
                      <td className="py-4 px-4 text-gray-900 font-medium">
                        {invoice.invoice_number}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {formatDate(invoice.paid_at ?? invoice.created_at) ??
                          '—'}
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {formatPriceForDisplay(
                          invoice.amount_cents / 100,
                          invoice.currency
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getInvoiceStatusBadge(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <a
                          href={`/api/invoices/${invoice.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-500 text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No invoices yet</p>
              <p className="text-sm mt-1">
                Invoices will appear here after your first payment.
              </p>
            </div>
          )}
        </div>

        {/* Manage plan CTA */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Need a different plan?
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Compare plans and upgrade or downgrade anytime from the pricing
              page.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            View Plans
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}
