import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPolarPortalUrl } from '@/lib/payments/polar';

/**
 * POST /api/payments/portal
 *
 * Returns a short-lived Polar customer portal URL for the signed-in company,
 * where they can change plan, update their card, cancel and download receipts.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!company) {
      return NextResponse.json({ error: 'Company profile not found' }, { status: 404 });
    }

    // Only companies that have been through a Polar checkout exist as Polar
    // customers.
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('provider, provider_customer_id')
      .eq('company_id', company.id)
      .maybeSingle();

    if (subscription?.provider !== 'polar' || !subscription.provider_customer_id) {
      return NextResponse.json(
        { error: 'No paid subscription to manage yet' },
        { status: 409 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const url = await createPolarPortalUrl({
      companyId: company.id,
      returnUrl: `${appUrl}/company/dashboard/billing`,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return NextResponse.json(
      { error: 'Failed to open the billing portal' },
      { status: 500 }
    );
  }
}
