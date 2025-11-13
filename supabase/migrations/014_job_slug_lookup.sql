-- Drop existing function if it exists
DROP FUNCTION IF EXISTS find_job_by_slug(text);

-- Create a function to find jobs by slug (short ID prefix)
CREATE OR REPLACE FUNCTION find_job_by_slug(slug_prefix text)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  requirements text,
  benefits text,
  salary_min integer,
  salary_max integer,
  salary_currency text,
  location text,
  remote boolean,
  job_type text,
  experience_level text,
  company_id uuid,
  status text,
  is_featured boolean,
  views_count integer,
  applications_count integer,
  expires_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  company_name text,
  company_description text,
  company_logo_url text,
  company_website text,
  company_size text,
  company_industry text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    j.title,
    j.description,
    j.requirements,
    j.benefits,
    j.salary_min,
    j.salary_max,
    j.salary_currency,
    j.location,
    j.remote,
    j.job_type,
    j.experience_level,
    j.company_id,
    j.status,
    j.is_featured,
    j.views_count,
    j.applications_count,
    j.expires_at,
    j.created_at,
    j.updated_at,
    c.company_name,
    c.description as company_description,
    c.logo_url as company_logo_url,
    c.website as company_website,
    c.size as company_size,
    c.industry as company_industry
  FROM jobs j
  LEFT JOIN companies c ON j.company_id = c.id
  WHERE j.id::text ILIKE slug_prefix || '%'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;
