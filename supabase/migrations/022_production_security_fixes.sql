-- Production security & integrity fixes (2026-07-10 platform audit)
-- Consolidates the database-layer fixes from the audit into a migration that
-- can reach production: 002/007/011/012/017/018 are already applied there, so
-- their fixes must ship as new statements. Every section is idempotent -- safe
-- against production (001-021 applied in original form) and against fresh
-- environments replaying the whole chain.

-- =====================================================
-- 1. NOTIFICATIONS: lock down INSERT
-- =====================================================
-- 007's INSERT policy was WITH CHECK (true), letting any anon/authenticated
-- caller forge notifications into any user's inbox (arbitrary profile_id) via
-- PostgREST. Writes are server-only: the SECURITY DEFINER create_notification()
-- function and the service role. RLS default-deny plus the REVOKE
-- (defense-in-depth, matching 019) keep the write path off the public API.
DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
REVOKE INSERT ON notifications FROM anon, authenticated;

-- mark_notification_read / mark_all_notifications_read are SECURITY DEFINER,
-- which bypasses RLS -- as shipped in 007 they let any signed-in user mark any
-- other user's notifications read. Scope both to the caller's own rows.
CREATE OR REPLACE FUNCTION mark_notification_read(p_notification_id UUID) RETURNS void AS $$
BEGIN
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE id = p_notification_id
      AND profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION mark_all_notifications_read(p_profile_id UUID) RETURNS void AS $$
BEGIN
    UPDATE notifications
    SET is_read = true, read_at = NOW()
    WHERE profile_id = p_profile_id AND is_read = false
      AND profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- =====================================================
-- 2. INVOICE NUMBERS: atomic counter instead of COUNT(*)+1
-- =====================================================
-- 011's generate_invoice_number() used SELECT COUNT(*)+1, so concurrent
-- webhook events could read the same count and collide on invoice_number,
-- silently losing one invoice. One counter row per YYYYMM, claimed via an
-- atomic UPSERT that serializes concurrent callers on the row lock.
CREATE TABLE IF NOT EXISTS invoice_number_counters (
    year_month TEXT PRIMARY KEY,
    last_number INTEGER NOT NULL DEFAULT 0
);

-- Server-only bookkeeping: RLS with no policies denies anon/authenticated;
-- the service role (the only writer, via the invoices trigger) bypasses RLS.
ALTER TABLE invoice_number_counters ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON invoice_number_counters FROM anon, authenticated;

-- Seed counters from invoice numbers already issued by the COUNT(*) scheme so
-- new numbers continue the sequence instead of reissuing taken ones (the month
-- is parsed from the number itself, which is what must not collide).
INSERT INTO invoice_number_counters (year_month, last_number)
SELECT split_part(invoice_number, '-', 2) || split_part(invoice_number, '-', 3),
       MAX(split_part(invoice_number, '-', 4)::INTEGER)
FROM invoices
WHERE invoice_number ~ '^INV-\d{4}-\d{2}-\d{4}$'
GROUP BY 1
ON CONFLICT (year_month)
    DO UPDATE SET last_number = GREATEST(invoice_number_counters.last_number, EXCLUDED.last_number);

CREATE OR REPLACE FUNCTION generate_invoice_number() RETURNS TEXT AS $$
DECLARE
    v_year TEXT;
    v_month TEXT;
    v_count INTEGER;
    v_invoice_number TEXT;
BEGIN
    v_year := TO_CHAR(NOW(), 'YYYY');
    v_month := TO_CHAR(NOW(), 'MM');

    -- Atomically claim the next number for this month
    INSERT INTO invoice_number_counters (year_month, last_number)
    VALUES (v_year || v_month, 1)
    ON CONFLICT (year_month)
        DO UPDATE SET last_number = invoice_number_counters.last_number + 1
    RETURNING last_number INTO v_count;

    -- Format: INV-YYYY-MM-NNNN
    v_invoice_number := 'INV-' || v_year || '-' || v_month || '-' || LPAD(v_count::TEXT, 4, '0');

    RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. FEATURED LISTINGS: server-side entitlement enforcement
-- =====================================================
-- is_featured drives the paid 'Featured' badge, and RLS only checks company
-- ownership -- so any employer could self-award unlimited featured listings via
-- the public API. Gate jobs *becoming* featured against
-- subscriptions.featured_job_limit (free = 0, so free plans are blocked;
-- -1 means unlimited). Mirrors 018's enforce_job_post_limit.
CREATE OR REPLACE FUNCTION enforce_featured_job_limit() RETURNS TRIGGER AS $$
DECLARE
    v_featured_count INTEGER;
    v_featured_limit INTEGER;
BEGIN
    IF NEW.is_featured AND (TG_OP = 'INSERT' OR OLD.is_featured IS DISTINCT FROM true) THEN
        SELECT featured_job_limit INTO v_featured_limit
        FROM subscriptions
        WHERE company_id = NEW.company_id;

        IF COALESCE(v_featured_limit, 0) <> -1 THEN
            SELECT COUNT(*) INTO v_featured_count
            FROM jobs
            WHERE company_id = NEW.company_id
            AND is_featured = true;

            IF v_featured_count >= COALESCE(v_featured_limit, 0) THEN
                RAISE EXCEPTION 'FEATURED_JOB_LIMIT_REACHED'
                    USING HINT = 'Upgrade your plan to feature more job listings.';
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS enforce_featured_job_limit_trigger ON jobs;
CREATE TRIGGER enforce_featured_job_limit_trigger
    BEFORE INSERT OR UPDATE OF is_featured ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION enforce_featured_job_limit();

-- =====================================================
-- 4. STORAGE: drop bucket-wide SELECT policies
-- =====================================================
-- These buckets are public=true, so GET/getPublicUrl reads are served by the
-- storage API without an RLS check. The bucket-wide SELECT policies from
-- 012/017 only granted anon storage.list() access, letting anyone enumerate
-- every uploaded file / user id / company id. No app code uses list().
DROP POLICY IF EXISTS "Anyone can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view company logos" ON storage.objects;
DROP POLICY IF EXISTS "Project images are publicly accessible" ON storage.objects;

-- =====================================================
-- 5. PAYMENTS: unique indexes closing webhook races
-- =====================================================
-- The webhook's idempotency guards are read-then-write, so concurrent Whop
-- redeliveries can still race past them. Unique indexes make the database the
-- final arbiter: the second concurrent insert fails instead of duplicating a
-- transaction or invoice. (Verified: no existing duplicates in production.)
CREATE UNIQUE INDEX IF NOT EXISTS uniq_payment_transactions_provider_payment_id
    ON payment_transactions (provider_payment_id)
    WHERE provider_payment_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_invoices_whop_payment_id
    ON invoices ((metadata->>'whop_payment_id'))
    WHERE metadata->>'whop_payment_id' IS NOT NULL;

-- =====================================================
-- 6. RLS PERFORMANCE: evaluate auth.uid() once per query
-- =====================================================
-- Supabase advisor: 002's policies call auth.uid() per row; wrapping it in a
-- scalar subquery makes the planner evaluate it once (InitPlan). Same
-- semantics, recreated here because 002 will not re-run in production.

-- profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
CREATE POLICY "Users can delete their own profile"
    ON profiles FOR DELETE
    USING ((select auth.uid()) = user_id);

-- companies
DROP POLICY IF EXISTS "Users can insert their own company" ON companies;
CREATE POLICY "Users can insert their own company"
    ON companies FOR INSERT
    WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own company" ON companies;
CREATE POLICY "Users can update their own company"
    ON companies FOR UPDATE
    USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own company" ON companies;
CREATE POLICY "Users can delete their own company"
    ON companies FOR DELETE
    USING ((select auth.uid()) = user_id);

-- jobs
DROP POLICY IF EXISTS "Active jobs are viewable by everyone" ON jobs;
CREATE POLICY "Active jobs are viewable by everyone"
    ON jobs FOR SELECT
    USING (status = 'active' OR status = 'closed' OR
           company_id IN (SELECT id FROM companies WHERE user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Companies can insert jobs" ON jobs;
CREATE POLICY "Companies can insert jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        company_id IN (SELECT id FROM companies WHERE user_id = (select auth.uid()))
    );

DROP POLICY IF EXISTS "Companies can update their own jobs" ON jobs;
CREATE POLICY "Companies can update their own jobs"
    ON jobs FOR UPDATE
    USING (
        company_id IN (SELECT id FROM companies WHERE user_id = (select auth.uid()))
    );

DROP POLICY IF EXISTS "Companies can delete their own jobs" ON jobs;
CREATE POLICY "Companies can delete their own jobs"
    ON jobs FOR DELETE
    USING (
        company_id IN (SELECT id FROM companies WHERE user_id = (select auth.uid()))
    );

-- applications
DROP POLICY IF EXISTS "Users can view relevant applications" ON applications;
CREATE POLICY "Users can view relevant applications"
    ON applications FOR SELECT
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid()))
        OR
        job_id IN (
            SELECT j.id FROM jobs j
            INNER JOIN companies c ON j.company_id = c.id
            WHERE c.user_id = (select auth.uid())
        )
    );

DROP POLICY IF EXISTS "Job seekers can create applications" ON applications;
CREATE POLICY "Job seekers can create applications"
    ON applications FOR INSERT
    WITH CHECK (
        profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid()))
    );

DROP POLICY IF EXISTS "Users can update relevant applications" ON applications;
CREATE POLICY "Users can update relevant applications"
    ON applications FOR UPDATE
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid()))
        OR
        job_id IN (
            SELECT j.id FROM jobs j
            INNER JOIN companies c ON j.company_id = c.id
            WHERE c.user_id = (select auth.uid())
        )
    );

DROP POLICY IF EXISTS "Job seekers can delete their own applications" ON applications;
CREATE POLICY "Job seekers can delete their own applications"
    ON applications FOR DELETE
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid()))
    );

-- saved_jobs
DROP POLICY IF EXISTS "Users can view their own saved jobs" ON saved_jobs;
CREATE POLICY "Users can view their own saved jobs"
    ON saved_jobs FOR SELECT
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid()))
    );

DROP POLICY IF EXISTS "Users can save jobs" ON saved_jobs;
CREATE POLICY "Users can save jobs"
    ON saved_jobs FOR INSERT
    WITH CHECK (
        profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid()))
    );

DROP POLICY IF EXISTS "Users can delete their saved jobs" ON saved_jobs;
CREATE POLICY "Users can delete their saved jobs"
    ON saved_jobs FOR DELETE
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = (select auth.uid()))
    );
