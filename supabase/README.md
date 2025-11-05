# Supabase Database Setup

This folder contains all database migrations and setup files for the GHL Hire platform.

## Migrations

### 001_initial_schema.sql
Creates all database tables, indexes, and triggers:
- `profiles` - Job seeker profiles
- `companies` - Employer/company profiles
- `jobs` - Job postings
- `applications` - Job applications
- `saved_jobs` - Saved jobs by job seekers
- `job_alerts` - Custom job alerts
- `subscriptions` - Company subscription/billing data
- `notifications` - In-app notifications

### 002_row_level_security.sql
Implements Row Level Security (RLS) policies:
- Protects user data
- Ensures proper access control
- Separates job seeker and employer permissions

### 003_seed_data.sql
Provides initial seed data for testing:
- 5 sample companies
- 10 sample job postings
- Subscription records

## Running Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Log in to your Supabase project dashboard
2. Go to the SQL Editor
3. Run each migration file in order (001, 002, 003)
4. Verify tables are created in the Table Editor

### Option 2: Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: Manual SQL Execution
1. Open each .sql file
2. Copy the contents
3. Paste into Supabase SQL Editor
4. Execute

## Post-Migration Steps

### 1. Update Seed Data User IDs
The seed data uses placeholder user IDs. You'll need to:
1. Create test user accounts in Supabase Auth
2. Update the `user_id` fields in the `companies` table with real auth user IDs
3. Or delete the seed data and create your own through the application

### 2. Configure Environment Variables
Create `.env.local` file in the root of your project:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test RLS Policies
- Try accessing data with different user accounts
- Verify that users can only see/edit their own data
- Test job seeker vs employer permissions

## Database Schema Overview

```
auth.users (Supabase Auth)
    ↓
    ├─→ profiles (job seekers)
    │       ↓
    │       ├─→ applications
    │       ├─→ saved_jobs
    │       └─→ job_alerts
    │
    └─→ companies (employers)
            ↓
            ├─→ jobs
            │      ↓
            │      └─→ applications
            │
            └─→ subscriptions
```

## Storage Buckets

You'll also need to create storage buckets for:
- `resumes` - For job seeker resume uploads
- `logos` - For company logo uploads
- `profile-photos` - For user profile photos

Create these in Supabase Dashboard → Storage → New Bucket

## Indexes

All important indexes are created automatically:
- Job searches (location, type, status)
- Application lookups
- User-specific data queries

## Triggers

Automatic triggers handle:
- `updated_at` timestamp updates
- Application count increments/decrements
- Other automated data management

## Security

- All tables have RLS enabled
- Policies ensure data isolation
- Authenticated users only
- No anonymous access to sensitive data

## Development vs Production

For development:
- Use seed data for testing
- Create multiple test user accounts
- Test all user flows

For production:
- Remove or skip seed data migration
- Set up proper email verification
- Configure database backups
- Monitor performance

## Troubleshooting

### Foreign Key Errors
- Ensure migrations run in order
- Check that auth users exist before inserting companies/profiles

### RLS Errors
- Make sure you're authenticated
- Verify policies allow the operation
- Check that user_id matches auth.uid()

### Performance Issues
- Check that indexes exist
- Monitor query performance in Supabase dashboard
- Consider pagination for large datasets

## Maintenance

### Backup
- Supabase Pro plan includes automatic daily backups
- For manual backups, use `pg_dump` via Supabase CLI

### Migrations
- Always create new migration files for schema changes
- Never edit existing migrations after they've been run
- Use sequential numbering (004, 005, etc.)

## Support

For issues:
- Check Supabase documentation: https://supabase.com/docs
- Review RLS policies if access is denied
- Verify environment variables are set correctly
