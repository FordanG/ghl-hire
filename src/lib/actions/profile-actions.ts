'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';
import { isValidUrl } from '@/lib/profile-utils';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export interface ProfileFormData {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience_years?: number;
  linkedin_url?: string;
  portfolio_url?: string;
  is_available?: boolean;
}

export interface ProfileActionResult {
  success: boolean;
  error?: string;
  data?: Profile;
}

/**
 * Get the current user's profile
 */
export async function getProfile(): Promise<ProfileActionResult> {
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

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      return {
        success: false,
        error: profileError.message
      };
    }

    return {
      success: true,
      data: profile
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Update the current user's profile
 */
export async function updateProfile(formData: ProfileFormData): Promise<ProfileActionResult> {
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

    // Validate required fields
    if (!formData.full_name || !formData.email) {
      return {
        success: false,
        error: 'Name and email are required'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate phone if provided
    if (formData.phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        return {
          success: false,
          error: 'Invalid phone number format'
        };
      }
    }

    // Validate URLs if provided
    if (formData.linkedin_url && !isValidUrl(formData.linkedin_url)) {
      return {
        success: false,
        error: 'Invalid LinkedIn URL'
      };
    }

    if (formData.portfolio_url && !isValidUrl(formData.portfolio_url)) {
      return {
        success: false,
        error: 'Invalid portfolio URL'
      };
    }

    // Prepare update data
    const updateData: ProfileUpdate = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone || null,
      location: formData.location || null,
      bio: formData.bio || null,
      skills: formData.skills || null,
      experience_years: formData.experience_years || null,
      linkedin_url: formData.linkedin_url || null,
      portfolio_url: formData.portfolio_url || null,
      is_available: formData.is_available ?? null,
      updated_at: new Date().toISOString()
    };

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      };
    }

    // Revalidate the profile page
    revalidatePath('/dashboard/profile');

    return {
      success: true,
      data: profile
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Upload a resume file to Supabase Storage
 */
export async function uploadResume(formData: FormData): Promise<ProfileActionResult> {
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

    const file = formData.get('file') as File;

    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only PDF and Word documents are allowed.'
      };
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 10MB'
      };
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/resume-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(uploadData.path);

    // Update profile with resume URL
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({
        resume_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      };
    }

    // Revalidate the profile page
    revalidatePath('/dashboard/profile');

    return {
      success: true,
      data: profile
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Upload a profile photo to Supabase Storage
 */
export async function uploadProfilePhoto(formData: FormData): Promise<ProfileActionResult> {
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

    const file = formData.get('file') as File;

    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.'
      };
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      };
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/profile-${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(uploadData.path);

    // Update profile with photo URL
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({
        profile_photo_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      return {
        success: false,
        error: updateError.message
      };
    }

    // Revalidate the profile page
    revalidatePath('/dashboard/profile');

    return {
      success: true,
      data: profile
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

