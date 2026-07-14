import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * GET /api/resumes/view                        -> the caller's own profile resume
 * GET /api/resumes/view?applicationId=<uuid>   -> the resume attached to an application
 *
 * The resumes bucket is private, but resume_url columns store getPublicUrl()
 * output, which 400s on a private bucket. This route resolves the stored URL
 * back to a storage path and redirects to a short-lived signed URL instead.
 *
 * Authorization piggybacks on RLS: the application row is fetched with the
 * caller's session, and the "Users can view relevant applications" policy
 * already scopes it to the applicant and the job's employer.
 */

// Signed link lifetime in seconds; long enough to open/download, short enough
// that a leaked link goes stale quickly
const SIGNED_URL_TTL = 300;

function resumeStoragePath(resumeUrl: string): string | null {
  const marker = '/storage/v1/object/public/resumes/';
  const idx = resumeUrl.indexOf(marker);
  if (idx === -1) return null;
  const path = resumeUrl.slice(idx + marker.length).split('?')[0];
  return path ? decodeURIComponent(path) : null;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const applicationId = request.nextUrl.searchParams.get('applicationId');
    let resumeUrl: string | null = null;

    if (applicationId) {
      const { data: application } = await supabase
        .from('applications')
        .select('resume_url')
        .eq('id', applicationId)
        .single();

      resumeUrl = application?.resume_url ?? null;
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('resume_url')
        .eq('user_id', user.id)
        .single();

      resumeUrl = profile?.resume_url ?? null;
    }

    const path = resumeUrl ? resumeStoragePath(resumeUrl) : null;

    if (!path) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    const { data: signed, error: signError } = await createAdminClient()
      .storage
      .from('resumes')
      .createSignedUrl(path, SIGNED_URL_TTL);

    if (signError || !signed?.signedUrl) {
      console.error('Failed to sign resume URL:', signError);
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    return NextResponse.redirect(signed.signedUrl);

  } catch (error) {
    console.error('Error resolving resume view:', error);
    return NextResponse.json(
      { error: 'Failed to open resume' },
      { status: 500 }
    );
  }
}
