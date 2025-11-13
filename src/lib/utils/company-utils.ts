import { Database } from '@/types/supabase';

type Company = Database['public']['Tables']['companies']['Row'];

/**
 * Calculate company profile completion percentage
 */
export function calculateCompanyProfileCompletion(company: Company | null): number {
  if (!company) return 0;

  const fields = [
    company.company_name, // Required - always filled
    company.email, // Required - always filled
    company.logo_url,
    company.website,
    company.description,
    company.size,
    company.industry,
    company.location
  ];

  const filledFields = fields.filter(field => field && field.toString().trim().length > 0).length;
  return Math.round((filledFields / fields.length) * 100);
}
