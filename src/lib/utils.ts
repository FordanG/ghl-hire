/**
 * Utility functions for GHL Hire
 */

/**
 * Generate a URL-friendly slug from a job title and ID
 * Format: job-title-slug-{short-id}
 * Example: "Senior GHL Developer" -> "senior-ghl-developer-acb5537b"
 */
export function generateJobSlug(title: string, id: string): string {
  // Create slug from title
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Use first 8 characters of ID for uniqueness
  const shortId = id.split('-')[0];

  return `${titleSlug}-${shortId}`;
}

/**
 * Extract job ID from a slug
 * Format: job-title-slug-{short-id}
 * Returns the short ID which we'll use to query the full job
 */
export function extractJobIdFromSlug(slug: string): string {
  // The ID is the last segment after the final hyphen
  const segments = slug.split('-');
  return segments[segments.length - 1];
}

/**
 * Format a date string to relative time
 * Example: "2 days ago", "3 weeks ago"
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}
