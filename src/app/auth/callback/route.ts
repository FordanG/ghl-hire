import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const userType = requestUrl.searchParams.get('type') || 'jobseeker';

  if (code) {
    try {
      // Exchange code for session
      await supabase.auth.exchangeCodeForSession(code);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if profile/company already exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // If neither exists, create one based on type
        if (!profile && !company) {
          if (userType === 'jobseeker') {
            await supabase.from('profiles').insert({
              user_id: user.id,
              full_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
              email: user.email!,
            });
          } else {
            const { data: newCompany } = await supabase
              .from('companies')
              .insert({
                user_id: user.id,
                company_name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Company',
                email: user.email!,
              })
              .select()
              .single();

            // Create free subscription
            if (newCompany) {
              await supabase.from('subscriptions').insert({
                company_id: newCompany.id,
                plan_type: 'free',
                status: 'active',
                job_post_limit: 1,
                job_posts_used: 0,
              });
            }
          }
        }

        // Redirect based on profile type
        if (profile || userType === 'jobseeker') {
          return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
        } else {
          return NextResponse.redirect(new URL('/company/dashboard', requestUrl.origin));
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(new URL('/signin?error=auth_failed', requestUrl.origin));
    }
  }

  // If no code, redirect to signin
  return NextResponse.redirect(new URL('/signin', requestUrl.origin));
}
