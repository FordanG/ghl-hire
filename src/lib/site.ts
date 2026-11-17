/** Site-wide constants for the free job board. */

export const SITE_URL = 'https://ghlhire.com';

/** Affiliate link: keep the ref parameter. */
export const SUPER_CLONER_URL = 'https://supercloner.app/?ref=3nojbk';

/** Featured listings are paid and arranged by email. */
export const FEATURED_EMAIL = 'hello@vendrato.com';

export function featuredMailto(jobTitle?: string): string {
  const subject = jobTitle
    ? `Featured listing on GHL Hire: ${jobTitle}`
    : 'Featured listing on GHL Hire';
  const body = [
    'Hi,',
    '',
    'I would like to feature a job on GHL Hire.',
    '',
    'Company:',
    'Job title or link:',
    'When it should start:',
  ].join('\n');
  return `mailto:${FEATURED_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
