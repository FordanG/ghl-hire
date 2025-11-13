-- Migration: Job View Counter Function
-- Description: Creates a database function to safely increment job view counts
-- Date: 2025-11-14

-- Function to increment job view count atomically
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE jobs
  SET views_count = views_count + 1
  WHERE id = job_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_job_views(UUID) TO authenticated;

-- Grant execute permission to anonymous users (for public job viewing)
GRANT EXECUTE ON FUNCTION increment_job_views(UUID) TO anon;

-- Add comment
COMMENT ON FUNCTION increment_job_views IS 'Atomically increments the view count for a job. Can be called by authenticated and anonymous users.';
