-- GHL Hire Row Level Security Policies
-- Migration: 002_row_level_security
-- Description: Comprehensive RLS policies for data protection

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- NOTE: RLS is enabled for job_alerts, subscriptions, and notifications in their respective migration files

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Anyone can view profiles (for displaying applicant info to employers)
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
    ON profiles FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- COMPANIES POLICIES
-- =====================================================

-- Anyone can view companies
CREATE POLICY "Companies are viewable by everyone"
    ON companies FOR SELECT
    USING (true);

-- Users can insert their own company
CREATE POLICY "Users can insert their own company"
    ON companies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own company
CREATE POLICY "Users can update their own company"
    ON companies FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own company
CREATE POLICY "Users can delete their own company"
    ON companies FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- JOBS POLICIES
-- =====================================================

-- Anyone can view active jobs
CREATE POLICY "Active jobs are viewable by everyone"
    ON jobs FOR SELECT
    USING (status = 'active' OR status = 'closed' OR
           company_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- Companies can insert jobs
CREATE POLICY "Companies can insert jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
    );

-- Companies can update their own jobs
CREATE POLICY "Companies can update their own jobs"
    ON jobs FOR UPDATE
    USING (
        company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
    );

-- Companies can delete their own jobs
CREATE POLICY "Companies can delete their own jobs"
    ON jobs FOR DELETE
    USING (
        company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
    );

-- =====================================================
-- APPLICATIONS POLICIES
-- =====================================================

-- Job seekers can view their own applications
-- Employers can view applications to their jobs
CREATE POLICY "Users can view relevant applications"
    ON applications FOR SELECT
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        OR
        job_id IN (
            SELECT j.id FROM jobs j
            INNER JOIN companies c ON j.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

-- Job seekers can create applications
CREATE POLICY "Job seekers can create applications"
    ON applications FOR INSERT
    WITH CHECK (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Job seekers can update their own applications (e.g., withdraw)
-- Employers can update applications to their jobs (e.g., change status)
CREATE POLICY "Users can update relevant applications"
    ON applications FOR UPDATE
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
        OR
        job_id IN (
            SELECT j.id FROM jobs j
            INNER JOIN companies c ON j.company_id = c.id
            WHERE c.user_id = auth.uid()
        )
    );

-- Job seekers can delete their own applications
CREATE POLICY "Job seekers can delete their own applications"
    ON applications FOR DELETE
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- =====================================================
-- SAVED JOBS POLICIES
-- =====================================================

-- Users can view their own saved jobs
CREATE POLICY "Users can view their own saved jobs"
    ON saved_jobs FOR SELECT
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Users can save jobs
CREATE POLICY "Users can save jobs"
    ON saved_jobs FOR INSERT
    WITH CHECK (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- Users can delete their saved jobs
CREATE POLICY "Users can delete their saved jobs"
    ON saved_jobs FOR DELETE
    USING (
        profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    );

-- =====================================================
-- NOTE: RLS policies for the following tables are in their respective migrations:
-- - job_alerts (see 004_job_alerts.sql)
-- - subscriptions (see 011_subscriptions.sql)
-- - notifications (see 007_notifications.sql)
-- =====================================================
