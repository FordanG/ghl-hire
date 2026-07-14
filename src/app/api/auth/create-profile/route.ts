import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

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
    // Authenticate the caller — identity must come from the session, never the request body
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { role, fullName, companyName, phone, location } = body;

    // Identity fields are derived from the authenticated session, not the request body
    const userId = user.id;
    const email = user.email;

    if (!role || !email) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (role === 'jobseeker') {
      // Check if profile already exists
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select()
        .eq('user_id', userId)
        .single();

      if (existingProfile) {
        console.log('Profile already exists for user:', userId);
        return NextResponse.json({ success: true, profile: existingProfile });
      }

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
          { error: 'Failed to create profile' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, profile: data });
    } else if (role === 'employer') {
      // Check if company already exists
      const { data: existingCompany } = await supabaseAdmin
        .from('companies')
        .select()
        .eq('user_id', userId)
        .single();

      if (existingCompany) {
        console.log('Company already exists for user:', userId);
        return NextResponse.json({ success: true, company: existingCompany });
      }

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
          { error: 'Failed to create company' },
          { status: 500 }
        );
      }

      // The free subscription is created automatically by the
      // create_free_subscription trigger on the companies table.

      return NextResponse.json({ success: true, company: companyData });
    } else {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
