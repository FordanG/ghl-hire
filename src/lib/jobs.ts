/**
 * Shared job-listing shape and display helpers for the public board.
 * Kept free of client/server imports so both sides can use it.
 */

export interface BoardJob {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  salary_currency?: string | null;
  salary_period?: string | null;
  remote?: boolean | null;
  is_featured?: boolean | null;
  created_at?: string | null;
  company_id?: string | null;
  apply_url?: string | null;
  source_name?: string | null;
  external_company_name?: string | null;
  external_company_url?: string | null;
  /** Jobs list only: every distinct word of the listing, lowercased, for in-browser search. */
  search_text?: string;
  company?: { company_name?: string | null; logo_url?: string | null; is_verified?: boolean | null } | null;
}

/** Columns the board needs. `*` keeps the query valid across schema versions. */
export const BOARD_JOB_SELECT = '*, company:companies(company_name, logo_url, is_verified)';

export function companyName(job: Pick<BoardJob, 'external_company_name' | 'company'>): string {
  return job.external_company_name?.trim() || job.company?.company_name?.trim() || 'Company';
}

const UNNAMED = ' (employer not named)';

/** Splits "Marketing agency (employer not named)" so the note can be shown quietly. */
export function splitEmployer(name: string): { name: string; unnamed: boolean } {
  return name.endsWith(UNNAMED)
    ? { name: name.slice(0, -UNNAMED.length), unnamed: true }
    : { name, unnamed: false };
}

/** Two-letter monogram for the hexagon tile. */
export function monogram(name: string): string {
  const words = splitEmployer(name).name.replace(/[^\p{L}\p{N}\s]/gu, ' ').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'GH';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const CURRENCY_SYMBOL: Record<string, string> = {
  USD: '$', PHP: '₱', GBP: '£', EUR: '€', AUD: 'A$', CAD: 'C$', INR: '₹', NZD: 'NZ$', SGD: 'S$',
};

function money(value: number, currency: string): string {
  const symbol = CURRENCY_SYMBOL[currency] ?? `${currency} `;
  if (value >= 10000 && value % 1000 === 0) return `${symbol}${value / 1000}k`;
  return `${symbol}${value.toLocaleString('en-US')}`;
}

const PERIOD_LABEL: Record<string, string> = { year: '/yr', month: '/mo', hour: '/hr' };

/** "$65k to $85k /yr", "₱60,000 /mo", "$25 to $40 /hr", or '' when unpublished. */
export function formatSalary(job: Pick<BoardJob, 'salary_min' | 'salary_max' | 'salary_currency' | 'salary_period'>): string {
  const min = job.salary_min ?? null;
  const max = job.salary_max ?? null;
  if (!min && !max) return '';
  const currency = job.salary_currency || 'USD';
  // Listings saved before salary_period existed: small numbers were hourly rates.
  const period = job.salary_period || ((max ?? min ?? 0) < 1000 ? 'hour' : 'year');
  const suffix = ` ${PERIOD_LABEL[period] ?? ''}`.trimEnd();
  if (min && max && min !== max) return `${money(min, currency)} to ${money(max, currency)}${suffix}`;
  if (min && max) return `${money(min, currency)}${suffix}`;
  if (min) return `From ${money(min, currency)}${suffix}`;
  return `Up to ${money(max as number, currency)}${suffix}`;
}

export function postedAgo(dateString?: string | null, now: Date = new Date()): string {
  if (!dateString) return '';
  const days = Math.floor((now.getTime() - new Date(dateString).getTime()) / 86400000);
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return '1 month ago';
  return `${Math.floor(days / 30)} months ago`;
}

export function isNew(dateString?: string | null, now: Date = new Date()): boolean {
  if (!dateString) return false;
  return now.getTime() - new Date(dateString).getTime() < 2 * 86400000;
}

/** Location line without repeating "Remote" twice. */
export function locationLabel(job: Pick<BoardJob, 'location' | 'remote'>): string {
  const location = (job.location || '').trim();
  if (!job.remote) return location;
  if (/remote/i.test(location)) return location;
  return location ? `Remote · ${location}` : 'Remote';
}

/** Search-and-replace free text for PostgREST `or` filters. */
export function safeSearchTerm(raw: string): string {
  return raw
    .replace(/[,()"\\*:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
    .replace(/[%_]/g, (c) => `\\${c}`);
}

/**
 * Splits text into lowercase search words. The jobs page builds its word
 * index with this and the board splits the visitor's query with it, so
 * punctuation is treated the same on both sides ("Go-High" finds "go high").
 */
export function searchTokens(text: string): string[] {
  return text.toLowerCase().split(/[^\p{L}\p{N}+#.]+/u).filter(Boolean);
}

export const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Freelance'] as const;
export const EXPERIENCE_LEVELS = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead'] as const;
