import { NextRequest, NextResponse } from 'next/server';
import {
  webhooks,
  getPlanByPolarProductId,
  type PolarOrder,
  type PolarSubscription,
} from '@/lib/payments/polar';
import { getPlanById, type SubscriptionPlan } from '@/lib/payments/plans';
import { createAdminClient } from '@/lib/supabase/admin';

type Admin = ReturnType<typeof createAdminClient>;

/**
 * Polar Webhook Handler
 *
 * Polar is the source of truth for billing state. Two kinds of events matter:
 *
 * - subscription.*  -> mirror the subscription (plan, status, period, cancel
 *                      flag) into our `subscriptions` row. Covers activation,
 *                      renewals, plan changes and cancellations made in the
 *                      Polar customer portal, and revocation.
 * - order.paid      -> record the money: an invoice plus a succeeded
 *                      payment transaction (first purchase and every renewal).
 *
 * Signatures follow Standard Webhooks (webhook-id / webhook-timestamp /
 * webhook-signature headers) and are verified against POLAR_WEBHOOK_SECRET.
 *
 * Register in Polar Dashboard > Settings > Webhooks:
 *   URL: https://<app-url>/api/payments/webhook   Format: Raw
 *   Events: order.paid, subscription.active, subscription.updated,
 *           subscription.canceled, subscription.uncanceled,
 *           subscription.past_due, subscription.revoked
 */
export async function POST(request: NextRequest) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    console.error('POLAR_WEBHOOK_SECRET is not configured');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const body = await request.text();

  let event;
  try {
    event = await webhooks.validateEvent(
      body,
      {
        'webhook-id': request.headers.get('webhook-id') ?? '',
        'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
        'webhook-signature': request.headers.get('webhook-signature') ?? '',
      },
      secret
    );
  } catch (error) {
    if (error instanceof webhooks.PolarWebhookVerificationError) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }
    if (error instanceof webhooks.PolarWebhookUnknownTypeError) {
      // An event type this SDK version doesn't model: acknowledge so Polar
      // doesn't keep retrying something we will never handle.
      return NextResponse.json({ received: true }, { status: 202 });
    }
    console.error('Invalid webhook payload:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  console.log('Polar webhook received:', event.type);

  try {
    switch (event.type) {
      case 'subscription.active':
      case 'subscription.updated':
      case 'subscription.canceled':
      case 'subscription.uncanceled':
      case 'subscription.past_due':
      case 'subscription.revoked':
        await syncSubscription(event.data);
        break;

      case 'order.paid':
        await handleOrderPaid(event.data);
        break;

      default:
        console.log('Unhandled webhook event:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    // Non-2xx makes Polar retry, which is what we want for transient failures
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/** Statuses in which the company keeps its paid plan. */
const ENTITLED_STATUSES = new Set(['active', 'trialing', 'past_due']);

function metadataString(metadata: Record<string, unknown> | null | undefined, key: string) {
  const value = metadata?.[key];
  return typeof value === 'string' && value ? value : null;
}

/**
 * Resolve which company a Polar subscription belongs to: the checkout metadata
 * we attached, then the customer's external ID (also our company UUID), then an
 * existing row already linked to this Polar subscription.
 */
async function resolveCompanyId(
  admin: Admin,
  source: {
    metadata?: Record<string, unknown> | null;
    externalCustomerId?: string | null;
    subscriptionId?: string | null;
  }
): Promise<string | null> {
  const candidate =
    metadataString(source.metadata, 'company_id') || source.externalCustomerId || null;

  if (candidate) {
    // Validate: metadata is ours, but never write against an ID that isn't a
    // real company.
    const { data } = await admin
      .from('companies')
      .select('id')
      .eq('id', candidate)
      .maybeSingle();
    if (data) return data.id;
  }

  if (source.subscriptionId) {
    const { data } = await admin
      .from('subscriptions')
      .select('company_id')
      .eq('provider_subscription_id', source.subscriptionId)
      .maybeSingle()
      .throwOnError();
    if (data) return data.company_id;
  }

  return null;
}

/**
 * Mirror a Polar subscription into our subscriptions row. Idempotent: it
 * writes the state carried by the event, so retries and repeats are harmless.
 */
async function syncSubscription(subscription: PolarSubscription) {
  const admin = createAdminClient();

  const companyId = await resolveCompanyId(admin, {
    metadata: subscription.metadata,
    externalCustomerId: subscription.customer?.external_id,
    subscriptionId: subscription.id,
  });

  if (!companyId) {
    console.error('Cannot attribute subscription to a company:', subscription.id);
    return;
  }

  const { data: current } = await admin
    .from('subscriptions')
    .select('id, provider_subscription_id, plan_type')
    .eq('company_id', companyId)
    .maybeSingle()
    .throwOnError();

  const entitled = ENTITLED_STATUSES.has(subscription.status);

  if (!entitled) {
    // Ended (revoked, canceled and lapsed, unpaid, never completed). Only
    // downgrade if this is the subscription the company is actually on, so a
    // stale event for an old subscription can't strip a newer one.
    if (current?.provider_subscription_id !== subscription.id) {
      console.log('Ignoring ended subscription not linked to company:', subscription.id);
      return;
    }

    const freePlan = getPlanById('free')!;
    const endedAt = subscription.ended_at || new Date().toISOString();

    await admin
      .from('subscriptions')
      .update({
        plan_type: freePlan.id,
        status: 'active',
        provider_subscription_id: null,
        provider_plan_id: null,
        job_post_limit: freePlan.limits.jobPosts,
        featured_job_limit: freePlan.limits.featuredJobs,
        team_member_limit: freePlan.limits.teamMembers,
        price_cents: 0,
        cancel_at_period_end: false,
        canceled_at: subscription.canceled_at || endedAt,
        ended_at: endedAt,
      })
      .eq('id', current.id)
      .throwOnError();

    console.log('Subscription downgraded to free for company:', companyId);
    return;
  }

  // If the company is already on a different live Polar subscription, don't
  // let an event for another one overwrite it.
  if (
    current?.provider_subscription_id &&
    current.provider_subscription_id !== subscription.id &&
    current.plan_type !== 'free' &&
    subscription.status !== 'active'
  ) {
    console.log('Ignoring non-active event for a different subscription:', subscription.id);
    return;
  }

  const plan =
    getPlanByPolarProductId(subscription.product_id) ||
    getPlanById(metadataString(subscription.metadata, 'plan_id') || '');

  if (!plan || plan.id === 'free') {
    console.error('Unknown Polar product for subscription:', subscription.id, subscription.product_id);
    return;
  }

  await admin
    .from('subscriptions')
    .upsert({
      company_id: companyId,
      plan_type: plan.id,
      status: subscription.status === 'past_due' ? 'past_due' : subscription.status,
      provider: 'polar',
      provider_subscription_id: subscription.id,
      provider_customer_id: subscription.customer_id,
      provider_plan_id: subscription.product_id,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      job_post_limit: plan.limits.jobPosts,
      featured_job_limit: plan.limits.featuredJobs,
      team_member_limit: plan.limits.teamMembers,
      price_cents: subscription.amount ?? plan.price,
      currency: (subscription.currency || plan.currency).toUpperCase(),
      billing_interval: plan.interval,
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.cancel_at_period_end ? subscription.canceled_at : null,
      ended_at: null,
    }, {
      onConflict: 'company_id',
    })
    .throwOnError();

  console.log('Subscription synced for company:', companyId, plan.id, subscription.status);
}

/**
 * Record a paid order (first purchase or renewal) as an invoice and a
 * succeeded payment transaction.
 */
async function handleOrderPaid(order: PolarOrder) {
  const admin = createAdminClient();

  // Idempotency: Polar retries webhooks; skip if this order is already recorded.
  // (The unique index on provider_payment_id is the final arbiter for races.)
  const { data: recorded } = await admin
    .from('payment_transactions')
    .select('id')
    .eq('provider_payment_id', order.id)
    .eq('status', 'succeeded')
    .limit(1)
    .throwOnError();

  if (recorded && recorded.length > 0) {
    console.log('Order already processed, skipping:', order.id);
    return;
  }

  const companyId = await resolveCompanyId(admin, {
    metadata: order.metadata,
    externalCustomerId: order.customer?.external_id,
    subscriptionId: order.subscription_id,
  });

  if (!companyId) {
    console.error('Cannot attribute order to a company:', order.id);
    return;
  }

  const plan: SubscriptionPlan | null =
    getPlanByPolarProductId(order.product_id) ||
    getPlanById(metadataString(order.metadata, 'plan_id') || '');

  const isRenewal = order.billing_reason === 'subscription_cycle';
  const description = plan
    ? `${plan.name}${isRenewal ? ' renewal' : ' subscription'}`
    : order.description || 'Subscription payment';

  const amountCents = order.total_amount;
  const currency = (order.currency || 'usd').toUpperCase();
  const paidAt = order.modified_at || order.created_at || new Date().toISOString();
  const periodStart = order.subscription?.current_period_start || paidAt;
  const periodEnd = order.subscription?.current_period_end || paidAt;

  await createPaidInvoice(admin, {
    companyId,
    amountCents,
    currency,
    description,
    paidAt,
    periodStart,
    periodEnd,
    polarOrderId: order.id,
  });

  // Write the transaction last: it is the idempotency marker the guard above
  // checks, so it must only be written once the invoice work is done.
  // The first purchase completes the pending transaction created at checkout;
  // renewals (and anything we can't match) get their own row.
  const transactionId = isRenewal ? null : metadataString(order.metadata, 'transaction_id');

  if (transactionId) {
    const { data: updated } = await admin
      .from('payment_transactions')
      .update({
        status: 'succeeded',
        provider_payment_id: order.id,
        provider_checkout_id: order.checkout_id,
        amount_cents: amountCents,
        currency,
        paid_at: paidAt,
      })
      .eq('id', transactionId)
      .eq('company_id', companyId)
      .in('status', ['pending', 'processing'])
      .select('id')
      .throwOnError();

    if (updated && updated.length > 0) {
      console.log('Order recorded for company:', companyId, order.id);
      return;
    }
  }

  await admin
    .from('payment_transactions')
    .insert([{
      company_id: companyId,
      amount_cents: amountCents,
      currency,
      status: 'succeeded',
      transaction_type: 'subscription',
      reference_number: `POLAR-${order.id}`,
      description,
      provider: 'polar',
      provider_payment_id: order.id,
      provider_checkout_id: isRenewal ? null : order.checkout_id,
      paid_at: paidAt,
      metadata: plan ? { plan_id: plan.id } : {},
    }])
    .throwOnError();

  console.log('Order recorded for company:', companyId, order.id);
}

async function createPaidInvoice(
  admin: Admin,
  options: {
    companyId: string;
    amountCents: number;
    currency: string;
    description: string;
    paidAt: string;
    periodStart: string;
    periodEnd: string;
    polarOrderId: string;
  }
) {
  // Idempotency: skip if this order is already invoiced
  const { data: existing } = await admin
    .from('invoices')
    .select('id')
    .eq('metadata->>polar_order_id', options.polarOrderId)
    .limit(1)
    .throwOnError();

  if (existing && existing.length > 0) {
    console.log('Invoice already exists for order, skipping:', options.polarOrderId);
    return;
  }

  const { data: invoiceNumber, error: numberError } = await admin.rpc('generate_invoice_number');

  if (numberError || !invoiceNumber) {
    console.error('Failed to generate invoice number:', numberError);
    throw numberError || new Error('Failed to generate invoice number');
  }

  await admin
    .from('invoices')
    .insert([{
      company_id: options.companyId,
      invoice_number: invoiceNumber,
      amount_cents: options.amountCents,
      currency: options.currency,
      status: 'paid',
      billing_period_start: options.periodStart,
      billing_period_end: options.periodEnd,
      paid_at: options.paidAt,
      line_items: [{
        description: options.description,
        quantity: 1,
        amount: options.amountCents,
      }],
      metadata: { polar_order_id: options.polarOrderId },
    }])
    .throwOnError();
}
