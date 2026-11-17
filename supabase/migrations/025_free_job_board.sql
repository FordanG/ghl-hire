-- 025: GHL Hire becomes a free job board (2026-11-18)
--
-- 1. Posting is free: the per-plan job limit becomes a flat anti-spam cap.
-- 2. Featured placement is sold by email (hello@vendrato.com), so only an
--    admin / the service role can switch is_featured on.
-- 3. Listings can link out: apply_url sends applicants to the employer's own
--    posting. Curated listings (roles found on employer career pages) have no
--    company account; they carry external_company_name instead.
-- 4. Email capture: newsletter_subscribers (service role only).

-- ---------------------------------------------------------------
-- Jobs: external apply link + curated listings
-- ---------------------------------------------------------------
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS apply_url TEXT,
  ADD COLUMN IF NOT EXISTS source_name TEXT,
  ADD COLUMN IF NOT EXISTS external_company_name TEXT,
  ADD COLUMN IF NOT EXISTS external_company_url TEXT,
  ADD COLUMN IF NOT EXISTS salary_period TEXT NOT NULL DEFAULT 'year';

ALTER TABLE jobs ALTER COLUMN company_id DROP NOT NULL;

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_salary_period_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_salary_period_check
  CHECK (salary_period IN ('year', 'month', 'hour'));

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_owner_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_owner_check
  CHECK (company_id IS NOT NULL OR external_company_name IS NOT NULL);

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_apply_url_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_apply_url_check
  CHECK (apply_url IS NULL OR apply_url ~* '^https://[^[:space:]]+$');

CREATE INDEX IF NOT EXISTS idx_jobs_active_board
  ON jobs (is_featured DESC, created_at DESC) WHERE status = 'active';

-- ---------------------------------------------------------------
-- Free posting: flat anti-spam cap instead of plan limits
-- (SECURITY INVOKER on purpose: caller_is_privileged() reads current_user,
-- which a SECURITY DEFINER function would mask.)
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION enforce_job_post_limit() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
    v_active INTEGER;
BEGIN
    IF caller_is_privileged() OR NEW.company_id IS NULL THEN
        RETURN NEW;
    END IF;

    IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'active') THEN
        SELECT COUNT(*) INTO v_active
        FROM jobs
        WHERE company_id = NEW.company_id AND status = 'active';

        IF v_active >= 25 THEN
            RAISE EXCEPTION 'JOB_POST_LIMIT_REACHED'
                USING HINT = 'You can have up to 25 active listings. Close one first, or email hello@vendrato.com.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- Featured placement is switched on by an admin after it is arranged by email.
CREATE OR REPLACE FUNCTION enforce_featured_job_limit() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
    IF caller_is_privileged() THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'INSERT' THEN
        NEW.is_featured := false;
    ELSIF NEW.is_featured IS DISTINCT FROM OLD.is_featured THEN
        -- Employers may drop their own featured flag but not raise it.
        IF NEW.is_featured THEN
            RAISE EXCEPTION 'FEATURED_BY_REQUEST'
                USING HINT = 'Featured listings are arranged by email: hello@vendrato.com.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

-- Curated-listing fields are staff-only so an employer cannot post under
-- another company's name.
CREATE OR REPLACE FUNCTION protect_job_curated_fields() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
    IF caller_is_privileged() THEN
        RETURN NEW;
    END IF;

    IF TG_OP = 'INSERT' THEN
        NEW.external_company_name := NULL;
        NEW.external_company_url := NULL;
        NEW.source_name := NULL;
    ELSE
        NEW.external_company_name := OLD.external_company_name;
        NEW.external_company_url := OLD.external_company_url;
        NEW.source_name := OLD.source_name;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_job_curated_fields_trigger ON jobs;
CREATE TRIGGER protect_job_curated_fields_trigger
    BEFORE INSERT OR UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION protect_job_curated_fields();

-- ---------------------------------------------------------------
-- Job lookup used by /jobs/[slug]: return the new columns
-- ---------------------------------------------------------------
DROP FUNCTION IF EXISTS find_job_by_slug(text);
CREATE FUNCTION find_job_by_slug(slug_prefix text)
RETURNS TABLE(
  id uuid, title text, description text, requirements text, benefits text,
  salary_min integer, salary_max integer, salary_currency text, location text,
  remote boolean, job_type text, experience_level text, company_id uuid,
  status text, is_featured boolean, views_count integer, applications_count integer,
  expires_at timestamptz, created_at timestamptz, updated_at timestamptz,
  company_name text, company_description text, company_logo_url text,
  company_website text, company_size text, company_industry text,
  apply_url text, source_name text, salary_period text, is_curated boolean
)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id, j.title, j.description, j.requirements, j.benefits,
    j.salary_min, j.salary_max, j.salary_currency, j.location,
    j.remote, j.job_type, j.experience_level, j.company_id,
    j.status, j.is_featured, j.views_count, j.applications_count,
    j.expires_at, j.created_at, j.updated_at,
    COALESCE(j.external_company_name, c.company_name),
    CASE WHEN j.company_id IS NULL THEN NULL ELSE c.description END,
    c.logo_url,
    COALESCE(j.external_company_url, c.website),
    c.size,
    c.industry,
    j.apply_url, j.source_name, j.salary_period,
    (j.company_id IS NULL)
  FROM jobs j
  LEFT JOIN companies c ON j.company_id = c.id
  WHERE j.id::text ILIKE slug_prefix || '%'
  LIMIT 1;
END;
$$;

GRANT EXECUTE ON FUNCTION find_job_by_slug(text) TO anon, authenticated, service_role;

-- ---------------------------------------------------------------
-- Email capture
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    interest TEXT CHECK (interest IN ('jobseeker', 'employer')),
    source TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    unsubscribed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_key
  ON newsletter_subscribers (lower(email));

-- No policies: only the service role (API route) reads or writes.
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
