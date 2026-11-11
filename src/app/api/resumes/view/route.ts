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
 * already scopes it to the applicant and the job's employer. The resolved
 * path must also sit in the owning user's folder before it is signed.
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
    // auth user id of whoever the resume belongs to; the signed path must live
    // in that user's storage folder
    let ownerUserId: string | null = null;

    if (applicationId) {
      const { data: application } = await supabase
        .from('applications')
        .select(`
          resume_url,
          profile:profiles!applications_profile_id_fkey ( user_id )
        `)
        .eq('id', applicationId)
        .single();

      const applicant = application?.profile as unknown as { user_id: string | null } | null;
      resumeUrl = application?.resume_url ?? null;
      ownerUserId = applicant?.user_id ?? null;
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('resume_url')
        .eq('user_id', user.id)
        .single();

      resumeUrl = profile?.resume_url ?? null;
      ownerUserId = user.id;
    }

    const path = resumeUrl ? resumeStoragePath(resumeUrl) : null;

    // resume_url is user-writable (profiles are public and owners edit their
    // own row), so never sign a path just because it is stored: it must sit
    // in the owner's folder, matching the bucket's first-folder = auth.uid()
    // upload policy. Otherwise anyone could copy a victim's path into their
    // own profile and mint a signed URL for it with the service role.
    const segments = path ? path.split('/') : [];
    const ownsPath =
      !!ownerUserId &&
      segments.length >= 2 &&
      segments[0] === ownerUserId &&
      !segments.includes('..') &&
      !segments.includes('.');

    if (!path || !ownsPath) {
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
