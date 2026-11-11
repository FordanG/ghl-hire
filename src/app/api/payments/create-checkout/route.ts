import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPlanById } from '@/lib/payments/plans';
import { createPolarCheckout, createPolarPortalUrl } from '@/lib/payments/polar';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const plan = getPlanById(planId);

    if (!plan || plan.price === 0) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // The company is derived from the authenticated session, never from the
    // request body, so a caller can only buy a subscription for themselves.
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id, company_name, email')
      .eq('user_id', user.id)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company profile not found. Please create a company profile first.' },
        { status: 404 }
      );
    }

    const admin = createAdminClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    // A company that already has a live Polar subscription must change plan in
    // the customer portal (which prorates); a second checkout would create a
    // second, parallel subscription.
    const { data: existing } = await admin
      .from('subscriptions')
      .select('plan_type, provider, provider_subscription_id')
      .eq('company_id', company.id)
      .maybeSingle();

    if (
      existing?.provider === 'polar' &&
      existing.provider_subscription_id &&
      existing.plan_type !== 'free'
    ) {
      const portalUrl = await createPolarPortalUrl({
        companyId: company.id,
        returnUrl: `${appUrl}/company/dashboard/billing`,
      });
      return NextResponse.json({ success: true, redirectUrl: portalUrl, portal: true });
    }

    const referenceNumber = `SUB-${Date.now()}-${company.id.slice(0, 8)}`;

    const { data: transaction, error: transactionError } = await admin
      .from('payment_transactions')
      .insert([{
        company_id: company.id,
        amount_cents: plan.price,
        currency: plan.currency,
        status: 'pending',
        transaction_type: 'subscription',
        reference_number: referenceNumber,
        description: `${plan.name} subscription`,
        provider: 'polar',
        metadata: { plan_id: planId },
      }])
      .select()
      .single();

    if (transactionError || !transaction) {
      console.error('Failed to create transaction:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    const { checkoutId, checkoutUrl } = await createPolarCheckout({
      planId,
      companyId: company.id,
      customerEmail: company.email || user.email,
      customerName: company.company_name,
      metadata: {
        company_id: company.id,
        plan_id: planId,
        transaction_id: transaction.id,
        reference_number: referenceNumber,
      },
      // Polar substitutes {CHECKOUT_ID} on redirect
      successUrl: `${appUrl}/company/billing/success?checkout_id={CHECKOUT_ID}`,
      returnUrl: `${appUrl}/company/billing/canceled`,
    });

    await admin
      .from('payment_transactions')
      .update({ provider_checkout_id: checkoutId })
      .eq('id', transaction.id);

    return NextResponse.json({
      success: true,
      checkoutId,
      redirectUrl: checkoutUrl,
      transactionId: transaction.id,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
