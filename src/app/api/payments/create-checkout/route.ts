import { NextRequest, NextResponse } from 'next/server';
import { mayaClient, getPlanById, formatAmountForMaya } from '@/lib/payments/maya';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, companyId, successUrl, cancelUrl } = body;

    if (!planId || !companyId) {
      return NextResponse.json(
        { error: 'Plan ID and Company ID are required' },
        { status: 400 }
      );
    }

    // Get plan details
    const plan = getPlanById(planId);

    if (!plan || planId === 'free') {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // Get company details
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Generate reference number
    const referenceNumber = `SUB-${Date.now()}-${companyId.slice(0, 8)}`;

    // Create payment transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from('payment_transactions')
      .insert([{
        company_id: companyId,
        amount_cents: plan.price,
        currency: plan.currency,
        status: 'pending',
        transaction_type: 'subscription',
        reference_number: referenceNumber,
        description: `${plan.name} subscription`,
        metadata: { plan_id: planId }
      }])
      .select()
      .single();

    if (transactionError) {
      console.error('Failed to create transaction:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    // Create Maya checkout session
    const checkoutSession = {
      totalAmount: {
        value: plan.price,
        currency: plan.currency,
      },
      buyer: {
        firstName: company.company_name.split(' ')[0] || 'Company',
        lastName: company.company_name.split(' ').slice(1).join(' ') || 'User',
        email: company.email,
      },
      items: [
        {
          name: plan.name,
          quantity: 1,
          amount: {
            value: plan.price,
            currency: plan.currency,
          },
          totalAmount: {
            value: plan.price,
            currency: plan.currency,
          },
        },
      ],
      redirectUrl: {
        success: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/company/billing/success`,
        failure: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/company/billing/failed`,
        cancel: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/company/billing/canceled`,
      },
      requestReferenceNumber: referenceNumber,
      metadata: {
        company_id: companyId,
        plan_id: planId,
        transaction_id: transaction.id,
      },
    };

    const { checkoutId, redirectUrl } = await mayaClient.createCheckoutSession(checkoutSession);

    // Update transaction with Maya checkout ID
    await supabase
      .from('payment_transactions')
      .update({ maya_checkout_id: checkoutId })
      .eq('id', transaction.id);

    return NextResponse.json({
      success: true,
      checkoutId,
      redirectUrl,
      transactionId: transaction.id,
    });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
