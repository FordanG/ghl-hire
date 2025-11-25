'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface SavedJobWithDetails {
  id: string;
  saved_at: string;
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    job_type: string;
    experience_level: string | null;
    salary_min: number | null;
    salary_max: number | null;
    remote: boolean;
    created_at: string;
    company: {
      id: string;
      company_name: string;
      logo_url: string | null;
    };
  };
}

export interface SavedJobsActionResult {
  success: boolean;
  error?: string;
  data?: SavedJobWithDetails[];
  count?: number;
}

export interface SavedJobActionResult {
  success: boolean;
  error?: string;
  isSaved?: boolean;
}

/**
 * Get all saved jobs for the current user
 */
export async function getSavedJobs(): Promise<SavedJobsActionResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        error: 'Profile not found'
      };
    }

    // Get saved jobs with job and company details
    const { data: savedJobs, error: savedJobsError } = await supabase
      .from('saved_jobs')
      .select(`
        id,
        saved_at,
        job:jobs (
          id,
          title,
          description,
          location,
          job_type,
          experience_level,
          salary_min,
          salary_max,
          remote,
          created_at,
          company:companies (
            id,
            company_name,
            logo_url
          )
        )
      `)
      .eq('profile_id', profile.id)
      .order('saved_at', { ascending: false });

    if (savedJobsError) {
      return {
        success: false,
        error: savedJobsError.message
      };
    }

    // Filter out any saved jobs where the job was deleted
    const validSavedJobs = savedJobs?.filter(sj => sj.job !== null) || [];

    return {
      success: true,
      data: validSavedJobs as unknown as SavedJobWithDetails[],
      count: validSavedJobs.length
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Save a job for the current user
 */
export async function saveJob(jobId: string): Promise<SavedJobActionResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        error: 'Profile not found'
      };
    }

    // Check if already saved
    const { data: existing } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('profile_id', profile.id)
      .eq('job_id', jobId)
      .single();

    if (existing) {
      return {
        success: true,
        isSaved: true
      };
    }

    // Save the job
    const { error: saveError } = await supabase
      .from('saved_jobs')
      .insert({
        profile_id: profile.id,
        job_id: jobId
      });

    if (saveError) {
      return {
        success: false,
        error: saveError.message
      };
    }

    revalidatePath('/dashboard/saved');
    revalidatePath(`/jobs/${jobId}`);

    return {
      success: true,
      isSaved: true
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Unsave/remove a saved job for the current user
 */
export async function unsaveJob(jobId: string): Promise<SavedJobActionResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        error: 'Profile not found'
      };
    }

    // Remove the saved job
    const { error: deleteError } = await supabase
      .from('saved_jobs')
      .delete()
      .eq('profile_id', profile.id)
      .eq('job_id', jobId);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message
      };
    }

    revalidatePath('/dashboard/saved');
    revalidatePath(`/jobs/${jobId}`);

    return {
      success: true,
      isSaved: false
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Check if a job is saved by the current user
 */
export async function isJobSaved(jobId: string): Promise<SavedJobActionResult> {
  try {
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: true,
        isSaved: false
      };
    }

    // Get user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      return {
        success: true,
        isSaved: false
      };
    }

    // Check if saved
    const { data: existing } = await supabase
      .from('saved_jobs')
      .select('id')
      .eq('profile_id', profile.id)
      .eq('job_id', jobId)
      .single();

    return {
      success: true,
      isSaved: !!existing
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
      isSaved: false
    };
  }
}

/**
 * Toggle save status for a job
 */
export async function toggleSaveJob(jobId: string): Promise<SavedJobActionResult> {
  const result = await isJobSaved(jobId);

  if (result.isSaved) {
    return unsaveJob(jobId);
  } else {
    return saveJob(jobId);
  }
}
