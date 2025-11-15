# Technical Debt: Projects Feature Database & Storage Setup

**Date**: 2025-11-14
**Priority**: HIGH
**Status**: COMPLETED
**Completed Date**: 2025-11-15
**Related Story**: P0-6.1 Projects Section for Job Seekers

## Overview

The Projects feature has been fully implemented in code, but requires manual database migration and storage bucket setup in Supabase to be functional.

## Required Actions

### 1. Apply Database Migration

**File**: `supabase/migrations/016_projects_table.sql`

**Action**: Execute the SQL migration in Supabase dashboard

**Steps**:
1. Log into Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Go to SQL Editor
4. Open `supabase/migrations/016_projects_table.sql`
5. Copy and paste the entire SQL content
6. Click "Run" to execute the migration
7. Verify tables were created:
   - `projects` table with proper columns and indexes
   - `application_projects` junction table
   - RLS policies are enabled
   - Triggers are created

**What this migration creates**:
- `projects` table: Stores portfolio projects for job seekers
  - Fields: id, profile_id, title, description, url, image_url, technologies, display_order
  - Indexes for profile_id and display_order
  - Auto-update trigger for updated_at timestamp
- `application_projects` table: Links projects to job applications (max 3)
  - Fields: id, application_id, project_id
  - Unique constraint on (application_id, project_id)
- **RLS Policies**:
  - Projects viewable by everyone (for public profiles)
  - Users can insert/update/delete their own projects
  - Application projects viewable by application owner and employers
  - Users can attach/detach their own application projects

**Verification SQL**:
```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('projects', 'application_projects');

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('projects', 'application_projects');

-- Check policies
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('projects', 'application_projects');
```

### 2. Create Storage Bucket for Project Images

**Bucket Name**: `project-images`

**Action**: Create storage bucket with proper RLS policies

**Steps**:
1. In Supabase Dashboard, go to Storage
2. Click "Create a new bucket"
3. Bucket name: `project-images`
4. Make it **public** (so images can be viewed in applications)
5. File size limit: 5 MB
6. Allowed MIME types: image/jpeg, image/png, image/webp, image/svg+xml

**RLS Policies to Add**:

```sql
-- Policy: Anyone can view project images (public bucket)
CREATE POLICY "Project images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Policy: Users can upload images to their own profile folder
CREATE POLICY "Users can upload their own project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can update their own project images
CREATE POLICY "Users can update their own project images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'project-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can delete their own project images
CREATE POLICY "Users can delete their own project images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'project-images'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM profiles WHERE user_id = auth.uid()
  )
);
```

**Folder Structure**: `{profile_id}/{timestamp}.{extension}`

**Verification**:
- Try uploading an image through the Projects UI
- Verify image URL is accessible
- Check RLS policies are working (users can only upload to their folder)

### 3. Update TypeScript Types (Optional but Recommended)

After migration is applied, regenerate TypeScript types to ensure type safety:

```bash
npx supabase gen types typescript --local > src/types/supabase.ts
```

Or if using hosted Supabase:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

## Impact if Not Completed

Without completing these setup tasks:

1. **Projects Section will not work**: Users will see errors when trying to add projects
2. **Database queries will fail**: `projects` and `application_projects` tables don't exist
3. **Image uploads will fail**: No storage bucket for project screenshots
4. **Application errors**: Runtime errors when loading /dashboard/profile page

## Testing After Completion

After applying migration and creating storage bucket:

1. ✅ Navigate to `/dashboard/profile`
2. ✅ Click "Add Project" button
3. ✅ Fill in project details (title, description, URL, technologies)
4. ✅ Upload a project image
5. ✅ Save the project
6. ✅ Verify project appears in the list
7. ✅ Edit the project
8. ✅ Delete the project
9. ✅ Create 3 projects
10. ✅ Apply to a job and select projects to attach
11. ✅ Verify employer can see selected projects in applications view

## Related Files

- Migration: `supabase/migrations/016_projects_table.sql`
- Server Actions: `src/lib/actions/project-actions.ts`
- Components:
  - `src/components/ProjectsSection.tsx`
  - `src/components/ProjectCard.tsx`
- Profile Page: `src/app/dashboard/profile/page.tsx`

## Completion Criteria

- [x] SQL migration executed successfully
- [x] Tables `projects` and `application_projects` exist
- [x] RLS policies applied and verified
- [x] Storage bucket `project-images` created
- [x] Storage RLS policies applied
- [x] TypeScript types regenerated
- [x] Automated verification tests passed
- [x] Projects feature ready for use

## Notes

- The migration was not auto-applied due to Supabase connection pool issues (RESOLVED)
- Fixed `uuid_generate_v4()` to use `gen_random_uuid()` for compatibility
- All tables, RLS policies, and storage bucket successfully created
- TypeScript types regenerated with new schema
- Automated verification tests confirm all systems operational

## Implementation Summary (2025-11-15)

**Actions Taken**:
1. ✅ Fixed migration file to use `gen_random_uuid()` instead of `uuid_generate_v4()`
2. ✅ Applied migration 016_projects_table.sql via `supabase db push`
3. ✅ Created migration 017_project_images_storage.sql for storage bucket and RLS policies
4. ✅ Applied storage migration via `supabase db push`
5. ✅ Regenerated TypeScript types using `npx supabase gen types typescript`
6. ✅ Created verification scripts to test database and storage access
7. ✅ Verified TypeScript compilation with no errors

**Database Tables Created**:
- `projects` - Portfolio projects for job seeker profiles
- `application_projects` - Junction table for attaching projects to applications

**Storage Bucket Created**:
- `project-images` - Public bucket for project screenshots (5 MB limit)
- RLS policies ensure users can only upload to their own profile folder

**Verification Scripts**:
- `scripts/verify-projects.ts` - Tests database table access
- `scripts/create-project-images-bucket.ts` - Bucket creation utility
- `scripts/test-bucket-access.ts` - Tests storage bucket access

---

**Last Updated**: 2025-11-15
**Owner**: Development Team
**Time Taken**: ~15 minutes
**Status**: COMPLETED ✅
