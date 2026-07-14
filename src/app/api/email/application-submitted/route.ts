import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendApplicationSubmittedEmail, sendNewApplicationEmail, shouldSendEmail } from '@/lib/email/notifications';

/**
 * POST /api/email/application-submitted
 *
 * Send email notifications when a new application is submitted
 * - Confirmation email to the candidate
 * - Notification email to the employer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Only the authenticated applicant who owns this application may trigger
    // its notification emails (prevents replaying an arbitrary applicationId).
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get application details with job, profile, and company info
    const { data: application, error } = await supabase
      .from('applications')
      .select(`
        id,
        profile:profiles!applications_profile_id_fkey (
          id,
          full_name,
          email,
          user_id
        ),
        job:jobs!applications_job_id_fkey (
          id,
          title,
          company:companies!jobs_company_id_fkey (
            id,
            company_name,
            email,
            user_id
          )
        )
      `)
      .eq('id', applicationId)
      .single();

    if (error || !application) {
      console.error('Failed to fetch application:', error);
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    const profile = application.profile as unknown as { id: string; email: string | null; full_name: string | null; user_id: string } | null;
    const job = application.job as unknown as { title: string; company: { company_name: string; email: string | null } | null } | null;
    const company = job?.company as { company_name: string; email: string | null } | null;

    if (!profile || !job || !company) {
      return NextResponse.json(
        { error: 'Missing application data' },
        { status: 400 }
      );
    }

    if (profile.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to trigger notifications for this application' },
        { status: 403 }
      );
    }

    const results = {
      candidateEmail: false,
      employerEmail: false,
    };

    // Send confirmation email to candidate
    if (profile.email) {
      const shouldSend = await shouldSendEmail(profile.id, 'application_submitted');
      if (shouldSend) {
        try {
          await sendApplicationSubmittedEmail(
            profile.email,
            profile.full_name || 'Applicant',
            job.title,
            company.company_name
          );
          results.candidateEmail = true;
        } catch (err) {
          console.error('Failed to send candidate email:', err);
        }
      }
    }

    // Send notification email to employer (only once per application - guards
    // against replaying this endpoint to spam the employer / burn email quota)
    if (company.email) {
      const { data: alreadyNotified } = await createAdminClient()
        .from('email_logs')
        .select('id')
        .eq('email_type', 'new_application')
        .contains('metadata', { applicationId })
        .limit(1)
        .maybeSingle();

      if (!alreadyNotified) {
        try {
          await sendNewApplicationEmail(
            company.email,
            company.company_name,
            profile.full_name || 'A candidate',
            job.title,
            applicationId
          );
          results.employerEmail = true;
        } catch (err) {
          console.error('Failed to send employer email:', err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error('Error sending application emails:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send emails' },
      { status: 500 }
    );
  }
}
