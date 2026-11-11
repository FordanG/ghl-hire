import { NextResponse } from 'next/server';
import { parseAdminAction } from '@/lib/admin/actions';
import { getAdminAccess } from '@/lib/admin/auth';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// Raised by the enforce_job_post_limit trigger (018) when a job would push its
// company past the plan's active job limit
function isJobPostLimitError(error: { message?: string | null }) {
  return (error.message ?? '').includes('JOB_POST_LIMIT_REACHED');
}

function notFound() {
  return NextResponse.json(
    { error: 'That record no longer exists.' },
    { status: 404, headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function PATCH(request: Request) {
  const access = await getAdminAccess();

  if (access.state === 'unauthenticated') {
    return NextResponse.json({ error: 'Sign in is required.' }, { status: 401 });
  }

  if (access.state === 'forbidden') {
    return NextResponse.json({ error: 'Full administrator access is required.' }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'The action payload must be valid JSON.' }, { status: 400 });
  }

  const parsed = parseAdminAction(payload);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { resource, id, value } = parsed.value;
  const adminClient = createAdminClient();
  const now = new Date().toISOString();

  try {
    if (resource === 'users') {
      if (id === access.userId && value === true) {
        return NextResponse.json(
          { error: 'You cannot suspend the account you are currently using.' },
          { status: 409 }
        );
      }

      const { error } = await adminClient.auth.admin.updateUserById(id, {
        ban_duration: value === true ? '876000h' : 'none',
      });
      if (error) throw error;
    }

    if (resource === 'companies') {
      const { data, error } = await adminClient
        .from('companies')
        .update({ is_verified: value as boolean })
        .eq('id', id)
        .select('id');
      if (error) throw error;
      if (!data?.length) return notFound();
    }

    if (resource === 'jobs') {
      const { data, error } = await adminClient
        .from('jobs')
        .update({ status: value as string })
        .eq('id', id)
        .select('id');
      if (error && isJobPostLimitError(error)) {
        return NextResponse.json(
          {
            error:
              "This company has reached its plan's active job limit, so the job cannot be activated. Upgrade the plan or close another job first.",
          },
          { status: 409 }
        );
      }
      if (error) throw error;
      if (!data?.length) return notFound();
    }

    if (resource === 'applications') {
      const { data, error } = await adminClient
        .from('applications')
        .update({ status: value as string })
        .eq('id', id)
        .select('id');
      if (error) throw error;
      if (!data?.length) return notFound();
    }

    if (resource === 'reports') {
      const isComplete = value === 'resolved' || value === 'dismissed';
      const { data, error } = await adminClient
        .from('content_reports')
        .update({
          status: value as string,
          resolved_by: isComplete ? access.profileId : null,
          resolved_at: isComplete ? now : null,
        })
        .eq('id', id)
        .select('id');
      if (error) throw error;
      if (!data?.length) return notFound();
    }

    if (resource === 'tickets') {
      const isResolved = value === 'resolved';
      const isClosed = value === 'closed';
      const { data, error } = await adminClient
        .from('support_tickets')
        .update({
          status: value as string,
          resolved_at: isResolved || isClosed ? now : null,
          closed_at: isClosed ? now : null,
        })
        .eq('id', id)
        .select('id');
      if (error) throw error;
      if (!data?.length) return notFound();
    }

    return NextResponse.json(
      { ok: true },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Admin management action failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'The management action failed.' },
      { status: 500 }
    );
  }
}
