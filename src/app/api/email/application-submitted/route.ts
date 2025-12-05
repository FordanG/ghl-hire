import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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

    const profile = application.profile as any;
    const job = application.job as any;
    const company = job?.company as any;

    if (!profile || !job || !company) {
      return NextResponse.json(
        { error: 'Missing application data' },
        { status: 400 }
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

    // Send notification email to employer
    if (company.email) {
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

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error: any) {
    console.error('Error sending application emails:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send emails' },
      { status: 500 }
    );
  }
}
