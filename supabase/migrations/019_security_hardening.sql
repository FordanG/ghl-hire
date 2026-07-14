-- Security hardening based on Supabase advisor findings (2026-07-03)
-- 1. Pin search_path on flagged functions (schema-hijacking defense)
-- 2. Revoke EXECUTE on SECURITY DEFINER functions clients must not call
-- 3. Make email_logs service-role-only (drop USING(true)/WITH CHECK(true) policies)
-- 4. Revoke anon SELECT on private tables (defense-in-depth on top of RLS)

-- 1. Pin search_path
DO $$
DECLARE fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN (
        'update_projects_updated_at','enforce_job_post_limit','create_notification',
        'mark_notification_read','mark_all_notifications_read','notify_application_status_change',
        'can_company_post_job','increment_job_views','update_updated_at_column',
        'increment_application_count','aggregate_platform_analytics','decrement_application_count',
        'update_job_analytics','notify_new_application','is_admin_or_moderator',
        'resolve_content_report','generate_ticket_number','set_ticket_number',
        'get_email_stats','generate_invoice_number','set_invoice_number',
        'create_free_subscription','find_job_by_slug','handle_new_user'
      )
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', fn.sig);
  END LOOP;
END $$;

-- 2. Revoke EXECUTE on dangerous SECURITY DEFINER RPCs.
-- Kept public on purpose: increment_job_views + find_job_by_slug (public job pages),
-- is_admin_or_moderator (referenced by RLS policies),
-- mark_notification_read / mark_all_notifications_read (authenticated users' own reads),
-- generate_ticket_number / generate_invoice_number (called by INSERT triggers).
DO $$
DECLARE fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname IN (
      'aggregate_platform_analytics','get_email_stats','resolve_content_report',
      'create_notification','update_job_analytics'
    )
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon, authenticated', fn.sig);
  END LOOP;

  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname IN (
      'mark_notification_read','mark_all_notifications_read','can_company_post_job'
    )
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM anon', fn.sig);
  END LOOP;
END $$;

-- 3. email_logs: written only by the server with the service role now
DROP POLICY IF EXISTS "System can insert email logs" ON email_logs;
DROP POLICY IF EXISTS "System can update email logs" ON email_logs;

-- 3b. waitlist was created out-of-band in production (migration 20260102233134)
-- and never committed, so tracked migrations can't reproduce it. A fresh
-- `db reset`/new environment therefore lacks the table and the REVOKE in step 4
-- below would fail with "relation waitlist does not exist". Recreate it
-- idempotently here, ahead of that REVOKE, mirroring the live schema. anon's
-- SELECT is stripped by step 4; the remaining grants come from Supabase defaults.
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('employer', 'jobseeker')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_user_type ON waitlist(user_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can join waitlist" ON waitlist;
CREATE POLICY "Anyone can join waitlist"
  ON waitlist
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view waitlist" ON waitlist;
CREATE POLICY "Admins can view waitlist"
  ON waitlist
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM admin_roles ar
      JOIN profiles p ON p.id = ar.profile_id
      WHERE p.user_id = auth.uid()
    )
  );

-- 4. Private tables should not be discoverable/queryable pre-auth.
-- RLS already scopes rows; this removes the anon grant entirely.
-- Public content (jobs, companies, blog_posts, blog_comments, resources,
-- profiles, projects) keeps anon SELECT.
REVOKE SELECT ON
  admin_roles,
  email_logs,
  moderation_actions,
  content_reports,
  support_tickets,
  ticket_messages,
  payment_transactions,
  subscriptions,
  invoices,
  notifications,
  notification_preferences,
  saved_jobs,
  job_alerts,
  applications,
  application_projects,
  platform_analytics,
  job_analytics,
  application_sources,
  job_view_events,
  waitlist
FROM anon;
