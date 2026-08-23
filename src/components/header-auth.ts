type UserType = 'jobseeker' | 'employer' | null;

type HeaderAuthView =
  | { state: 'loading' }
  | { state: 'signed-out' }
  | {
      state: 'signed-in';
      accountLabel: string;
      dashboardHref: string;
      profileHref: string;
      applicationsHref: string;
      isEmployer: boolean;
    };

type HeaderAuthInput = {
  loading: boolean;
  userEmail?: string | null;
  userType: UserType;
  profileName?: string | null;
  companyName?: string | null;
};

export function getHeaderAuthView({
  loading,
  userEmail,
  userType,
  profileName,
  companyName,
}: HeaderAuthInput): HeaderAuthView {
  if (loading) return { state: 'loading' };
  if (!userEmail) return { state: 'signed-out' };

  const isEmployer =
    userType === 'employer' || (userType === null && !profileName && Boolean(companyName));

  return {
    state: 'signed-in',
    accountLabel:
      profileName?.trim() || companyName?.trim() || userEmail.trim() || 'Account',
    dashboardHref: isEmployer ? '/company/dashboard' : '/dashboard',
    profileHref: isEmployer ? '/company/dashboard/profile' : '/dashboard/profile',
    applicationsHref: isEmployer
      ? '/company/dashboard/applications'
      : '/dashboard/applications',
    isEmployer,
  };
}
