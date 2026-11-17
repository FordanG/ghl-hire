/** Site-wide constants for the free job board. */

export const SITE_URL = 'https://ghlhire.com';

/** Affiliate link: keep the ref parameter. */
export const SUPER_CLONER_URL = 'https://supercloner.app/?ref=3nojbk';

/** The one public inbox (Mango Mail mailbox, forwarded to Gabriel's Gmail). */
export const CONTACT_EMAIL = 'inquiries@ghlhire.com';

/** Featured listings are paid; requests come in through the form on /featured. */
export const FEATURED_EMAIL = CONTACT_EMAIL;
export const FEATURED_REQUEST_PATH = '/featured#request';

/** HighLevel affiliate links: keep the fp_ref parameter. */
export const GHL_TRIAL_URL = 'https://www.gohighlevel.com/?fp_ref=vendrato';
export const GHL_BOOTCAMP_URL = 'https://www.gohighlevel.com/highlevel-bootcamp?fp_ref=vendrato';

export const AFFILIATE_NOTE =
  'Some links on GHL Hire are affiliate links. If you buy through them we may earn a commission, at no extra cost to you.';

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
