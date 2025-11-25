'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface JobAlert {
  id: string;
  profile_id: string;
  title: string;
  keywords: string[] | null;
  location: string | null;
  job_type: string | null;
  experience_level: string | null;
  remote_only: boolean;
  salary_min: number | null;
  frequency: 'daily' | 'weekly' | 'instant';
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobAlertFormData {
  title: string;
  keywords?: string[];
  location?: string;
  job_type?: string;
  experience_level?: string;
  remote_only?: boolean;
  salary_min?: number;
  frequency: 'daily' | 'weekly' | 'instant';
}

export interface JobAlertsActionResult {
  success: boolean;
  error?: string;
  data?: JobAlert[];
  count?: number;
}

export interface JobAlertActionResult {
  success: boolean;
  error?: string;
  data?: JobAlert;
}

/**
 * Get all job alerts for the current user
 */
export async function getJobAlerts(): Promise<JobAlertsActionResult> {
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

    // Get job alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('job_alerts')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false });

    if (alertsError) {
      return {
        success: false,
        error: alertsError.message
      };
    }

    return {
      success: true,
      data: alerts as JobAlert[],
      count: alerts?.length || 0
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Create a new job alert
 */
export async function createJobAlert(formData: JobAlertFormData): Promise<JobAlertActionResult> {
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

    // Validate required fields
    if (!formData.title) {
      return {
        success: false,
        error: 'Alert name is required'
      };
    }

    // Create job alert
    const { data: alert, error: createError } = await supabase
      .from('job_alerts')
      .insert({
        profile_id: profile.id,
        title: formData.title,
        keywords: formData.keywords || null,
        location: formData.location || null,
        job_type: formData.job_type || null,
        experience_level: formData.experience_level || null,
        remote_only: formData.remote_only || false,
        salary_min: formData.salary_min || null,
        frequency: formData.frequency,
        is_active: true
      })
      .select()
      .single();

    if (createError) {
      return {
        success: false,
        error: createError.message
      };
    }

    revalidatePath('/dashboard/alerts');

    return {
      success: true,
      data: alert as JobAlert
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Update a job alert
 */
export async function updateJobAlert(
  alertId: string,
  formData: Partial<JobAlertFormData> & { is_active?: boolean }
): Promise<JobAlertActionResult> {
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

    // Update job alert (RLS will ensure user owns it)
    const { data: alert, error: updateError } = await supabase
      .from('job_alerts')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', alertId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      };
    }

    revalidatePath('/dashboard/alerts');

    return {
      success: true,
      data: alert as JobAlert
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Toggle job alert active status
 */
export async function toggleJobAlert(alertId: string): Promise<JobAlertActionResult> {
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

    // Get current alert status
    const { data: currentAlert, error: fetchError } = await supabase
      .from('job_alerts')
      .select('is_active')
      .eq('id', alertId)
      .single();

    if (fetchError || !currentAlert) {
      return {
        success: false,
        error: 'Alert not found'
      };
    }

    // Toggle status
    const { data: alert, error: updateError } = await supabase
      .from('job_alerts')
      .update({
        is_active: !currentAlert.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', alertId)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      };
    }

    revalidatePath('/dashboard/alerts');

    return {
      success: true,
      data: alert as JobAlert
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Delete a job alert
 */
export async function deleteJobAlert(alertId: string): Promise<{ success: boolean; error?: string }> {
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

    // Delete job alert (RLS will ensure user owns it)
    const { error: deleteError } = await supabase
      .from('job_alerts')
      .delete()
      .eq('id', alertId);

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message
      };
    }

    revalidatePath('/dashboard/alerts');

    return {
      success: true
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}
