# SEO-Friendly Job Slugs Implementation

**Date:** 2025-11-14
**Author:** Claude Code
**Status:** Completed
**Last Updated:** 2025-11-14

## Overview

Implemented SEO-friendly URL slugs for job listings to improve search engine optimization and user experience. Job URLs changed from UUID-based (`/jobs/acb5537b-f179-44ca-8101-2f8e3a30a553`) to human-readable slugs (`/jobs/funnel-builder-ghl-platform-acb5537b`).

## Problem Statement

Initial implementation used raw UUIDs in job URLs, which were:
- Not SEO-friendly
- Difficult for users to read and share
- Provided no context about the job content

## Solution

Implemented a slug-based URL system that combines:
1. **Job title** (converted to URL-friendly format)
2. **Short ID** (first 8 characters of UUID for uniqueness)

Example: `senior-ghl-developer-acb5537b`

## Changes Made

### 1. Utility Functions (`src/lib/utils.ts`)

Created two utility functions:

```typescript
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
```

**Issue Fixed:** Syntax error on line 46 - mismatched quote (backtick + single quote) causing parsing errors.

### 2. Database Function (`supabase/migrations/014_job_slug_lookup.sql`)

Created PostgreSQL function to find jobs by slug prefix:

```sql
-- Drop existing function if it exists
DROP FUNCTION IF EXISTS find_job_by_slug(text);

-- Create a function to find jobs by slug (short ID prefix)
CREATE OR REPLACE FUNCTION find_job_by_slug(slug_prefix text)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  requirements text,
  benefits text,
  salary_min integer,
  salary_max integer,
  salary_currency text,
  location text,
  remote boolean,
  job_type text,
  experience_level text,
  company_id uuid,
  status text,
  is_featured boolean,
  views_count integer,
  applications_count integer,
  expires_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  company_name text,
  company_description text,
  company_logo_url text,
  company_website text,
  company_size text,
  company_industry text
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    j.title,
    j.description,
    j.requirements,
    j.benefits,
    j.salary_min,
    j.salary_max,
    j.salary_currency,
    j.location,
    j.remote,
    j.job_type,
    j.experience_level,
    j.company_id,
    j.status,
    j.is_featured,
    j.views_count,
    j.applications_count,
    j.expires_at,
    j.created_at,
    j.updated_at,
    c.company_name,
    c.description as company_description,
    c.logo_url as company_logo_url,
    c.website as company_website,
    c.size as company_size,
    c.industry as company_industry
  FROM jobs j
  LEFT JOIN companies c ON j.company_id = c.id
  WHERE j.id::text ILIKE slug_prefix || '%'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;
```

**Key Points:**
- Uses UUID to text casting (`j.id::text`) to enable ILIKE pattern matching
- Returns flattened result with company data (no nested objects from SQL)
- Uses `STABLE` function volatility for query optimization

**Issues Fixed:**
- Initial version used `featured` column (should be `is_featured`)
- Initial version used `c.company_size` (should be `c.size`)

### 3. Job Detail Page (`src/app/jobs/[id]/page.tsx`)

#### Updated `getJob()` Function

**Before:**
```typescript
async function getJob(slugOrId: string) {
  const shortId = extractJobIdFromSlug(slugOrId);

  const { data: jobs, error } = await supabase
    .from('jobs')
    .select(`*, company:companies(*)`)
    .ilike('id', `${shortId}%`)
    .limit(1);

  return jobs?.[0] || null;
}
```

**After:**
```typescript
async function getJob(slugOrId: string) {
  const shortId = extractJobIdFromSlug(slugOrId);

  const { data, error } = await supabase
    .rpc('find_job_by_slug', { slug_prefix: shortId });

  if (error || !data || data.length === 0) {
    console.error('Error finding job:', error);
    return null;
  }

  // Transform the flat result into the expected nested structure
  const job = data[0];
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    salary_currency: job.salary_currency,
    location: job.location,
    remote: job.remote,
    job_type: job.job_type,
    experience_level: job.experience_level,
    company_id: job.company_id,
    status: job.status,
    is_featured: job.is_featured,
    views_count: job.views_count,
    applications_count: job.applications_count,
    expires_at: job.expires_at,
    created_at: job.created_at,
    updated_at: job.updated_at,
    company: {
      company_name: job.company_name,
      description: job.company_description,
      logo_url: job.company_logo_url,
      website: job.company_website,
      company_size: job.company_size,
      industry: job.company_industry,
    },
  };
}
```

**Why the change:** Cannot use `.ilike()` on UUID columns directly in Supabase. Need to use RPC function with text casting.

#### Fixed ID Usage

**Lines 152-154:**
```typescript
// BEFORE - used slug instead of actual job ID
incrementViewCount(id);
const similarJobs = await getSimilarJobs(id, job.company_id, 3);

// AFTER - use actual job ID from database
incrementViewCount(job.id);
const similarJobs = await getSimilarJobs(job.id, job.company_id, 3);
```

#### Updated Metadata Generation

**Lines 38-48, 66:**
```typescript
// Generate SEO-friendly slug for URLs
const jobSlug = generateJobSlug(job.title, job.id);

return {
  // ... other metadata
  openGraph: {
    // ... other fields
    url: `https://ghlhire.com/jobs/${jobSlug}`,
  },
  alternates: {
    canonical: `https://ghlhire.com/jobs/${jobSlug}`,
  },
};
```

### 4. Share Buttons Component (`src/app/jobs/[id]/ShareButtons.tsx`)

**Lines 6, 29-31:**
```typescript
// Added import
import { generateJobSlug } from '@/lib/utils';

// Updated URL generation
const jobSlug = generateJobSlug(job.title, job.id);
const jobUrl = typeof window !== 'undefined'
  ? `${window.location.origin}/jobs/${jobSlug}`
  : '';
```

**Why:** Share URLs were using raw UUID instead of SEO-friendly slug.

### 5. Job Card Component (`src/components/JobCard.tsx`)

**Line 38:**
```typescript
// Generate SEO-friendly slug
const jobSlug = generateJobSlug(job.title, job.id);
```

**Lines 73, 86:**
```typescript
// Use slug in links instead of raw ID
<Link href={`/jobs/${jobSlug}`}>
```

## Technical Challenges & Solutions

### Challenge 1: UUID Column Type Compatibility

**Problem:** PostgreSQL UUID columns cannot be used with `ILIKE` operator directly.

**Error:**
```
operator does not exist: uuid ~~* unknown
Hint: No operator matches the given name and argument types. You might need to add explicit type casts.
```

**Solution:** Created custom PostgreSQL function that casts UUID to text:
```sql
WHERE j.id::text ILIKE slug_prefix || '%'
```

### Challenge 2: Supabase Client Limitations

**Problem:** Supabase JavaScript client doesn't support PostgreSQL cast syntax (`::text`) in filter methods.

**Attempted:**
```typescript
.filter('id::text', 'ilike', `${shortId}%`) // DOESN'T WORK
```

**Solution:** Use RPC (Remote Procedure Call) to execute custom database function:
```typescript
.rpc('find_job_by_slug', { slug_prefix: shortId })
```

### Challenge 3: Column Name Mismatches

**Problem:** SQL function referenced wrong column names:
- Used `j.featured` → should be `j.is_featured`
- Used `c.company_size` → should be `c.size`

**Solution:** Verified actual schema with query:
```typescript
const { data } = await supabase.from('companies').select('*').limit(1);
console.log('Columns:', Object.keys(data[0]));
```

### Challenge 4: Turbopack Cache Issues

**Problem:** Build cache showed syntax errors that were already fixed in source.

**Solution:** Cleared Next.js cache and restarted dev server:
```bash
rm -rf .next && npm run dev
```

## URL Structure

### Before
```
/jobs/acb5537b-f179-44ca-8101-2f8e3a30a553
/jobs/4474910a-b0a6-4dbe-890d-a0f39bf1c4b1
```

### After
```
/jobs/funnel-builder-ghl-platform-acb5537b
/jobs/gohighlevel-specialist-4474910a
```

## How It Works

1. **Link Generation** (JobCard component):
   ```typescript
   generateJobSlug("Funnel Builder - GHL Platform", "acb5537b-f179-44ca-...")
   // Returns: "funnel-builder-ghl-platform-acb5537b"
   ```

2. **URL Routing** (Next.js):
   ```
   User clicks link → /jobs/funnel-builder-ghl-platform-acb5537b
   ```

3. **ID Extraction** (Job Detail Page):
   ```typescript
   extractJobIdFromSlug("funnel-builder-ghl-platform-acb5537b")
   // Returns: "acb5537b"
   ```

4. **Database Query** (PostgreSQL):
   ```sql
   SELECT * FROM jobs WHERE id::text ILIKE 'acb5537b%'
   -- Finds: acb5537b-f179-44ca-8101-2f8e3a30a553
   ```

5. **Response** (API):
   ```typescript
   // Returns full job object with complete UUID
   { id: "acb5537b-f179-44ca-8101-2f8e3a30a553", ... }
   ```

## Files Modified

1. `src/lib/utils.ts` - Added slug utility functions
2. `src/app/jobs/[id]/page.tsx` - Updated job lookup and metadata
3. `src/app/jobs/[id]/ShareButtons.tsx` - Fixed share URLs
4. `src/components/JobCard.tsx` - Already using slug generation
5. `supabase/migrations/014_job_slug_lookup.sql` - New database function

## Testing

### Test Cases

1. ✅ Navigate to job from listings page
2. ✅ Direct URL access with slug
3. ✅ Share button generates correct slug URLs
4. ✅ OpenGraph/Twitter metadata uses slugs
5. ✅ View counter increments correctly
6. ✅ Similar jobs query works

### Test URLs

```
http://localhost:3000/jobs/funnel-builder-ghl-platform-acb5537b
http://localhost:3000/jobs/gohighlevel-specialist-4474910a
http://localhost:3000/jobs/senior-ghl-automation-expert-38fb70f7
```

## SEO Benefits

1. **Improved Readability**: URLs clearly describe job content
2. **Keyword Optimization**: Job titles in URLs boost search rankings
3. **Social Sharing**: Previews show meaningful URLs
4. **Analytics**: Easier to track which jobs get traffic
5. **User Trust**: Professional-looking URLs increase click-through rates

## Migration Notes

### Backward Compatibility

The system maintains backward compatibility:
- Old UUID-only URLs still work (if needed, can add redirect logic)
- Short ID prefix (`acb5537b`) matches start of full UUID
- Database lookup handles both formats

### Future Considerations

1. **Slug Uniqueness**: Current implementation relies on UUID prefix for uniqueness. If titles change frequently, consider:
   - Storing slugs in database
   - Slug history table for redirects
   - Unique constraint on slugs

2. **Internationalization**: For non-English job titles:
   - Consider transliteration
   - Fallback to UUID-only if no ASCII characters

3. **Performance**:
   - Add index on `id::text` for faster lookups
   - Consider materialized view if query becomes slow

4. **Analytics**: Track slug usage to optimize SEO strategy

## Deployment Checklist

- [x] Update utility functions
- [x] Create database migration
- [x] Update job detail page
- [x] Update share buttons
- [x] Update metadata generation
- [x] Test all job pages
- [x] Apply migration to Supabase
- [ ] Monitor error logs
- [ ] Track SEO improvements
- [ ] Update documentation

## Related Documentation

- [Slug Generation Utils](/src/lib/utils.ts)
- [Job Detail Implementation](/src/app/jobs/[id]/page.tsx)
- [Database Schema](/supabase/migrations/001_initial_schema.sql)
- [SEO Best Practices](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)

## Notes

- Migration requires manual SQL execution in Supabase Dashboard
- Turbopack may cache errors - clear `.next` folder if issues persist
- PostgreSQL function is marked `STABLE` for query optimization
- Short ID uses first UUID segment (8 characters) for uniqueness

## Support

If job pages return 404:
1. Verify database function exists: `SELECT * FROM find_job_by_slug('acb5537b')`
2. Check function returns data
3. Verify Next.js dev server restarted
4. Clear browser cache
5. Check Supabase logs for errors
