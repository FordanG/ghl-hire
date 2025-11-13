'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';

type Company = Database['public']['Tables']['companies']['Row'];
type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

export interface CompanyFormData {
  company_name: string;
  email: string;
  website?: string;
  description?: string;
  size?: string;
  industry?: string;
  location?: string;
}

export interface CompanyActionResult {
  success: boolean;
  error?: string;
  data?: Company;
}

/**
 * Get the current user's company profile
 */
export async function getCompanyProfile(): Promise<CompanyActionResult> {
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

    // Get company profile
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (companyError) {
      return {
        success: false,
        error: companyError.message
      };
    }

    return {
      success: true,
      data: company
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Update the current user's company profile
 */
export async function updateCompanyProfile(formData: CompanyFormData): Promise<CompanyActionResult> {
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
    if (!formData.company_name || !formData.email) {
      return {
        success: false,
        error: 'Company name and email are required'
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

    // Validate website URL format if provided
    if (formData.website) {
      try {
        new URL(formData.website);
        if (!formData.website.startsWith('http://') && !formData.website.startsWith('https://')) {
          return {
            success: false,
            error: 'Website URL must start with http:// or https://'
          };
        }
      } catch {
        return {
          success: false,
          error: 'Invalid website URL format'
        };
      }
    }

    // Validate company size options
    const validSizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
    if (formData.size && !validSizes.includes(formData.size)) {
      return {
        success: false,
        error: 'Invalid company size option'
      };
    }

    // Prepare update data
    const updateData: CompanyUpdate = {
      company_name: formData.company_name.trim(),
      email: formData.email.trim(),
      website: formData.website?.trim() || null,
      description: formData.description?.trim() || null,
      size: formData.size || null,
      industry: formData.industry?.trim() || null,
      location: formData.location?.trim() || null,
      updated_at: new Date().toISOString()
    };

    // Update company profile
    const { data: company, error: updateError } = await supabase
      .from('companies')
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

    // Revalidate relevant paths
    revalidatePath('/company/dashboard/profile');
    revalidatePath('/company/dashboard');

    return {
      success: true,
      data: company
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

/**
 * Upload company logo to Supabase Storage
 */
export async function uploadCompanyLogo(formData: FormData): Promise<CompanyActionResult> {
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

    // Get file from form data
    const file = formData.get('file') as File;
    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      };
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or SVG image.'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Maximum size is 5MB.'
      };
    }

    // Get company profile
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (companyError || !company) {
      return {
        success: false,
        error: 'Company profile not found'
      };
    }

    // Generate file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${company.id}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('company-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return {
        success: false,
        error: uploadError.message
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(filePath);

    // Update company profile with logo URL
    const { data: updatedCompany, error: updateError } = await supabase
      .from('companies')
      .update({
        logo_url: publicUrl,
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

    // Revalidate relevant paths
    revalidatePath('/company/dashboard/profile');
    revalidatePath('/company/dashboard');

    return {
      success: true,
      data: updatedCompany
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
    };
  }
}

