import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendApplicationStatusEmail, shouldSendEmail } from '@/lib/email/notifications';

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

    const supabase = await createClient();

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
            company_name
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

    const profile = application.profile as any;
    const job = application.job as any;
    const company = job?.company as any;

    if (!profile || !job || !company) {
      return NextResponse.json(
        { error: 'Missing application data' },
        { status: 400 }
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

  } catch (error: any) {
    console.error('Error sending status email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
