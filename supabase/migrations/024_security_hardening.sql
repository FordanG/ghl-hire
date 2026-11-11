-- Security hardening (2026-11-11 audit)
-- Column-level integrity guards that RLS cannot express, plus a race-free
-- ticket number generator and a tighter support ticket UPDATE policy.
-- Every section is idempotent (CREATE OR REPLACE / DROP ... IF EXISTS / ON
-- CONFLICT) so it is safe on production (001-023 applied) and on fresh
-- environments replaying the whole chain.
--
-- Caller model used by the guard triggers below:
--   * The guard functions are deliberately SECURITY INVOKER, so current_user
--     is the role that issued the statement. PostgREST requests run as
--     'anon' or 'authenticated'; the service role runs as 'service_role'.
--   * SECURITY DEFINER functions (increment_job_views, the application count
--     triggers from 021, ...) run as their owner (postgres), so their writes
--     are NOT seen as anon/authenticated and pass straight through.
--   * Platform admins (is_admin() from 020) also pass, for parity with RLS.

-- =====================================================
-- 0. Shared helper: is the current caller privileged?
-- =====================================================
-- True for any role other than anon/authenticated (service_role, postgres,
-- SECURITY DEFINER contexts) and for authenticated platform admins.
-- is_admin() is only called for 'authenticated' because 020 revoked its
-- EXECUTE from anon. SECURITY INVOKER on purpose: it must see the real
-- current_user. Kept executable by anon/authenticated because the guard
-- triggers call it in their context; it only returns a boolean about the
-- caller.
CREATE OR REPLACE FUNCTION caller_is_privileged() RETURNS BOOLEAN AS $$
BEGIN
    IF current_user NOT IN ('anon', 'authenticated') THEN
        RETURN true;
    END IF;

    IF current_user = 'authenticated' AND auth.uid() IS NOT NULL THEN
        RETURN COALESCE(is_admin(auth.uid()), false);
    END IF;

    RETURN false;
END;
$$ LANGUAGE plpgsql STABLE SECURITY INVOKER SET search_path = public, pg_temp;

-- =====================================================
-- 1. APPLICATIONS: restrict what each side may change
-- =====================================================
-- The "Users can update relevant applications" policy (022) lets both the
-- applicant and the job's employer UPDATE any column. Rules enforced here:
--   * job_id, profile_id, resume_url (and every other column except status
--     and updated_at) are immutable for non-privileged callers.
--   * The employer (owner of the job's company) may change status to any
--     valid value (company/dashboard/applications is the only app writer and
--     it only sends { status }).
--   * The applicant may only change status, and only to 'withdrawn'. (The app
--     has no applicant-side update flow today.)
--   * Service role (admin dashboard /api/admin/manage) and admins bypass.
-- Comparison is "whole row minus allowed columns", so columns added later are
-- immutable by default. updated_at is excluded because the existing
-- update_applications_updated_at trigger rewrites it anyway.
CREATE OR REPLACE FUNCTION guard_application_update() RETURNS TRIGGER AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_is_employer BOOLEAN;
    v_is_applicant BOOLEAN;
BEGIN
    IF caller_is_privileged() THEN
        RETURN NEW;
    END IF;

    IF NEW.job_id IS DISTINCT FROM OLD.job_id
       OR NEW.profile_id IS DISTINCT FROM OLD.profile_id
       OR NEW.resume_url IS DISTINCT FROM OLD.resume_url THEN
        RAISE EXCEPTION 'APPLICATION_FIELD_IMMUTABLE'
            USING HINT = 'job_id, profile_id and resume_url cannot be changed.';
    END IF;

    IF (to_jsonb(NEW) - 'status' - 'updated_at')
       IS DISTINCT FROM (to_jsonb(OLD) - 'status' - 'updated_at') THEN
        RAISE EXCEPTION 'APPLICATION_FIELD_IMMUTABLE'
            USING HINT = 'Only the application status can be changed.';
    END IF;

    -- Employer check first: an employer who also applied to their own job is
    -- treated as the employer.
    SELECT EXISTS (
        SELECT 1 FROM jobs j
        JOIN companies c ON c.id = j.company_id
        WHERE j.id = OLD.job_id AND c.user_id = v_uid
    ) INTO v_is_employer;

    IF v_is_employer THEN
        RETURN NEW;
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = OLD.profile_id AND p.user_id = v_uid
    ) INTO v_is_applicant;

    IF v_is_applicant THEN
        IF NEW.status IS DISTINCT FROM OLD.status AND NEW.status IS DISTINCT FROM 'withdrawn' THEN
            RAISE EXCEPTION 'APPLICATION_STATUS_NOT_ALLOWED'
                USING HINT = 'Applicants can only withdraw an application.';
        END IF;
        RETURN NEW;
    END IF;

    -- Unreachable under the current RLS policy, but fail closed if the policy
    -- is ever widened.
    RAISE EXCEPTION 'APPLICATION_UPDATE_NOT_ALLOWED';
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS guard_application_update_trigger ON applications;
CREATE TRIGGER guard_application_update_trigger
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION guard_application_update();

-- =====================================================
-- 2. COMPANIES: is_verified is admin-only
-- =====================================================
-- RLS lets a company owner UPDATE (and INSERT) their own row with any column,
-- including the trust badge is_verified. For non-privileged callers the value
-- is silently pinned: OLD value on UPDATE, false on INSERT. Silent (not an
-- error) so the owner's normal profile saves keep working even if a client
-- echoes the column back. The admin dashboard writes it with the service role.
CREATE OR REPLACE FUNCTION protect_company_verification() RETURNS TRIGGER AS $$
BEGIN
    IF caller_is_privileged() THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'INSERT' THEN
        NEW.is_verified := false;
    ELSE
        NEW.is_verified := OLD.is_verified;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS protect_company_verification_trigger ON companies;
CREATE TRIGGER protect_company_verification_trigger
    BEFORE INSERT OR UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION protect_company_verification();

-- =====================================================
-- 3. JOBS: applications_count / views_count are system-maintained
-- =====================================================
-- Job owners could overwrite these counters through the jobs UPDATE policy.
-- Legitimate writers are all privileged and pass through:
--   * increment_job_views() (013, SECURITY DEFINER) -> views_count
--   * increment/decrement_application_count() (021, SECURITY DEFINER,
--     triggers on applications) -> applications_count
-- Non-privileged callers get OLD values on UPDATE and 0 on INSERT.
CREATE OR REPLACE FUNCTION protect_job_counters() RETURNS TRIGGER AS $$
BEGIN
    IF caller_is_privileged() THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'INSERT' THEN
        NEW.applications_count := 0;
        NEW.views_count := 0;
    ELSE
        NEW.applications_count := OLD.applications_count;
        NEW.views_count := OLD.views_count;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS protect_job_counters_trigger ON jobs;
CREATE TRIGGER protect_job_counters_trigger
    BEFORE INSERT OR UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION protect_job_counters();

-- =====================================================
-- 4. TICKET NUMBERS: atomic per-year counter instead of COUNT(*)+1
-- =====================================================
-- 009's generate_ticket_number() used SELECT COUNT(*)+1, so concurrent
-- submissions could get the same number and the second insert would fail on
-- the UNIQUE constraint. Same fix as generate_invoice_number in 022: one
-- counter row per year, claimed with an atomic UPSERT.
CREATE TABLE IF NOT EXISTS ticket_number_counters (
    year TEXT PRIMARY KEY,
    last_number INTEGER NOT NULL DEFAULT 0
);

-- Server-only bookkeeping: RLS with no policies denies anon/authenticated.
ALTER TABLE ticket_number_counters ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ticket_number_counters FROM anon, authenticated;

-- Seed from numbers already issued by the COUNT(*) scheme (TICKET-YYYY-NNNN)
-- so new numbers continue the sequence instead of reissuing taken ones.
INSERT INTO ticket_number_counters (year, last_number)
SELECT split_part(ticket_number, '-', 2),
       MAX(split_part(ticket_number, '-', 3)::INTEGER)
FROM support_tickets
WHERE ticket_number ~ '^TICKET-\d{4}-\d{4,}$'
GROUP BY 1
ON CONFLICT (year)
    DO UPDATE SET last_number = GREATEST(ticket_number_counters.last_number, EXCLUDED.last_number);

-- SECURITY DEFINER so the set_ticket_number INSERT trigger can claim a number
-- whatever role inserts the ticket (the counter table is closed to
-- anon/authenticated). LPAD truncates input longer than the pad length, so
-- numbers past 9999 are emitted unpadded instead of being cut to 4 digits
-- (which would collide).
CREATE OR REPLACE FUNCTION generate_ticket_number() RETURNS TEXT AS $$
DECLARE
    v_year TEXT;
    v_count INTEGER;
BEGIN
    v_year := TO_CHAR(NOW(), 'YYYY');

    INSERT INTO ticket_number_counters (year, last_number)
    VALUES (v_year, 1)
    ON CONFLICT (year)
        DO UPDATE SET last_number = ticket_number_counters.last_number + 1
    RETURNING last_number INTO v_count;

    -- Format: TICKET-YYYY-NNNN
    RETURN 'TICKET-' || v_year || '-' ||
        CASE WHEN v_count > 9999 THEN v_count::TEXT ELSE LPAD(v_count::TEXT, 4, '0') END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Anonymous callers have no legitimate path (the contact form and support
-- routes call it with the service role); without this anyone could burn
-- ticket numbers via the public RPC endpoint. authenticated keeps EXECUTE for
-- the "Users can create tickets" INSERT path through set_ticket_number.
REVOKE EXECUTE ON FUNCTION generate_ticket_number() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION generate_ticket_number() TO authenticated, service_role;

-- =====================================================
-- 5. SUPPORT TICKETS: owners can no longer UPDATE
-- =====================================================
-- 009's "Users can update their own tickets" had no column restriction, so a
-- ticket owner could set status, priority, assigned_to, resolved_at, etc. The
-- app has no owner-side ticket edit flow (tickets are created and written
-- back with the service role; status changes come from /api/admin/manage via
-- the service role), so the policy is dropped outright. Customers add
-- information through ticket_messages, whose policies are unchanged. Support
-- staff keep "Support staff can update all tickets".
DROP POLICY IF EXISTS "Users can update their own tickets" ON support_tickets;
