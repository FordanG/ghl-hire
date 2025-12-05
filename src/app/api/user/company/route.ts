import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/user/company
 *
 * Get the company associated with the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the company for this user
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (companyError) {
      if (companyError.code === 'PGRST116') {
        // No company found
        return NextResponse.json({ company: null });
      }
      throw companyError;
    }

    // Get subscription for this company
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        id,
        plan_type,
        status,
        current_period_start,
        current_period_end,
        job_post_limit,
        featured_job_limit,
        team_member_limit,
        cancel_at_period_end
      `)
      .eq('company_id', company.id)
      .single();

    // Get job count for this company
    const { count: jobCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', company.id)
      .in('status', ['active', 'draft']);

    return NextResponse.json({
      company: {
        ...company,
        job_count: jobCount || 0,
        subscription: subscription || null,
      }
    });

  } catch (error: any) {
    console.error('Error fetching user company:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch company' },
      { status: 500 }
    );
  }
}
