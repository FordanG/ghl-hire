import { NextRequest, NextResponse } from 'next/server';
import { mayaClient, getPlanById } from '@/lib/payments/maya';
import { supabase } from '@/lib/supabase';

/**
 * Maya Webhook Handler
 *
 * This endpoint receives payment notifications from Maya
 * Webhook events include: payment.success, payment.failed, subscription.renewed, etc.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-maya-signature') || '';

    // Verify webhook signature
    if (!mayaClient.verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    console.log('Maya webhook received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment.success':
      case 'checkout.success':
        await handlePaymentSuccess(event);
        break;

      case 'payment.failed':
      case 'checkout.failed':
        await handlePaymentFailed(event);
        break;

      case 'subscription.created':
        await handleSubscriptionCreated(event);
        break;

      case 'subscription.renewed':
        await handleSubscriptionRenewed(event);
        break;

      case 'subscription.canceled':
        await handleSubscriptionCanceled(event);
        break;

      case 'subscription.expired':
        await handleSubscriptionExpired(event);
        break;

      default:
        console.log('Unhandled webhook event:', event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(event: any) {
  const { referenceNumber, payment, metadata } = event.data;

  try {
    // Update transaction status
    const { data: transaction } = await supabase
      .from('payment_transactions')
      .update({
        status: 'succeeded',
        maya_payment_id: payment?.id,
        paid_at: new Date().toISOString(),
      })
      .eq('reference_number', referenceNumber)
      .select()
      .single();

    if (!transaction) {
      console.error('Transaction not found:', referenceNumber);
      return;
    }

    const planId = metadata?.plan_id || transaction.metadata?.plan_id;
    const companyId = metadata?.company_id || transaction.company_id;

    if (planId && companyId) {
      const plan = getPlanById(planId);

      // Create or update subscription
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + (plan.interval === 'year' ? 12 : 1));

      await supabase
        .from('subscriptions')
        .upsert({
          company_id: companyId,
          plan_type: planId,
          status: 'active',
          maya_subscription_id: event.data.subscriptionId,
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          job_post_limit: plan.limits.jobPosts,
          featured_job_limit: plan.limits.featuredJobs,
          team_member_limit: plan.limits.teamMembers,
          price_cents: plan.price,
          currency: plan.currency,
          billing_interval: plan.interval,
          cancel_at_period_end: false,
        }, {
          onConflict: 'company_id',
        });

      // Create invoice
      await supabase
        .from('invoices')
        .insert([{
          company_id: companyId,
          amount_cents: transaction.amount_cents,
          currency: transaction.currency,
          status: 'paid',
          billing_period_start: new Date().toISOString(),
          billing_period_end: periodEnd.toISOString(),
          paid_at: new Date().toISOString(),
          line_items: [{
            description: plan.name,
            quantity: 1,
            amount: plan.price,
          }],
        }]);

      console.log('Subscription activated for company:', companyId);
    }

  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(event: any) {
  const { referenceNumber, failure } = event.data;

  try {
    await supabase
      .from('payment_transactions')
      .update({
        status: 'failed',
        failed_at: new Date().toISOString(),
        failure_code: failure?.code,
        failure_message: failure?.message,
      })
      .eq('reference_number', referenceNumber);

    console.log('Payment failed:', referenceNumber);

  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * Handle subscription created
 */
async function handleSubscriptionCreated(event: any) {
  const { subscription, customer } = event.data;

  try {
    // Subscription details are handled in payment success
    console.log('Subscription created:', subscription.id);

  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

/**
 * Handle subscription renewed
 */
async function handleSubscriptionRenewed(event: any) {
  const { subscription } = event.data;

  try {
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('maya_subscription_id', subscription.id)
      .single();

    if (existingSub) {
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await supabase
        .from('subscriptions')
        .update({
          current_period_start: new Date().toISOString(),
          current_period_end: periodEnd.toISOString(),
          status: 'active',
        })
        .eq('maya_subscription_id', subscription.id);

      console.log('Subscription renewed:', subscription.id);
    }

  } catch (error) {
    console.error('Error handling subscription renewed:', error);
  }
}

/**
 * Handle subscription canceled
 */
async function handleSubscriptionCanceled(event: any) {
  const { subscription } = event.data;

  try {
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('maya_subscription_id', subscription.id);

    console.log('Subscription canceled:', subscription.id);

  } catch (error) {
    console.error('Error handling subscription canceled:', error);
  }
}

/**
 * Handle subscription expired
 */
async function handleSubscriptionExpired(event: any) {
  const { subscription } = event.data;

  try {
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        ended_at: new Date().toISOString(),
      })
      .eq('maya_subscription_id', subscription.id);

    console.log('Subscription expired:', subscription.id);

  } catch (error) {
    console.error('Error handling subscription expired:', error);
  }
}
