import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendApplicationStatusEmail, shouldSendEmail } from '@/lib/email/notifications';

// Must match the applications.status CHECK constraint (001_initial_schema.sql).
// newStatus is interpolated into the candidate email, so never accept an
// arbitrary string from the request body.
const ALLOWED_STATUSES = ['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted', 'withdrawn'];

/**
 * POST /api/email/application-status
 *
 * Send email notification when application status changes
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, newStatus } = body;

    if (!applicationId || !newStatus) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    if (typeof newStatus !== 'string' || !ALLOWED_STATUSES.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Invalid application status' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Only the authenticated employer who owns the job may trigger status
    // emails (prevents replaying arbitrary applicationIds to spam candidates).
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

    const profile = application.profile as unknown as { id: string; email: string | null; full_name: string | null } | null;
    const job = application.job as unknown as { title: string; company: { company_name: string; user_id: string } | null } | null;
    const company = job?.company as { company_name: string; user_id: string } | null;

    if (!profile || !job || !company) {
      return NextResponse.json(
        { error: 'Missing application data' },
        { status: 400 }
      );
    }

    if (company.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Not authorized to send status emails for this application' },
        { status: 403 }
      );
    }

    // Check if user wants to receive this type of email
    const shouldSend = await shouldSendEmail(profile.id, 'application_status_changed');

    if (!shouldSend) {
      return NextResponse.json({
        success: true,
        sent: false,
        reason: 'User opted out of status emails',
      });
    }

    // Send status change email to candidate
    if (profile.email) {
      try {
        await sendApplicationStatusEmail(
          profile.email,
          profile.full_name || 'Applicant',
          job.title,
          company.company_name,
          newStatus,
          applicationId
        );

        return NextResponse.json({
          success: true,
          sent: true,
        });
      } catch (err) {
        console.error('Failed to send status email:', err);
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      sent: false,
      reason: 'No email address',
    });

  } catch (error) {
    console.error('Error sending status email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}
