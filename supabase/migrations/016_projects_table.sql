-- Migration: Projects Section for Job Seekers
-- Description: Add projects table and application_projects junction table
-- Created: 2025-11-14

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}', -- Array of technology tags
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for application-project relationship
CREATE TABLE IF NOT EXISTS application_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, project_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_profile_id ON projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(profile_id, display_order);
CREATE INDEX IF NOT EXISTS idx_application_projects_application_id ON application_projects(application_id);
CREATE INDEX IF NOT EXISTS idx_application_projects_project_id ON application_projects(project_id);

-- Add trigger to update updated_at timestamp on projects
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects table

-- Policy: Users can view all projects (for public profiles in the future)
CREATE POLICY "Projects are viewable by everyone"
  ON projects
  FOR SELECT
  USING (true);

-- Policy: Users can insert their own projects
CREATE POLICY "Users can insert their own projects"
  ON projects
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );

-- Policy: Users can update their own projects
CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
  ON projects
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM profiles WHERE id = profile_id
    )
  );

-- RLS Policies for application_projects table

-- Policy: Users can view application projects if they own the application or are viewing their own projects
CREATE POLICY "Application projects are viewable by application owner and employers"
  ON application_projects
  FOR SELECT
  USING (
    -- Job seeker can see their own application projects
    auth.uid() IN (
      SELECT p.user_id
      FROM applications a
      JOIN profiles p ON a.profile_id = p.id
      WHERE a.id = application_id
    )
    OR
    -- Employer can see projects attached to applications for their jobs
    auth.uid() IN (
      SELECT c.user_id
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN companies c ON j.company_id = c.id
      WHERE a.id = application_id
    )
  );

-- Policy: Users can insert their own application projects
CREATE POLICY "Users can insert their own application projects"
  ON application_projects
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT p.user_id
      FROM applications a
      JOIN profiles p ON a.profile_id = p.id
      WHERE a.id = application_id
    )
  );

-- Policy: Users can delete their own application projects
CREATE POLICY "Users can delete their own application projects"
  ON application_projects
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT p.user_id
      FROM applications a
      JOIN profiles p ON a.profile_id = p.id
      WHERE a.id = application_id
    )
  );

-- Add comment to tables
COMMENT ON TABLE projects IS 'Stores portfolio projects for job seeker profiles';
COMMENT ON TABLE application_projects IS 'Junction table linking projects to job applications (max 3 per application)';

-- Add column comments for documentation
COMMENT ON COLUMN projects.profile_id IS 'Reference to the profile that owns this project';
COMMENT ON COLUMN projects.title IS 'Project title/name';
COMMENT ON COLUMN projects.description IS 'Detailed description of the project';
COMMENT ON COLUMN projects.url IS 'URL to live project or repository';
COMMENT ON COLUMN projects.image_url IS 'URL to project screenshot/image stored in Supabase Storage';
COMMENT ON COLUMN projects.technologies IS 'Array of technology tags (e.g., [''React'', ''Node.js'', ''PostgreSQL''])';
COMMENT ON COLUMN projects.display_order IS 'Order in which projects should be displayed (0 = first)';
