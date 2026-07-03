-- Fix application-count triggers (from 001) that ran SECURITY INVOKER:
-- - increment: a jobseeker's INSERT on applications can't UPDATE jobs under
--   RLS, so the UPDATE silently matched 0 rows and applications_count never
--   incremented (employers always saw 0 applicants).
-- - decrement: deleting an auth user whose cascade removes applications runs
--   as supabase_auth_admin, which has no UPDATE grant on jobs -> SQLSTATE
--   42501 aborts the user deletion entirely.
-- SECURITY DEFINER (with pinned search_path) fixes both.

CREATE OR REPLACE FUNCTION increment_application_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs SET applications_count = applications_count + 1 WHERE id = NEW.job_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION decrement_application_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs SET applications_count = applications_count - 1 WHERE id = OLD.job_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;
