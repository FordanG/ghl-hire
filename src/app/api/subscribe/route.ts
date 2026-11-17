import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: NextRequest) {
  let body: { email?: unknown; interest?: unknown; source?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const interest = body.interest === 'employer' ? 'employer' : 'jobseeker';
  const source = typeof body.source === 'string' ? body.source.slice(0, 60) : null;

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    // Untyped service client: newsletter_subscribers has no RLS policies, so
    // only the service role can write to it.
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, interest, source });

    // 23505: already subscribed. Same answer either way, so the form does not
    // reveal who is on the list.
    if (error && error.code !== '23505') {
      console.error('Subscribe failed:', error);
      return NextResponse.json({ error: 'We could not add you just now. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json({ error: 'We could not add you just now. Please try again.' }, { status: 500 });
  }
}
