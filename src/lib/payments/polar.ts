/**
 * Polar Payments Integration for GHL Hire (server-only)
 *
 * Polar is the merchant of record and hosts the checkout page. For each
 * purchase we create a checkout session via the API so the resulting order and
 * subscription carry metadata (company_id, plan_id, transaction_id) that the
 * webhook uses to activate the subscription. The Polar customer is linked to
 * the company through `external_customer_id` (our company UUID).
 *
 * Documentation: https://polar.sh/docs
 *
 * Required Environment Variables:
 * - POLAR_ACCESS_TOKEN: Organization access token (Settings > Developers)
 * - POLAR_WEBHOOK_SECRET: Signing secret of the webhook endpoint
 * - POLAR_PRODUCT_ID_BASIC / POLAR_PRODUCT_ID_PREMIUM: Polar product IDs
 * - POLAR_ENVIRONMENT: "sandbox" or "production" (default "production").
 *   Sandbox and production have separate tokens, products and webhooks.
 * - NEXT_PUBLIC_APP_URL: Base URL for post-checkout redirects
 */

import { createPolar, webhooks, type Polar } from '@polar-sh/sdk/2026-10';
import { getPlanById, subscriptionPlans, type SubscriptionPlan } from './plans';

export { webhooks };

export type PolarWebhookEvent = Awaited<ReturnType<typeof webhooks.validateEvent>>;
export type PolarOrder = Extract<PolarWebhookEvent, { type: 'order.paid' }>['data'];
export type PolarSubscription = Extract<
  PolarWebhookEvent,
  { type: 'subscription.updated' }
>['data'];

let client: Polar | null = null;

export function getPolarClient(): Polar {
  if (!client) {
    if (!process.env.POLAR_ACCESS_TOKEN) {
      throw new Error('POLAR_ACCESS_TOKEN is not configured');
    }
    client = createPolar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      environment: process.env.POLAR_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production',
    });
  }
  return client;
}

type PaidPlanId = Exclude<SubscriptionPlan['id'], 'free'>;

function polarProductIds(): Record<PaidPlanId, string | undefined> {
  return {
    basic: process.env.POLAR_PRODUCT_ID_BASIC,
    premium: process.env.POLAR_PRODUCT_ID_PREMIUM,
  };
}

/** Polar product ID for one of our paid plans, or null if not configured. */
export function getPolarProductId(planId: string): string | null {
  return polarProductIds()[planId as PaidPlanId] || null;
}

/**
 * Map a Polar product ID back to our internal plan. Used by the webhook, which
 * also covers plan changes the customer makes in the Polar customer portal.
 */
export function getPlanByPolarProductId(
  productId: string | null | undefined
): SubscriptionPlan | null {
  if (!productId) return null;
  const match = Object.entries(polarProductIds()).find(([, id]) => id === productId);
  return match ? subscriptionPlans[match[0] as PaidPlanId] : null;
}

export interface CheckoutMetadata {
  company_id: string;
  plan_id: string;
  transaction_id: string;
  reference_number: string;
  [key: string]: string;
}

/**
 * Create a Polar checkout session and return its hosted checkout URL.
 */
export async function createPolarCheckout(options: {
  planId: string;
  companyId: string;
  customerEmail?: string | null;
  customerName?: string | null;
  metadata: CheckoutMetadata;
  successUrl: string;
  returnUrl: string;
}): Promise<{ checkoutId: string; checkoutUrl: string }> {
  const plan = getPlanById(options.planId);
  if (!plan) {
    throw new Error(`Unknown plan: ${options.planId}`);
  }

  const productId = getPolarProductId(options.planId);
  if (!productId) {
    throw new Error(
      `Plan "${options.planId}" has no Polar product ID configured (set POLAR_PRODUCT_ID_${options.planId.toUpperCase()})`
    );
  }

  const checkout = await getPolarClient().checkouts.create({
    products: [productId],
    external_customer_id: options.companyId,
    customer_email: options.customerEmail || undefined,
    customer_name: options.customerName || undefined,
    metadata: options.metadata,
    success_url: options.successUrl,
    return_url: options.returnUrl,
  });

  return { checkoutId: checkout.id, checkoutUrl: checkout.url };
}

/**
 * Create a short-lived Polar customer portal session for a company. The portal
 * is where customers change plan, update their card, cancel and get receipts.
 */
export async function createPolarPortalUrl(options: {
  companyId: string;
  returnUrl: string;
}): Promise<string> {
  const session = await getPolarClient().customerSessions.create({
    external_customer_id: options.companyId,
    return_url: options.returnUrl,
  });
  return session.customer_portal_url;
}
