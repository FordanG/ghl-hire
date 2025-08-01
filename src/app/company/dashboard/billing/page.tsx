'use client';

import { useState } from 'react';
import { 
  CreditCard,
  Check,
  Download,
  Users,
  Shield,
  AlertCircle,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import CompanyDashboardLayout from '@/components/CompanyDashboardLayout';

export default function BillingPage() {
  const [currentPlan] = useState('professional');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: { monthly: 99, yearly: 990 },
      features: [
        '5 active job postings',
        'Basic applicant tracking',
        'Email support',
        'Standard job visibility',
        'Basic analytics'
      ],
      limits: {
        jobs: 5,
        applications: 100,
        users: 1
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 299, yearly: 2990 },
      popular: true,
      features: [
        '20 active job postings',
        'Advanced applicant tracking',
        'Priority support',
        'Enhanced job visibility',
        'Advanced analytics',
        'Custom branding',
        'Team collaboration'
      ],
      limits: {
        jobs: 20,
        applications: 500,
        users: 5
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 599, yearly: 5990 },
      features: [
        'Unlimited job postings',
        'Full applicant tracking suite',
        'Dedicated support',
        'Premium job visibility',
        'Custom analytics',
        'White-label solution',
        'Unlimited team members',
        'API access',
        'Custom integrations'
      ],
      limits: {
        jobs: 'Unlimited',
        applications: 'Unlimited',
        users: 'Unlimited'
      }
    }
  ];

  const billingHistory = [
    {
      id: '1',
      date: '2025-01-01',
      description: 'Professional Plan - Monthly',
      amount: 299,
      status: 'paid',
      invoice: 'INV-2025-001'
    },
    {
      id: '2',
      date: '2024-12-01',
      description: 'Professional Plan - Monthly',
      amount: 299,
      status: 'paid',
      invoice: 'INV-2024-012'
    },
    {
      id: '3',
      date: '2024-11-01',
      description: 'Professional Plan - Monthly',
      amount: 299,
      status: 'paid',
      invoice: 'INV-2024-011'
    }
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true
    }
  ];

  const usage = {
    jobPostings: { used: 8, limit: 20 },
    applications: { used: 234, limit: 500 },
    teamMembers: { used: 3, limit: 5 }
  };

  const PlanCard = ({ plan, isActive }: { plan: typeof plans[0]; isActive: boolean }) => (
    <div className={`relative border-2 rounded-lg p-6 ${
      isActive 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-600 text-white px-3 py-1 text-sm font-medium rounded-full">
            Most Popular
          </span>
        </div>
      )}
      {isActive && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-600 text-white px-3 py-1 text-sm font-medium rounded-full">
            Current Plan
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-900">
            ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.yearly / 12)}
          </span>
          <span className="text-gray-600">/month</span>
          {billingCycle === 'yearly' && (
            <div className="text-sm text-green-600 font-medium">
              Save ${plan.price.monthly * 12 - plan.price.yearly} per year
            </div>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center gap-3">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-gray-900">{plan.limits.jobs}</p>
            <p className="text-xs text-gray-500">Jobs</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{plan.limits.applications}</p>
            <p className="text-xs text-gray-500">Applications</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{plan.limits.users}</p>
            <p className="text-xs text-gray-500">Users</p>
          </div>
        </div>
      </div>

      <button
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          isActive
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        disabled={isActive}
      >
        {isActive ? 'Current Plan' : 'Upgrade to ' + plan.name}
      </button>
    </div>
  );

  return (
    <CompanyDashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Billing & Subscription</h1>
            <p className="text-gray-600 mt-1">Manage your subscription, billing, and payment methods</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Download Invoices
            </button>
          </div>
        </div>

        {/* Current Plan & Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Professional
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Briefcase className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-gray-900">{usage.jobPostings.used}</p>
                <p className="text-sm text-gray-600">of {usage.jobPostings.limit} job postings</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(usage.jobPostings.used / usage.jobPostings.limit) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-gray-900">{usage.applications.used}</p>
                <p className="text-sm text-gray-600">of {usage.applications.limit} applications</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(usage.applications.used / usage.applications.limit) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-semibold text-gray-900">{usage.teamMembers.used}</p>
                <p className="text-sm text-gray-600">of {usage.teamMembers.limit} team members</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${(usage.teamMembers.used / usage.teamMembers.limit) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next billing date</p>
                <p className="font-medium text-gray-900">February 1, 2025</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium text-gray-900">$299.00</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {method.brand} •••• {method.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <Plus className="w-4 h-4" />
              Add Payment Method
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Choose Your Plan</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Monthly</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-gray-600">
                Yearly <span className="text-green-600 font-medium">(Save 17%)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                isActive={plan.id === currentPlan}
              />
            ))}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
            <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
              View All Invoices
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-900">{item.date}</td>
                    <td className="py-4 px-4 text-gray-900">{item.description}</td>
                    <td className="py-4 px-4 text-gray-900">${item.amount}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Paid
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center gap-1">
                        {item.invoice}
                        <Download className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Billing Settings */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Auto-renewal</h4>
                <p className="text-sm text-gray-600">Automatically renew your subscription</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Email Invoices</h4>
                <p className="text-sm text-gray-600">Receive invoices via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Cancel Subscription</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Canceling your subscription will downgrade your account to the free plan at the end of your current billing period.
            </p>
            <button className="mt-4 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors">
              Cancel Subscription
            </button>
          </div>
        </div>
      </div>
    </CompanyDashboardLayout>
  );
}