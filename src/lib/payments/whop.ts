/**
 * Whop Payments Integration for GHL Hire (server-only)
 *
 * Whop hosts the checkout page. For each purchase we create a checkout
 * configuration via the API so the payment carries metadata (company_id,
 * plan_id, transaction_id) that the webhook uses to activate the subscription.
 *
 * Documentation: https://docs.whop.com/payments
 *
 * Required Environment Variables:
 * - WHOP_API_KEY: API key from Whop Dashboard > Developer
 * - WHOP_WEBHOOK_SECRET: Signing secret from Whop Dashboard > Developer > Webhooks
 * - NEXT_PUBLIC_APP_URL: Base URL for post-checkout redirects
 */

import { Whop } from '@whop/sdk';
import { getPlanById } from './plans';

let client: Whop | null = null;

export function getWhopClient(): Whop {
  if (!client) {
    if (!process.env.WHOP_API_KEY) {
      throw new Error('WHOP_API_KEY is not configured');
    }
    client = new Whop({
      apiKey: process.env.WHOP_API_KEY,
      // The SDK expects the webhook secret base64-encoded
      webhookKey: process.env.WHOP_WEBHOOK_SECRET
        ? btoa(process.env.WHOP_WEBHOOK_SECRET)
        : undefined,
    });
  }
  return client;
}

export type WhopWebhookEvent = ReturnType<Whop['webhooks']['unwrap']>;
export type WhopPayment = Extract<WhopWebhookEvent, { type: 'payment.succeeded' }>['data'];
export type WhopMembership = Extract<WhopWebhookEvent, { type: 'membership.activated' }>['data'];

export interface CheckoutMetadata {
  company_id: string;
  plan_id: string;
  transaction_id: string;
  [key: string]: unknown;
}

/**
 * Create a Whop checkout configuration and return its hosted checkout link.
 */
export async function createWhopCheckout(options: {
  planId: string;
  metadata: CheckoutMetadata;
  redirectUrl: string;
}): Promise<{ checkoutConfigId: string; purchaseUrl: string }> {
  const plan = getPlanById(options.planId);

  if (!plan) {
    throw new Error(`Unknown plan: ${options.planId}`);
  }
  if (!plan.whopPlanId) {
    throw new Error(
      `Plan "${options.planId}" has no Whop plan ID configured (set NEXT_PUBLIC_WHOP_PLAN_ID_${options.planId.toUpperCase()})`
    );
  }

  const config = await getWhopClient().checkoutConfigurations.create({
    plan_id: plan.whopPlanId,
    mode: 'payment',
    metadata: options.metadata,
    redirect_url: options.redirectUrl,
  });

  return {
    checkoutConfigId: config.id,
    purchaseUrl: config.purchase_url,
  };
}
