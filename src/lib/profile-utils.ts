import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Calculate profile completion percentage
 */
export function calculateProfileCompletion(profile: Profile | null): number {
  if (!profile) return 0;

  const fields = [
    profile.full_name,
    profile.email,
    profile.phone,
    profile.location,
    profile.bio,
    profile.skills && profile.skills.length > 0,
    profile.experience_years !== null,
    profile.linkedin_url,
    profile.portfolio_url,
    profile.resume_url,
    profile.profile_photo_url
  ];

  const completedFields = fields.filter(field => !!field).length;
  return Math.round((completedFields / fields.length) * 100);
}

/**
 * Helper function to validate URLs
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
