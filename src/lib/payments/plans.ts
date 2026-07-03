/**
 * Subscription plan configuration.
 *
 * Client-safe: no secrets, importable from client components for display.
 * Prices are in USD cents and must match the corresponding plans configured
 * in the Whop dashboard (the Whop plan is the billing source of truth).
 *
 * - NEXT_PUBLIC_WHOP_PLAN_ID_BASIC: Whop plan ID (plan_...) for the Basic plan
 * - NEXT_PUBLIC_WHOP_PLAN_ID_PREMIUM: Whop plan ID (plan_...) for the Premium plan
 */

export interface SubscriptionPlan {
  id: 'free' | 'basic' | 'premium';
  name: string;
  price: number; // USD cents
  priceDisplay: number; // USD
  currency: 'USD';
  interval: 'month';
  whopPlanId: string | null;
  features: string[];
  limits: {
    jobPosts: number; // -1 = unlimited
    featuredJobs: number;
    teamMembers: number; // -1 = unlimited
  };
}

export const subscriptionPlans: Record<SubscriptionPlan['id'], SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    priceDisplay: 0,
    currency: 'USD',
    interval: 'month',
    whopPlanId: null,
    features: [
      '1 job posting',
      'Basic applicant tracking',
      'Email support',
    ],
    limits: {
      jobPosts: 1,
      featuredJobs: 0,
      teamMembers: 1,
    },
  },
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 2999, // $29.99
    priceDisplay: 29.99,
    currency: 'USD',
    interval: 'month',
    whopPlanId: process.env.NEXT_PUBLIC_WHOP_PLAN_ID_BASIC || null,
    features: [
      '5 active job postings',
      'Advanced applicant tracking',
      'Priority email support',
      'Basic analytics',
      '1 featured job listing',
    ],
    limits: {
      jobPosts: 5,
      featuredJobs: 1,
      teamMembers: 3,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 5999, // $59.99
    priceDisplay: 59.99,
    currency: 'USD',
    interval: 'month',
    whopPlanId: process.env.NEXT_PUBLIC_WHOP_PLAN_ID_PREMIUM || null,
    features: [
      'Unlimited job postings',
      'Advanced analytics & insights',
      '5 featured job listings',
      'Priority support',
      'AI-powered tools',
      'Unlimited team members',
    ],
    limits: {
      jobPosts: -1, // Unlimited
      featuredJobs: 5,
      teamMembers: -1, // Unlimited
    },
  },
};

export function getPlanById(planId: string): SubscriptionPlan | null {
  return subscriptionPlans[planId as SubscriptionPlan['id']] || null;
}

/**
 * Map a Whop plan ID (plan_...) back to our internal plan. Used by the webhook
 * to attribute payments when metadata is missing.
 */
export function getPlanByWhopPlanId(whopPlanId: string | null | undefined): SubscriptionPlan | null {
  if (!whopPlanId) return null;
  return (
    Object.values(subscriptionPlans).find((plan) => plan.whopPlanId === whopPlanId) || null
  );
}

export function formatPriceForDisplay(amount: number, currency: string = 'USD'): string {
  if (currency === 'PHP') {
    return `₱${amount.toLocaleString('en-PH')}`;
  }
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function canPostJob(currentJobCount: number, planId: string): boolean {
  const plan = getPlanById(planId) || subscriptionPlans.free;
  if (plan.limits.jobPosts === -1) return true; // Unlimited
  return currentJobCount < plan.limits.jobPosts;
}

export function canAddTeamMember(currentMemberCount: number, planId: string): boolean {
  const plan = getPlanById(planId) || subscriptionPlans.free;
  if (plan.limits.teamMembers === -1) return true; // Unlimited
  return currentMemberCount < plan.limits.teamMembers;
}
