import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with service role (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  console.log('=== Create Profile API Called ===');
  try {
    const body = await request.json();
    const { userId, role, fullName, companyName, email, phone, location } = body;

    console.log('Request body:', { userId, role, fullName, companyName, email, phone, location });

    if (!userId || !role || !email) {
      console.error('Missing required fields:', { userId, role, email });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (role === 'jobseeker') {
      // Create job seeker profile
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: fullName,
          email,
          phone: phone || null,
          location: location || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Profile creation error:', error);
        return NextResponse.json(
          { error: 'Failed to create profile', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, profile: data });
    } else if (role === 'employer') {
      // Create company profile
      const { data: companyData, error: companyError } = await supabaseAdmin
        .from('companies')
        .insert({
          user_id: userId,
          company_name: companyName || fullName,
          email,
          location: location || null,
        })
        .select()
        .single();

      if (companyError) {
        console.error('Company creation error:', companyError);
        return NextResponse.json(
          { error: 'Failed to create company', details: companyError.message },
          { status: 500 }
        );
      }

      // Create free subscription
      const { error: subscriptionError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          company_id: companyData.id,
          plan_type: 'free',
          status: 'active',
          job_post_limit: 1,
          job_posts_used: 0,
          featured_job_limit: 0,
          team_member_limit: 1,
          price_cents: 0,
          currency: 'USD',
          billing_interval: 'month',
        });

      if (subscriptionError) {
        console.error('Subscription creation error:', subscriptionError);
        // Don't fail if subscription creation fails - the company profile is more important
      }

      return NextResponse.json({ success: true, company: companyData });
    } else {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    );
  }
}
