import { NextRequest, NextResponse } from 'next/server';
import { getWhopClient, WhopPayment, WhopMembership } from '@/lib/payments/whop';
import { getPlanById, getPlanByWhopPlanId, SubscriptionPlan } from '@/lib/payments/plans';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Whop Webhook Handler
 *
 * Receives payment and membership notifications from Whop. Signatures are
 * verified by the SDK (webhook-id / webhook-timestamp / webhook-signature
 * headers against WHOP_WEBHOOK_SECRET).
 *
 * Register in Whop Dashboard > Developer > Webhooks:
 *   URL: https://<app-url>/api/payments/webhook
 *   Events: payment.succeeded, payment.failed, membership.deactivated,
 *           membership.cancel_at_period_end_changed
 */
export async function POST(request: NextRequest) {
  const body = await request.text();

  let event;
  try {
    event = getWhopClient().webhooks.unwrap(body, {
      headers: Object.fromEntries(request.headers),
    });
  } catch (error) {
    console.error('Invalid webhook signature:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 }
    );
  }

  console.log('Whop webhook received:', event.type);

  try {
    switch (event.type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event.data);
        break;

      case 'membership.deactivated':
        await handleMembershipDeactivated(event.data);
        break;

      case 'membership.cancel_at_period_end_changed':
        await handleCancelAtPeriodEndChanged(event.data);
        break;

      default:
        console.log('Unhandled webhook event:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    // Non-2xx makes Whop retry, which is what we want for transient failures
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Activate (or renew) a subscription after a successful payment.
 */
async function handlePaymentSucceeded(payment: WhopPayment) {
  const admin = createAdminClient();
  const metadata = (payment.metadata || {}) as Record<string, string>;

  // Locate our pending transaction: prefer the transaction_id we attached as
  // checkout metadata, fall back to the checkout configuration ID.
  let transaction = null;

  if (metadata.transaction_id) {
    const { data } = await admin
      .from('payment_transactions')
      .select('*')
      .eq('id', metadata.transaction_id)
      .maybeSingle()
      .throwOnError();
    transaction = data;
  }

  if (!transaction && payment.checkout_configuration_id) {
    const { data } = await admin
      .from('payment_transactions')
      .select('*')
      .eq('provider_checkout_id', payment.checkout_configuration_id)
      .maybeSingle()
      .throwOnError();
    transaction = data;
  }

  // Idempotency: Whop retries webhooks; skip if this payment is already recorded
  if (transaction?.status === 'succeeded') {
    if (transaction.provider_payment_id === payment.id) {
      console.log('Payment already processed, skipping:', payment.id);
      return;
    }
    // Same checkout metadata but a new payment ID: this is a renewal charge.
    // Don't overwrite the original transaction; record it separately.
    await handleRenewalByMembership(payment);
    return;
  }

  const transactionPlanId = (transaction?.metadata as Record<string, string> | null)?.plan_id;
  const plan =
    getPlanById(metadata.plan_id || '') ||
    getPlanByWhopPlanId(payment.plan?.id) ||
    (transactionPlanId ? getPlanById(transactionPlanId) : null);

  const companyId = metadata.company_id || transaction?.company_id;

  if (!transaction && !companyId && payment.membership?.id) {
    // Renewal payments may arrive without our metadata: match the membership
    // to an existing subscription instead.
    await handleRenewalByMembership(payment);
    return;
  }

  if (!plan || !companyId) {
    console.error('Cannot attribute payment - missing plan or company:', payment.id);
    return;
  }

  const now = new Date();
  const periodEnd = addOneMonth(now);
  const { amountCents, currency } = chargedAmount(payment, plan);

  await activateSubscription(admin, {
    companyId,
    plan,
    membershipId: payment.membership?.id || null,
    customerId: payment.member?.id || null,
    periodStart: now,
    periodEnd,
  });

  await createPaidInvoice(admin, {
    companyId,
    amountCents,
    currency,
    description: plan.name,
    paidAt: payment.paid_at || now.toISOString(),
    periodStart: now,
    periodEnd,
    whopPaymentId: payment.id,
  });

  // Mark the transaction succeeded last: it is the idempotency marker the
  // replay guard above checks, so it must only be written once the
  // subscription and invoice work is actually done.
  if (transaction) {
    await admin
      .from('payment_transactions')
      .update({
        status: 'succeeded',
        provider_payment_id: payment.id,
        amount_cents: amountCents,
        currency,
        paid_at: payment.paid_at || now.toISOString(),
      })
      .eq('id', transaction.id)
      .throwOnError();
  } else {
    await admin
      .from('payment_transactions')
      .insert([{
        company_id: companyId,
        amount_cents: amountCents,
        currency,
        status: 'succeeded',
        transaction_type: 'subscription',
        reference_number: `WHOP-${payment.id}`,
        description: `${plan.name} subscription`,
        provider: 'whop',
        provider_payment_id: payment.id,
        provider_checkout_id: payment.checkout_configuration_id,
        paid_at: payment.paid_at || now.toISOString(),
        metadata: { plan_id: plan.id },
      }])
      .throwOnError();
  }

  console.log('Subscription activated for company:', companyId);
}

/**
 * Renewal payment with no checkout metadata: extend the subscription matched
 * by its Whop membership ID.
 */
async function handleRenewalByMembership(payment: WhopPayment) {
  const admin = createAdminClient();
  const membershipId = payment.membership?.id;

  if (!membershipId) {
    console.error('Renewal payment has no membership to match:', payment.id);
    return;
  }

  // Idempotency: Whop retries webhooks; skip if this payment is already recorded
  const { data: existing } = await admin
    .from('payment_transactions')
    .select('id')
    .eq('provider_payment_id', payment.id)
    .eq('status', 'succeeded')
    .limit(1)
    .throwOnError();

  if (existing && existing.length > 0) {
    console.log('Renewal payment already processed, skipping:', payment.id);
    return;
  }

  const { data: subscription } = await admin
    .from('subscriptions')
    .select('*')
    .eq('provider_subscription_id', membershipId)
    .maybeSingle()
    .throwOnError();

  if (!subscription) {
    console.error('No subscription found for membership:', membershipId);
    return;
  }

  const plan = getPlanById(subscription.plan_type) || getPlanByWhopPlanId(payment.plan?.id);
  if (!plan) {
    console.error('Unknown plan for renewal:', subscription.plan_type);
    return;
  }

  const now = new Date();
  const periodEnd = addOneMonth(now);
  const { amountCents, currency } = chargedAmount(payment, plan);

  await admin
    .from('subscriptions')
    .update({
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
    })
    .eq('id', subscription.id)
    .throwOnError();

  await createPaidInvoice(admin, {
    companyId: subscription.company_id,
    amountCents,
    currency,
    description: `${plan.name} renewal`,
    paidAt: payment.paid_at || now.toISOString(),
    periodStart: now,
    periodEnd,
    whopPaymentId: payment.id,
  });

  // Insert the transaction last: it is the idempotency marker the guard above
  // checks, so it must only be written once the renewal work is actually done.
  await admin
    .from('payment_transactions')
    .insert([{
      company_id: subscription.company_id,
      amount_cents: amountCents,
      currency,
      status: 'succeeded',
      transaction_type: 'subscription',
      reference_number: `WHOP-${payment.id}`,
      description: `${plan.name} renewal`,
      provider: 'whop',
      provider_payment_id: payment.id,
      paid_at: payment.paid_at || now.toISOString(),
      metadata: { plan_id: plan.id },
    }])
    .throwOnError();

  console.log('Subscription renewed:', subscription.id);
}

async function createPaidInvoice(
  admin: ReturnType<typeof createAdminClient>,
  options: {
    companyId: string;
    amountCents: number;
    currency: string;
    description: string;
    paidAt: string;
    periodStart: Date;
    periodEnd: Date;
    whopPaymentId: string;
  }
) {
  // Idempotency: Whop retries webhooks; skip if this payment is already invoiced
  const { data: existing } = await admin
    .from('invoices')
    .select('id')
    .eq('metadata->>whop_payment_id', options.whopPaymentId)
    .limit(1)
    .throwOnError();

  if (existing && existing.length > 0) {
    console.log('Invoice already exists for payment, skipping:', options.whopPaymentId);
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
      billing_period_start: options.periodStart.toISOString(),
      billing_period_end: options.periodEnd.toISOString(),
      paid_at: options.paidAt,
      line_items: [{
        description: options.description,
        quantity: 1,
        amount: options.amountCents,
      }],
      metadata: { whop_payment_id: options.whopPaymentId },
    }])
    .throwOnError();
}

async function activateSubscription(
  admin: ReturnType<typeof createAdminClient>,
  options: {
    companyId: string;
    plan: SubscriptionPlan;
    membershipId: string | null;
    customerId: string | null;
    periodStart: Date;
    periodEnd: Date;
  }
) {
  const { companyId, plan, membershipId, customerId, periodStart, periodEnd } = options;

  await admin
    .from('subscriptions')
    .upsert({
      company_id: companyId,
      plan_type: plan.id,
      status: 'active',
      provider: 'whop',
      provider_subscription_id: membershipId,
      provider_customer_id: customerId,
      provider_plan_id: plan.whopPlanId,
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd.toISOString(),
      job_post_limit: plan.limits.jobPosts,
      featured_job_limit: plan.limits.featuredJobs,
      team_member_limit: plan.limits.teamMembers,
      price_cents: plan.price,
      currency: plan.currency,
      billing_interval: plan.interval,
      cancel_at_period_end: false,
      canceled_at: null,
      ended_at: null,
    }, {
      onConflict: 'company_id',
    })
    .throwOnError();
}

async function handlePaymentFailed(payment: WhopPayment) {
  const admin = createAdminClient();
  const metadata = (payment.metadata || {}) as Record<string, string>;

  const transactionId = metadata.transaction_id;
  const checkoutConfigId = payment.checkout_configuration_id;

  if (!transactionId && !checkoutConfigId) {
    console.log('Payment failed with no attributable transaction:', payment.id);
    return;
  }

  // Only flip pending attempts: a failed renewal charge (or an out-of-order
  // event) carries the original checkout metadata and must not overwrite an
  // already-succeeded transaction.
  const query = admin
    .from('payment_transactions')
    .update({
      status: 'failed',
      provider_payment_id: payment.id,
      failed_at: new Date().toISOString(),
      failure_message: payment.failure_message,
    })
    .in('status', ['pending', 'processing']);

  if (transactionId) {
    await query.eq('id', transactionId).throwOnError();
  } else {
    await query.eq('provider_checkout_id', checkoutConfigId!).throwOnError();
  }

  console.log('Payment failed:', payment.id);
}

/**
 * Membership ended (canceled subscription lapsed, refund, etc.) - drop the
 * company back to the free plan so job-post limits apply immediately.
 */
async function handleMembershipDeactivated(membership: WhopMembership) {
  const admin = createAdminClient();

  const { data: subscription } = await admin
    .from('subscriptions')
    .select('id, company_id')
    .eq('provider_subscription_id', membership.id)
    .maybeSingle()
    .throwOnError();

  if (!subscription) {
    console.log('No subscription found for deactivated membership:', membership.id);
    return;
  }

  const freePlan = getPlanById('free')!;

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
      canceled_at: new Date().toISOString(),
      ended_at: new Date().toISOString(),
    })
    .eq('id', subscription.id)
    .throwOnError();

  console.log('Subscription downgraded to free for company:', subscription.company_id);
}

async function handleCancelAtPeriodEndChanged(membership: WhopMembership) {
  const admin = createAdminClient();

  await admin
    .from('subscriptions')
    .update({
      cancel_at_period_end: Boolean(membership.cancel_at_period_end),
      canceled_at: membership.cancel_at_period_end ? new Date().toISOString() : null,
    })
    .eq('provider_subscription_id', membership.id)
    .throwOnError();

  console.log('cancel_at_period_end updated for membership:', membership.id);
}

/**
 * Add one calendar month, clamping to the last day of the target month.
 * (Bare Date.setMonth overflows: Jan 31 + 1 month would become Mar 3.)
 */
function addOneMonth(from: Date): Date {
  const result = new Date(from);
  result.setDate(1);
  result.setMonth(result.getMonth() + 1);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(from.getDate(), lastDay));
  return result;
}

/**
 * Amount/currency to record for a payment. Prefer what Whop actually charged
 * (settlement_amount is in decimal currency units and reflects promos,
 * discounts, and dashboard price changes; our tables store cents), falling
 * back to the local plan price if the payload omits it.
 */
function chargedAmount(payment: WhopPayment, plan: SubscriptionPlan) {
  const amountCents =
    typeof payment.settlement_amount === 'number'
      ? Math.round(payment.settlement_amount * 100)
      : plan.price;
  const currency = payment.currency ? payment.currency.toUpperCase() : plan.currency;
  return { amountCents, currency };
}
