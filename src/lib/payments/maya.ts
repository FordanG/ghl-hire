/**
 * Maya Payments Integration for GHL Hire
 *
 * Maya (formerly PayMaya) is the payment processor for the Philippines
 * Documentation: https://developers.maya.ph/
 *
 * Required Environment Variables:
 * - MAYA_PUBLIC_KEY: Your Maya public API key
 * - MAYA_SECRET_KEY: Your Maya secret API key
 * - MAYA_WEBHOOK_SECRET: Secret for webhook signature verification
 * - NEXT_PUBLIC_APP_URL: Your app's base URL for redirects
 */

export interface MayaCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface MayaCheckoutItem {
  name: string;
  quantity: number;
  amount: {
    value: number; // Amount in cents (e.g., 4999 for $49.99)
    currency: string; // 'PHP' or 'USD'
  };
  totalAmount: {
    value: number;
    currency: string;
  };
}

export interface MayaCheckoutSession {
  id?: string;
  totalAmount: {
    value: number;
    currency: string;
  };
  buyer: MayaCustomer;
  items: MayaCheckoutItem[];
  redirectUrl: {
    success: string;
    failure: string;
    cancel: string;
  };
  requestReferenceNumber: string; // Unique reference for your system
  metadata?: Record<string, any>;
}

export interface MayaSubscription {
  id?: string;
  planId: string;
  customerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

/**
 * Maya API Client
 */
class MayaClient {
  private publicKey: string;
  private secretKey: string;
  private baseUrl: string;

  constructor() {
    this.publicKey = process.env.MAYA_PUBLIC_KEY || '';
    this.secretKey = process.env.MAYA_SECRET_KEY || '';
    this.baseUrl = process.env.MAYA_API_URL || 'https://pg-sandbox.paymaya.com';
  }

  /**
   * Get authorization header
   */
  private getAuthHeader(useSecret = false): string {
    const key = useSecret ? this.secretKey : this.publicKey;
    return 'Basic ' + Buffer.from(key + ':').toString('base64');
  }

  /**
   * Create a checkout session
   */
  async createCheckoutSession(session: MayaCheckoutSession): Promise<{ checkoutId: string; redirectUrl: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/checkout/v1/checkouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(true),
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Maya API Error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();

      return {
        checkoutId: data.checkoutId,
        redirectUrl: data.redirectUrl,
      };
    } catch (error) {
      console.error('Maya checkout session creation failed:', error);
      throw error;
    }
  }

  /**
   * Get checkout session status
   */
  async getCheckoutStatus(checkoutId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/checkout/v1/checkouts/${checkoutId}`, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(true),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get checkout status');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get checkout status:', error);
      throw error;
    }
  }

  /**
   * Create a subscription plan
   */
  async createSubscriptionPlan(plan: {
    name: string;
    description: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  }): Promise<{ planId: string }> {
    try {
      // Note: Maya's subscription API may vary - adjust according to actual API
      const response = await fetch(`${this.baseUrl}/subscriptions/v1/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(true),
        },
        body: JSON.stringify(plan),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Maya API Error: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      return { planId: data.id };
    } catch (error) {
      console.error('Failed to create subscription plan:', error);
      throw error;
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(subscription: {
    planId: string;
    customerId: string;
    paymentMethodId: string;
  }): Promise<MayaSubscription> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/v1/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader(true),
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Maya API Error: ${JSON.stringify(error)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/v1/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(true),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const webhookSecret = process.env.MAYA_WEBHOOK_SECRET || '';

    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    return computedSignature === signature;
  }
}

// Export singleton instance
export const mayaClient = new MayaClient();

/**
 * Subscription Plans Configuration
 */
export const subscriptionPlans = {
  free: {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: 'USD',
    interval: 'month' as const,
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
    price: 4999, // $49.99 in cents
    currency: 'USD',
    interval: 'month' as const,
    features: [
      '5 active job postings',
      'Advanced applicant tracking',
      'Priority email support',
      'Basic analytics',
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
    price: 14999, // $149.99 in cents
    currency: 'USD',
    interval: 'month' as const,
    features: [
      'Unlimited job postings',
      'Advanced analytics & insights',
      'Featured job listings',
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

/**
 * Helper functions
 */

/**
 * Format amount for Maya (convert dollars to cents)
 */
export function formatAmountForMaya(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Format amount for display (convert cents to dollars)
 */
export function formatAmountForDisplay(amountInCents: number): string {
  return `$${(amountInCents / 100).toFixed(2)}`;
}

/**
 * Get plan by ID
 */
export function getPlanById(planId: string) {
  return subscriptionPlans[planId as keyof typeof subscriptionPlans] || subscriptionPlans.free;
}

/**
 * Check if company can post more jobs
 */
export function canPostJob(currentJobCount: number, planId: string): boolean {
  const plan = getPlanById(planId);
  if (plan.limits.jobPosts === -1) return true; // Unlimited
  return currentJobCount < plan.limits.jobPosts;
}

/**
 * Check if company can add more team members
 */
export function canAddTeamMember(currentMemberCount: number, planId: string): boolean {
  const plan = getPlanById(planId);
  if (plan.limits.teamMembers === -1) return true; // Unlimited
  return currentMemberCount < plan.limits.teamMembers;
}
