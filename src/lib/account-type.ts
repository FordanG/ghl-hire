export type AccountType = 'jobseeker' | 'employer';

type AccountTypeInput = {
  hasProfile: boolean;
  hasCompany: boolean;
  /** `role` (or the older `user_type`) saved in auth metadata at signup. */
  signupType?: unknown;
  /** Jobs owned by the company. Only matters when both records exist. */
  companyJobCount?: number;
};

/**
 * Which side of the app an account belongs to.
 *
 * One record decides it outright. A few accounts have both a job seeker
 * profile and a company; those are routed by what they actually use: an
 * account that signed up as an employer, or whose company has posted a job,
 * is an employer. Otherwise it stays a job seeker.
 */
export function resolveAccountType({
  hasProfile,
  hasCompany,
  signupType,
  companyJobCount = 0,
}: AccountTypeInput): AccountType | null {
  if (hasProfile && hasCompany) {
    return signupType === 'employer' || companyJobCount > 0 ? 'employer' : 'jobseeker';
  }
  if (hasCompany) return 'employer';
  if (hasProfile) return 'jobseeker';
  return null;
}

/** The signup choice stored in Supabase auth user metadata. */
export function signupTypeFromMetadata(
  metadata: Record<string, unknown> | null | undefined
): unknown {
  return metadata?.role ?? metadata?.user_type;
}
