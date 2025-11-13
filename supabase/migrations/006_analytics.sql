-- Job Analytics Table
CREATE TABLE IF NOT EXISTS job_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    clicks_count INTEGER DEFAULT 0,
    unique_visitors_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, date)
);

-- Platform Analytics Table (daily aggregates)
CREATE TABLE IF NOT EXISTS platform_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE UNIQUE,
    total_jobs_posted INTEGER DEFAULT 0,
    total_applications INTEGER DEFAULT 0,
    total_new_users INTEGER DEFAULT 0,
    total_job_seekers INTEGER DEFAULT 0,
    total_employers INTEGER DEFAULT 0,
    total_active_jobs INTEGER DEFAULT 0,
    total_page_views INTEGER DEFAULT 0,
    total_unique_visitors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application Source Tracking
CREATE TABLE IF NOT EXISTS application_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
    source TEXT, -- direct, job_alert, email, search, recommendation
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job View Events
CREATE TABLE IF NOT EXISTS job_view_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_id TEXT,
    referrer TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_job_analytics_job_id ON job_analytics(job_id);
CREATE INDEX idx_job_analytics_date ON job_analytics(date DESC);
CREATE INDEX idx_job_analytics_job_date ON job_analytics(job_id, date DESC);

CREATE INDEX idx_platform_analytics_date ON platform_analytics(date DESC);

CREATE INDEX idx_application_sources_application_id ON application_sources(application_id);
CREATE INDEX idx_application_sources_source ON application_sources(source);

CREATE INDEX idx_job_view_events_job_id ON job_view_events(job_id);
CREATE INDEX idx_job_view_events_profile_id ON job_view_events(profile_id);
CREATE INDEX idx_job_view_events_created_at ON job_view_events(created_at DESC);

-- Triggers for updated_at
CREATE TRIGGER update_job_analytics_updated_at
    BEFORE UPDATE ON job_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_analytics_updated_at
    BEFORE UPDATE ON platform_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for Job Analytics
ALTER TABLE job_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view analytics for their jobs"
    ON job_analytics FOR SELECT
    USING (
        job_id IN (
            SELECT id FROM jobs
            WHERE company_id IN (
                SELECT id FROM companies
                WHERE user_id = auth.uid()
            )
        )
    );

-- RLS Policies for Platform Analytics (admin only - will need admin role setup)
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view platform analytics"
    ON platform_analytics FOR SELECT
    USING (true);

-- RLS Policies for Application Sources
ALTER TABLE application_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view sources for applications to their jobs"
    ON application_sources FOR SELECT
    USING (
        application_id IN (
            SELECT a.id FROM applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE j.company_id IN (
                SELECT id FROM companies
                WHERE user_id = auth.uid()
            )
        )
    );

-- RLS Policies for Job View Events
ALTER TABLE job_view_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view events for their jobs"
    ON job_view_events FOR SELECT
    USING (
        job_id IN (
            SELECT id FROM jobs
            WHERE company_id IN (
                SELECT id FROM companies
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Anyone can insert view events"
    ON job_view_events FOR INSERT
    WITH CHECK (true);

-- Function to update job analytics
CREATE OR REPLACE FUNCTION update_job_analytics(
    p_job_id UUID,
    p_event_type TEXT
) RETURNS void AS $$
BEGIN
    INSERT INTO job_analytics (job_id, date)
    VALUES (p_job_id, CURRENT_DATE)
    ON CONFLICT (job_id, date) DO UPDATE SET
        views_count = CASE WHEN p_event_type = 'view' THEN job_analytics.views_count + 1 ELSE job_analytics.views_count END,
        applications_count = CASE WHEN p_event_type = 'application' THEN job_analytics.applications_count + 1 ELSE job_analytics.applications_count END,
        saves_count = CASE WHEN p_event_type = 'save' THEN job_analytics.saves_count + 1 ELSE job_analytics.saves_count END,
        clicks_count = CASE WHEN p_event_type = 'click' THEN job_analytics.clicks_count + 1 ELSE job_analytics.clicks_count END,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to aggregate platform analytics daily
CREATE OR REPLACE FUNCTION aggregate_platform_analytics() RETURNS void AS $$
DECLARE
    v_date DATE := CURRENT_DATE;
    v_jobs_posted INTEGER;
    v_applications INTEGER;
    v_new_profiles INTEGER;
    v_new_companies INTEGER;
    v_total_profiles INTEGER;
    v_total_companies INTEGER;
    v_active_jobs INTEGER;
    v_page_views BIGINT;
BEGIN
    -- Count jobs posted today
    SELECT COUNT(*) INTO v_jobs_posted
    FROM jobs
    WHERE created_at::date = v_date;

    -- Count applications submitted today
    SELECT COUNT(*) INTO v_applications
    FROM applications
    WHERE applied_at::date = v_date;

    -- Count new profiles created today
    SELECT COUNT(*) INTO v_new_profiles
    FROM profiles
    WHERE created_at::date = v_date;

    -- Count new companies created today
    SELECT COUNT(*) INTO v_new_companies
    FROM companies
    WHERE created_at::date = v_date;

    -- Count total active profiles
    SELECT COUNT(*) INTO v_total_profiles
    FROM profiles
    WHERE is_available = true;

    -- Count total active companies
    SELECT COUNT(*) INTO v_total_companies
    FROM companies;

    -- Count currently active jobs
    SELECT COUNT(*) INTO v_active_jobs
    FROM jobs
    WHERE status = 'active';

    -- Sum page views from job analytics for today
    SELECT COALESCE(SUM(views_count), 0) INTO v_page_views
    FROM job_analytics
    WHERE date = v_date;

    -- Insert or update platform analytics
    INSERT INTO platform_analytics (
        date,
        total_jobs_posted,
        total_applications,
        total_new_users,
        total_job_seekers,
        total_employers,
        total_active_jobs,
        total_page_views
    ) VALUES (
        v_date,
        v_jobs_posted,
        v_applications,
        v_new_profiles + v_new_companies,
        v_total_profiles,
        v_total_companies,
        v_active_jobs,
        v_page_views
    )
    ON CONFLICT (date) DO UPDATE SET
        total_jobs_posted = EXCLUDED.total_jobs_posted,
        total_applications = EXCLUDED.total_applications,
        total_new_users = EXCLUDED.total_new_users,
        total_job_seekers = EXCLUDED.total_job_seekers,
        total_employers = EXCLUDED.total_employers,
        total_active_jobs = EXCLUDED.total_active_jobs,
        total_page_views = EXCLUDED.total_page_views,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
