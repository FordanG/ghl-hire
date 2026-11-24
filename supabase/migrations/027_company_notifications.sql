-- 027: Employers get in-app notifications without a job seeker profile (2026-11-24)
--
-- notifications.profile_id was required, so notify_new_application() could
-- only notify an employer who also happened to have a job seeker profile.
-- A normal employer account (company only) got nothing in the app.
--
-- A notification now belongs to exactly one owner: a profile or a company.

ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

ALTER TABLE notifications ALTER COLUMN profile_id DROP NOT NULL;

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_single_owner_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_single_owner_check
  CHECK ((profile_id IS NOT NULL) <> (company_id IS NOT NULL));

CREATE INDEX IF NOT EXISTS idx_notifications_company_id
  ON notifications (company_id, created_at DESC) WHERE company_id IS NOT NULL;

-- ---------------------------------------------------------------
-- RLS: the owner is the profile's user or the company's user
-- ---------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT TO authenticated
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = (SELECT auth.uid()))
    OR company_id IN (SELECT id FROM companies WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE TO authenticated
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = (SELECT auth.uid()))
    OR company_id IN (SELECT id FROM companies WHERE user_id = (SELECT auth.uid()))
  )
  WITH CHECK (
    profile_id IN (SELECT id FROM profiles WHERE user_id = (SELECT auth.uid()))
    OR company_id IN (SELECT id FROM companies WHERE user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE TO authenticated
  USING (
    profile_id IN (SELECT id FROM profiles WHERE user_id = (SELECT auth.uid()))
    OR company_id IN (SELECT id FROM companies WHERE user_id = (SELECT auth.uid()))
  );

-- ---------------------------------------------------------------
-- mark_notification_read: also covers company-owned notifications
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.mark_notification_read(p_notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE id = p_notification_id
      AND (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        OR company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
      );
END;
$$;

-- ---------------------------------------------------------------
-- New application: notify the company that owns the job.
-- A notification problem must never block the application itself.
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_new_application()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
    v_job_title TEXT;
    v_company_id UUID;
    v_candidate_name TEXT;
    v_enabled BOOLEAN;
BEGIN
    SELECT j.title, j.company_id INTO v_job_title, v_company_id
    FROM jobs j WHERE j.id = NEW.job_id;

    -- Curated listings have no company account to notify.
    IF v_company_id IS NULL THEN
        RETURN NEW;
    END IF;

    -- An employer who also has a profile may have switched application
    -- notifications off there; keep honouring that. Company-only accounts
    -- have no preferences row and default to on.
    SELECT np.inapp_application_updates INTO v_enabled
    FROM companies c
    JOIN profiles op ON op.user_id = c.user_id
    JOIN notification_preferences np ON np.profile_id = op.id
    WHERE c.id = v_company_id;

    IF v_enabled IS FALSE THEN
        RETURN NEW;
    END IF;

    SELECT p.full_name INTO v_candidate_name
    FROM profiles p WHERE p.id = NEW.profile_id;

    INSERT INTO notifications (company_id, type, title, message, link, data)
    VALUES (
        v_company_id,
        'application_received',
        'New Application Received',
        format('%s applied for %s', COALESCE(v_candidate_name, 'A candidate'), v_job_title),
        '/company/dashboard/applications',
        jsonb_build_object('application_id', NEW.id, 'job_id', NEW.job_id, 'profile_id', NEW.profile_id)
    );

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_new_application failed for application %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;
