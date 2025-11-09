import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Database Types (based on our schema)
export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  resume_url?: string;
  skills?: string[];
  experience_years?: number;
  linkedin_url?: string;
  portfolio_url?: string;
  profile_photo_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type Company = {
  id: string;
  user_id: string;
  company_name: string;
  email: string;
  logo_url?: string;
  website?: string;
  description?: string;
  size?: string;
  industry?: string;
  location?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  company_id: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  location: string;
  job_type: 'Full-Time' | 'Part-Time' | 'Contract' | 'Freelance';
  experience_level?: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Lead' | 'Executive';
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  remote: boolean;
  status: 'draft' | 'active' | 'closed' | 'archived';
  views_count: number;
  applications_count: number;
  is_featured: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  company?: Company; // Join with company data
};

export type Application = {
  id: string;
  job_id: string;
  profile_id: string;
  cover_letter?: string;
  resume_url?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted' | 'withdrawn';
  notes?: string;
  applied_at: string;
  updated_at: string;
  job?: Job; // Join with job data
  profile?: Profile; // Join with profile data
};

export type SavedJob = {
  id: string;
  profile_id: string;
  job_id: string;
  saved_at: string;
  job?: Job; // Join with job data
};

export type JobAlert = {
  id: string;
  profile_id: string;
  title: string;
  keywords?: string[];
  location?: string;
  job_type?: string;
  frequency: 'daily' | 'weekly';
  is_active: boolean;
  last_sent_at?: string;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  company_id: string;
  plan_type: 'free' | 'basic' | 'premium';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start?: string;
  current_period_end?: string;
  job_posts_used: number;
  job_post_limit: number;
  created_at: string;
  updated_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
};

// Helper functions for common queries

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get profile for current user
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

/**
 * Get company for current user
 */
export async function getCurrentCompany(): Promise<Company | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching company:', error);
    return null;
  }

  return data;
}

/**
 * Check if current user is a job seeker (has profile)
 */
export async function isJobSeeker(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile !== null;
}

/**
 * Check if current user is an employer (has company)
 */
export async function isEmployer(): Promise<boolean> {
  const company = await getCurrentCompany();
  return company !== null;
}

/**
 * Get user type (jobseeker, employer, or null if not logged in)
 */
export async function getUserType(): Promise<'jobseeker' | 'employer' | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await getCurrentProfile();
  if (profile) return 'jobseeker';

  const company = await getCurrentCompany();
  if (company) return 'employer';

  return null;
}
