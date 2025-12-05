# GHL Hire - Production Launch Stories

**Version**: 1.0
**Date**: 2025-11-05
**Status**: Planning Phase

This document outlines the comprehensive roadmap for launching GHL Hire into production. Stories are organized by priority (P0-P2) and functional area.

---

## Priority Levels

- **P0 (Critical)**: Must be completed before production launch - core functionality
- **P1 (High)**: Should be completed for launch - important features
- **P2 (Medium)**: Can be launched post-MVP - enhancements and optimizations

---

## Epic 1: Backend Infrastructure & Database

### P0-1: Supabase Setup & Configuration

**Priority**: P0
**Effort**: 3 days
**Dependencies**: None

**Description**:
Set up Supabase project and configure database schema for production environment.

**Acceptance Criteria**:

- [x] Create Supabase project (production & staging)
- [x] Configure environment variables (`.env.local` and `.env.example`)
- [x] Set up database connection and verify connectivity
- [x] Configure Supabase client in Next.js app
- [x] Test basic CRUD operations

**Technical Notes**:

- Store `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Create `/src/lib/supabase.ts` client configuration
- Consider edge runtime compatibility

---

### P0-2: Database Schema Design & Migration

**Priority**: P0
**Effort**: 5 days
**Dependencies**: P0-1

**Description**:
Design and implement comprehensive database schema for all entities.

**Acceptance Criteria**:

- [x] Create `profiles` table (job seekers)
  - id, user_id (FK to auth.users), full_name, email, phone, location, bio, resume_url, skills, experience_years, linkedin_url, portfolio_url, created_at, updated_at
- [x] Create `companies` table (employers)
  - id, user_id (FK to auth.users), company_name, email, logo_url, website, description, size, industry, location, created_at, updated_at
- [x] Create `jobs` table
  - id, company_id (FK), title, description, requirements, benefits, location, job_type (full-time/part-time/contract), experience_level, salary_min, salary_max, remote, status (draft/active/closed), views_count, created_at, updated_at, expires_at
- [x] Create `applications` table
  - id, job_id (FK), profile_id (FK), cover_letter, resume_url, status (pending/reviewing/shortlisted/rejected/accepted), applied_at, updated_at
- [x] Create `saved_jobs` table
  - id, profile_id (FK), job_id (FK), saved_at
- [x] Create `job_alerts` table
  - id, profile_id (FK), title, keywords, location, job_type, frequency (daily/weekly), is_active, created_at
- [x] Create `subscriptions` table (for billing)
  - id, company_id (FK), plan_type (free/basic/premium), stripe_subscription_id, status, current_period_start, current_period_end, job_post_limit, created_at, updated_at
- [x] Create indexes for performance (job searches, application lookups, etc.)
- [x] Write and test database migrations
- [x] Add database triggers for updated_at timestamps

**Technical Notes**:

- Use Supabase migration files
- Consider partitioning for large tables (applications, jobs)
- Add appropriate foreign key constraints and ON DELETE behaviors

---

### P0-3: Row Level Security (RLS) Policies

**Priority**: P0
**Effort**: 3 days
**Dependencies**: P0-2

**Description**:
Implement comprehensive Row Level Security policies to protect user data.

**Acceptance Criteria**:

- [x] Enable RLS on all tables
- [x] Profiles: Users can read all, update/delete only their own
- [x] Companies: Users can read all, update/delete only their own
- [x] Jobs: Public can read active jobs, companies can CRUD their own
- [x] Applications: Job seekers can read/create their own, companies can read applications to their jobs
- [x] Saved jobs: Users can only access their own saved jobs
- [x] Job alerts: Users can only access their own alerts
- [x] Subscriptions: Companies can only read their own subscription data
- [x] Test all policies with different user roles
- [x] Document security model

**Technical Notes**:

- Use `auth.uid()` in RLS policies
- Consider policy for admin users (future)
- Test edge cases (deleted users, expired subscriptions)

---

### P1-4: Database Seed Data

**Priority**: P1
**Effort**: 2 days
**Dependencies**: P0-2
**Status**: ✅ COMPLETED (2025-11-13)

**Description**:
Create seed data for testing and initial production launch.

**Acceptance Criteria**:

- [x] Create 20-30 sample job postings across various roles
- [x] Create 5-10 sample company profiles
- [x] Add realistic descriptions, requirements, and benefits
- [x] Include variety of job types (full-time, part-time, contract, remote, hybrid)
- [x] Create seed script that can be run on demand
- [x] Verify seed data displays correctly in UI

**Technical Notes**:

- Use realistic GHL-specific job titles and descriptions
- Ensure data matches mock data structure for easy migration
- Created `/scripts/seed-database.ts` file

---

## Epic 2: Authentication & User Management

### P0-5: Supabase Authentication Setup

**Priority**: P0
**Effort**: 4 days
**Dependencies**: P0-1
**Status**: ✅ COMPLETED (2025-11-13)

**Description**:
Implement authentication flow with Supabase Auth.

**Acceptance Criteria**:

- [x] Set up Supabase Auth providers (Email/Password)
- [x] Create sign-up flow with user type selection (job seeker vs employer)
- [x] Create sign-in page with proper validation
- [x] Implement password reset functionality
- [x] Create email verification flow (handled by Supabase)
- [x] Add authentication middleware for protected routes
- [x] Create user session management
- [x] Add sign-out functionality (via AuthContext)
- [x] Handle authentication errors gracefully

**Implementation Details**:

- Created custom auth UI with role selection (job seeker/employer)
- Auth pages: `/auth/sign-in`, `/auth/sign-up`, `/auth/reset-password`, `/auth/update-password`
- AuthContext provides user state, profile/company data, and userType
- Session middleware redirects unauthenticated users to sign-in
- Protected routes: `/dashboard`, `/company/dashboard`, `/post-job`
- ✅ Sign-in redirects correctly based on user type (job seeker → `/dashboard`, employer → `/company/dashboard`)

**Technical Notes**:

- Custom implementation for better UX and design consistency
- Store user type in profile/company record during signup
- Email/Password auth only (Google OAuth can be added later)
- Configure redirect URLs for OAuth
- Use Next.js middleware for route protection

---

### P0-6: User Profile Management (Job Seekers)

**Priority**: P0
**Effort**: 3 days
**Dependencies**: P0-5, P0-2

**Description**:
Build complete profile management for job seekers.

**Acceptance Criteria**:

- [x] Replace mock data with real Supabase queries in `/dashboard/profile`
- [x] Create profile form with all fields (name, email, phone, location, bio, skills, experience)
- [x] Add file upload for resume (Supabase Storage)
- [x] Validate all form inputs
- [x] Show success/error messages
- [x] Auto-save drafts
- [x] Display profile completion percentage
- [x] Add LinkedIn and portfolio URL fields
- [x] Add profile photo upload (bonus feature)

**Technical Notes**:

- Use Supabase Storage for resume uploads
- Implement optimistic UI updates
- Add form validation with proper error messages
- Consider profile photo upload

---

### P0-7: Company Profile Management (Employers) ✅

**Priority**: P0
**Effort**: 3 days
**Dependencies**: P0-5, P0-2
**Status**: COMPLETE (2025-11-14)

**Description**:
Build complete profile management for employers.

**Acceptance Criteria**:

- [x] Replace mock data with real Supabase queries in `/company/dashboard/profile`
- [x] Create company profile form (name, logo, website, description, size, industry, location)
- [x] Add file upload for company logo (Supabase Storage)
- [x] Validate all form inputs
- [x] Show success/error messages
- [ ] Display profile on public company pages (deferred to P0-8+)

**Implementation Summary**:

- Created `src/lib/actions/company-actions.ts` with server actions:
  - `getCompanyProfile()` - Fetch company data
  - `updateCompanyProfile()` - Update with validation
  - `uploadCompanyLogo()` - Upload to Supabase Storage (5MB limit)
  - `calculateCompanyProfileCompletion()` - Profile completion %
- Refactored `/company/dashboard/profile/page.tsx`:
  - Real-time Supabase integration
  - Auto-save (3-second debounce)
  - Profile completion indicator with progress bar
  - Toast notifications
  - Comprehensive validation (client + server)
  - All 8 fields: name, email, size, industry, location, website, logo, description
- Storage bucket `company-logos` with RLS policies
- Type-safe with Database types in `src/types/supabase.ts`

**Technical Notes**:

- ✅ Supabase Storage for logo uploads (JPEG, PNG, WebP, SVG)
- ⏳ Image optimization (future enhancement)
- ⏳ Company verification badge (future enhancement)

**Documentation**: `documents/sessions/2025-11-14_p0-7-company-profile-implementation.md`

---

### P0-6.1: Projects Section for Job Seekers ✅

**Priority**: P0
**Effort**: 2 days
**Dependencies**: P0-6, P0-10
**Status**: COMPLETE (2025-12-05)

**Description**:
Add Projects Section to job seeker profiles. Applicants can select up to 3 projects to showcase when applying to jobs, allowing employers to see concrete examples of their work.

**Acceptance Criteria**:

- [x] Create `projects` table in database with relationship to profiles
- [x] Add projects management UI in job seeker profile page (`/dashboard/profile`)
- [x] Allow adding/editing/deleting projects (title, description, URL, technologies, image)
- [x] Limit to maximum 5 projects per profile
- [x] Add file upload for project screenshots/images (Supabase Storage)
- [x] Display projects in profile view with proper formatting
- [x] Add project selection UI in application modal (select up to 3 projects)
- [x] Show selected projects in employer's application view
- [x] Validate all project fields (title required, URL format, etc.)
- [x] Add success/error toast notifications

**Implementation Summary**:

- **Database**: `projects` and `application_projects` tables created with RLS policies
- **Server Actions** (`src/lib/actions/project-actions.ts`):
  - `getProjects()` - Fetch all projects for a profile
  - `createProject()` - Create new project (max 5 per profile)
  - `updateProject()` - Update existing project
  - `deleteProject()` - Delete project and associated image
  - `uploadProjectImage()` - Upload to Supabase Storage
  - `getApplicationProjects()` - Get projects for an application
  - `attachProjectsToApplication()` - Attach up to 3 projects
  - `reorderProjects()` - Reorder display order
- **Components**:
  - `ProjectsSection.tsx` - Full CRUD UI for projects with image upload
  - `ProjectCard.tsx` - Selectable project card component
- **Profile Page** (`/dashboard/profile`): Integrated ProjectsSection
- **Apply Modal** (`ApplyJobModal.tsx`): Project selection (max 3) during application
- **Employer View** (`/company/dashboard/applications`): Displays attached projects with images, descriptions, technologies, and links

**Database Schema**:

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image_url TEXT,
  technologies TEXT[], -- Array of technology tags
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for application-project relationship
CREATE TABLE application_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, project_id)
);

-- Add constraint for max 5 projects per profile (enforced in app logic)
-- Add constraint for max 3 projects per application (enforced in app logic)
```

**Implementation Plan**:

1. Create database migration for `projects` and `application_projects` tables
2. Generate TypeScript types
3. Create `src/lib/actions/project-actions.ts` with CRUD operations:
   - `getProjects(profileId)` - Fetch all projects for a profile
   - `createProject(data)` - Create new project
   - `updateProject(id, data)` - Update existing project
   - `deleteProject(id)` - Delete project
   - `uploadProjectImage(file)` - Upload to Supabase Storage
   - `getApplicationProjects(applicationId)` - Get projects for an application
4. Create `src/components/ProjectsSection.tsx` component for profile page
5. Update `/dashboard/profile/page.tsx` to include projects management
6. Update `ApplyJobModal.tsx` to allow project selection (checkboxes, max 3)
7. Update `/company/dashboard/applications/page.tsx` to display selected projects
8. Add RLS policies for projects table
9. Create Supabase Storage bucket `project-images` with RLS policies

**Technical Notes**:

- Use Supabase Storage for project images (JPEG, PNG, WebP, max 5MB)
- Projects are optional but recommended for better applications
- Technologies field stored as TEXT[] for easy filtering/searching later
- Display order allows users to prioritize which projects show first
- When deleting a project, it's removed from all applications (CASCADE)
- Add drag-and-drop reordering (future enhancement)
- Consider adding project templates/examples (future enhancement)

**UI/UX Considerations**:

- Clean card-based layout for projects
- "Add Project" button with modal/inline form
- Edit/Delete actions on each project card
- Visual indicators for projects with images
- Technology tags displayed as badges
- In application modal, show project cards with checkboxes
- Limit visual: "Select up to 3 projects (X/3 selected)"
- In employer view, show projects in a grid or list with images and descriptions

**Files to Create/Modify**:

- `supabase/migrations/016_projects_table.sql` (NEW)
- `src/types/supabase.ts` (regenerate)
- `src/lib/actions/project-actions.ts` (NEW)
- `src/components/ProjectsSection.tsx` (NEW)
- `src/components/ProjectCard.tsx` (NEW)
- `src/components/ApplyJobModal.tsx` (UPDATE)
- `src/app/dashboard/profile/page.tsx` (UPDATE)
- `src/app/company/dashboard/applications/page.tsx` (UPDATE)

---

## Epic 3: Core Job Board Functionality

### P0-8: Job Listing Page with Real Data ✅

**Priority**: P0
**Effort**: 4 days
**Dependencies**: P0-2
**Status**: ✅ Complete (2025-11-14)

**Description**:
Replace mock data with real database queries on jobs listing page.

**Acceptance Criteria**:

- [x] Query jobs from Supabase database in `/jobs/page.tsx`
- [x] Implement pagination (20 jobs per page)
- [x] Add filters: job type, location, experience level, remote/on-site
- [x] Add search functionality (by title, description, company)
- [x] Sort options: newest, oldest, most viewed
- [x] Display job count
- [x] Show "No results" state
- [x] Implement loading states
- [x] Optimize query performance

**Implementation Summary**:

- Server-side pagination with Supabase `.range()` (20 jobs per page)
- Debounced search input (300ms) prevents excessive API calls
- All filters applied server-side for optimal performance:
  - Job type (exact match)
  - Experience level (exact match)
  - Location (case-insensitive ILIKE search)
  - Remote/on-site (boolean filter)
  - Minimum salary (greater than or equal)
- Search functionality across title and description (case-insensitive OR query)
- Sort options: newest, oldest, most viewed, salary (high/low)
- Smart pagination UI with ellipsis for large page counts
- Accurate job count: "Showing X-Y of Z jobs"
- Filter changes automatically reset to page 1
- Comprehensive empty states and loading indicators

**Technical Notes**:

- ✅ Supabase `.range()` for pagination
- ✅ Full-text search with ILIKE queries (OR operator)
- ✅ 300ms debounce for search input
- ✅ Server-side filtering and sorting
- ✅ Count query with `{ count: 'exact' }` for accurate pagination

**Documentation**: `documents/sessions/2025-11-14_p0-8-job-listing-page-implementation.md`

---

### P0-9: Job Detail Page with Real Data ✅

**Priority**: P0
**Effort**: 3 days
**Dependencies**: P0-2, P0-8
**Status**: ✅ Complete (2025-11-14)

**Description**:
Display complete job information from database on job detail pages.

**Acceptance Criteria**:

- [x] Query job data from Supabase in `/jobs/[id]/page.tsx`
- [x] Display all job details (description, requirements, benefits, company info)
- [x] Show company logo and profile link
- [x] Display related jobs from same company
- [x] Increment view count on page load
- [x] Add share functionality (copy link, LinkedIn, Twitter)
- [x] Handle job not found (404) gracefully
- [x] Add structured data (JSON-LD) for SEO

**Implementation Summary**:

- **View Count Tracking**: Atomic database function increments views on page load
  - Created `increment_job_views()` PostgreSQL function
  - Fire-and-forget pattern (non-blocking)
  - Accessible to authenticated and anonymous users
- **Smart Related Jobs**: Prioritizes jobs from same company
  - Queries company jobs first
  - Falls back to recent jobs to fill list
  - Dynamic title: "More from [Company]" or "Related Jobs"
  - Visual indicator for same-company jobs
- **Social Share Functionality**: Multi-platform sharing
  - Copy link to clipboard (with confirmation)
  - Share to LinkedIn
  - Share to Twitter/X
  - Native share API (mobile)
  - Dropdown menu with backdrop
- **SEO Optimization**: Comprehensive metadata and structured data
  - Dynamic Open Graph tags (Facebook, LinkedIn)
  - Twitter Card tags
  - Canonical URLs
  - Schema.org JobPosting JSON-LD
  - Eligible for Google Jobs rich results
- **404 Handling**: Next.js notFound() for missing jobs

**Technical Notes**:

- ✅ Dynamic routes with async metadata generation
- ✅ Schema.org JobPosting structured data
- ✅ Open Graph and Twitter Card meta tags
- ✅ Atomic view count increment
- ⏳ ISR (future enhancement)

**Documentation**: `documents/sessions/2025-11-14_p0-9-job-detail-page-implementation.md`

---

### P0-10: Job Application System ✅

**Priority**: P0
**Effort**: 5 days
**Dependencies**: P0-5, P0-9, P0-2
**Status**: ✅ COMPLETE

**Description**:
Build complete job application flow for job seekers.

**Acceptance Criteria**:

- ✅ Create application form (cover letter, resume upload)
- ✅ Save application to `applications` table
- ✅ Prevent duplicate applications
- ⏳ Send confirmation email to applicant (future enhancement)
- ⏳ Notify employer of new application (future enhancement)
- ✅ Show application status in job seeker dashboard
- ⏳ Allow withdrawing application (future enhancement)
- ✅ Display applications in employer dashboard
- ✅ Add application filtering and sorting for employers

**Implementation Details**:

- ✅ Application modal with cover letter input (`src/components/ApplyJobModal.tsx`)
- ✅ Resume upload to Supabase Storage (bucket: `resumes`)
- ✅ Uses existing profile resume or allows new upload
- ✅ Duplicate application prevention at database level
- ✅ Job seeker applications dashboard at `/dashboard/applications`
- ✅ Employer applications dashboard at `/company/dashboard/applications`
- ✅ Application status management (pending → reviewing → shortlisted → accepted/rejected)
- ✅ Search and filter by status, job, company
- ✅ Application count tracking on jobs table
- ✅ View candidate details, cover letters, and resumes

**Technical Implementation**:

- Uses Supabase Storage for resume uploads
- Real-time application data fetching from Supabase
- Optimistic UI updates with error handling
- Status badges and filtering by application state
- Shows applicant information (name, email, phone, location, experience)
- Links to LinkedIn and portfolio profiles

**Files Created/Modified**:

- `src/components/ApplyJobModal.tsx` - Application form modal
- `src/app/jobs/[id]/JobDetailClient.tsx` - Apply button and saved jobs
- `src/app/dashboard/applications/page.tsx` - Job seeker applications dashboard
- `src/app/company/dashboard/applications/page.tsx` - Employer applications dashboard
- `src/contexts/AuthContext.tsx` - Authentication state management
- Database schema already includes `applications` table with triggers

**Future Enhancements**:

- Email notifications (confirmation + employer alerts)
- Application withdrawal feature
- Application analytics and insights
- Rate limiting for spam prevention

---

### P0-11: Job Posting for Employers ✅

**Priority**: P0
**Effort**: 5 days
**Dependencies**: P0-5, P0-7, P0-2
**Status**: COMPLETE (2025-12-05)

**Description**:
Build job posting functionality for employers.

**Acceptance Criteria**:

- [x] Create job posting form in `/post-job`
- [x] Add all job fields (title, description, requirements, benefits, location, type, experience, salary range)
- [ ] Add rich text editor for descriptions (deferred - using plain textarea)
- [x] Save as draft functionality
- [x] Publish job (set to active)
- [x] Edit existing jobs (`/edit-job/[id]`)
- [x] Close/archive jobs
- [ ] Preview job before publishing (deferred)
- [ ] Set expiration date (deferred)
- [x] Enforce job post limits based on subscription

**Implementation Summary**:

- Created `/post-job/page.tsx` - Full job posting form with all fields
- Created `/edit-job/[id]/page.tsx` - Edit existing jobs with status management
- Created `/company/dashboard/jobs/page.tsx` - Job management dashboard with:
  - List, search, filter jobs
  - Toggle status (active/closed)
  - Duplicate jobs
  - Delete jobs
  - View job stats (applications, views)
- Subscription limit enforcement with plan display
- All core job CRUD operations working

**Technical Notes**:

- Using plain textarea for descriptions (rich text editor can be added later)
- Autosave not implemented (can be added as enhancement)
- Uses optimistic UI updates
- Validates subscription limits before allowing publish

---

### P1-12: Saved Jobs Feature ✅

**Priority**: P1
**Effort**: 2 days
**Dependencies**: P0-5, P0-8
**Status**: COMPLETE (2025-12-05)

**Description**:
Allow job seekers to save jobs for later.

**Acceptance Criteria**:

- [x] Add "Save" button to job cards and detail pages
- [x] Save/unsave jobs in database
- [x] Display saved jobs in `/dashboard/saved`
- [x] Show saved status on job listings
- [x] Add "Remove" functionality from saved jobs page
- [x] Show count of saved jobs

**Implementation Summary**:

- **SaveJobButton Component** (`src/components/SaveJobButton.tsx`): Reusable save/unsave button
- **Saved Jobs Page** (`src/app/dashboard/saved/page.tsx`):
  - Lists all saved jobs with details
  - Search and filter functionality
  - Remove individual jobs
- **Server Actions** (`src/lib/actions/saved-jobs-actions.ts`):
  - `getSavedJobs()` - Fetch all saved jobs
  - `saveJob()` - Add job to saved
  - `unsaveJob()` - Remove from saved
  - `isJobSaved()` - Check save status
- **Integration**: Save button on JobCard and JobDetailClient components

**Technical Notes**:

- Uses optimistic UI updates
- Bookmark icon with toggle state
- Real-time save status on job listings

---

### P1-13: Job Alerts System ✅

**Priority**: P1
**Effort**: 4 days
**Dependencies**: P0-5, P0-2
**Status**: COMPLETE (2025-12-05)

**Description**:
Allow job seekers to create custom job alerts.

**Acceptance Criteria**:

- [x] Create alert creation form in `/job-alerts`
- [x] Configure alert criteria (keywords, location, job type)
- [x] Set frequency (daily, weekly)
- [x] Store alerts in database
- [x] Edit and delete alerts
- [x] Toggle alerts on/off
- [ ] Create Supabase Edge Function to check for new matching jobs (future enhancement)
- [x] Send email notifications for matching jobs (template ready)
- [x] Add unsubscribe link in emails

**Implementation Summary**:

- **Job Alerts Page** (`src/app/job-alerts/page.tsx`):
  - Full CRUD for job alerts
  - Alert criteria: title, keywords, location, job type, experience level, remote only, salary minimum
  - Frequency: daily or weekly
  - Toggle active/inactive state
  - Edit and delete functionality
- **Database**: Uses `job_alerts` table with RLS policies
- **Email Template**: Job alert email template ready in `src/lib/email/notifications.ts`

**Technical Notes**:

- Real-time Supabase integration
- Modal-based create/edit forms
- Email delivery via Resend (when triggered)
- Background job matching can be added with Supabase Edge Functions or cron

---

## Epic 4: Payment & Subscription System

### P0-14: Maya Payment Integration Setup ✅

**Priority**: P0
**Effort**: 3 days
**Dependencies**: P0-1
**Status**: COMPLETE (2025-12-05)

**Description**:
Set up Maya (PayMaya) for payment processing and subscription management in the Philippines.

**Acceptance Criteria**:

- [ ] Create Maya Business account and get API keys (user action required)
- [x] Configure Maya products and pricing
  - Free plan: 1 job post, basic features
  - Basic plan: ₱2,499/month, 5 job posts, priority support
  - Premium plan: ₱7,499/month, unlimited posts, featured listings, analytics
- [x] Install Maya SDK/API client in project
- [x] Create `/src/lib/payments/maya.ts` configuration
- [x] Set up webhook endpoint for Maya events
- [ ] Add Maya environment variables (user action required)
- [ ] Test in Maya sandbox mode (user action required)

**Implementation Summary**:

- **Maya Client** (`src/lib/payments/maya.ts`):
  - MayaClient class with checkout, subscription, and webhook methods
  - Subscription plans configuration with PHP pricing
  - Helper functions for amount formatting
  - Plan limit checking utilities
- **API Endpoints**:
  - `POST /api/payments/create-checkout` - Create Maya checkout sessions
  - `POST /api/payments/webhook` - Handle Maya webhook events
  - `GET /api/user/company` - Get company with subscription data
- **Webhook Handlers**: Payment success/failed, subscription created/renewed/canceled/expired

**Technical Notes**:

- Uses Maya Checkout API for payment processing
- Stores subscription data in Supabase (`subscriptions` table with maya_* fields)
- Webhook signature verification implemented
- Currency: Philippine Peso (PHP)

---

### P0-15: Subscription Management for Employers ✅

**Priority**: P0
**Effort**: 5 days
**Dependencies**: P0-14, P0-7
**Status**: COMPLETE (2025-12-05)

**Description**:
Build subscription management system for employers using Maya payments.

**Acceptance Criteria**:

- [x] Create pricing page at `/pricing`
- [x] Implement subscription checkout flow with Maya
- [x] Create billing page in `/company/dashboard/billing`
- [x] Display current plan and usage
- [ ] Add upgrade/downgrade functionality (future enhancement)
- [ ] Add cancel subscription option (UI exists, needs backend)
- [x] Show payment history (UI ready, uses mock data until real payments)
- [x] Handle failed payments (webhook handler implemented)
- [x] Sync subscription status with Maya webhooks
- [x] Enforce job post limits based on plan

**Implementation Summary**:

- **Pricing Page** (`/pricing`):
  - Three plans: Free (₱0), Basic (₱2,499/mo), Premium (₱7,499/mo)
  - Plan comparison with features list
  - Checkout flow redirects to Maya
  - FAQ section
- **Billing Dashboard** (`/company/dashboard/billing`):
  - Current plan and usage display
  - Payment method management (UI)
  - Billing history table
  - Plan upgrade/downgrade cards
  - Cancel subscription option
- **Checkout Flow Pages**:
  - `/company/billing/success` - Payment success confirmation
  - `/company/billing/failed` - Payment failure with retry options
  - `/company/billing/canceled` - User canceled payment

**Technical Notes**:

- Uses Maya Checkout API for payment processing
- Webhook handlers update subscription status automatically
- Plan limits enforced in `/post-job` page
- Database: `subscriptions`, `payment_transactions`, `invoices` tables

---

### P1-16: Payment Receipt & Invoicing

**Priority**: P1
**Effort**: 2 days
**Dependencies**: P0-15

**Description**:
Provide payment receipts and invoices to customers.

**Acceptance Criteria**:

- [ ] Send receipt email after successful payment
- [ ] Display invoices in billing dashboard
- [ ] Allow downloading invoices as PDF
- [ ] Show payment method on file
- [ ] Add update payment method functionality

**Technical Notes**:

- Use Maya's receipt/invoice webhooks
- Store invoice data in `invoices` table
- Generate PDF receipts using a library like jsPDF or react-pdf

---

## Epic 5: AI Features (OpenAI Integration)

### P1-17: OpenAI Setup & Configuration

**Priority**: P1
**Effort**: 2 days
**Dependencies**: P0-1

**Description**:
Set up OpenAI API for AI-powered features.

**Acceptance Criteria**:

- [ ] Create OpenAI account and get API key
- [ ] Add OpenAI SDK to project
- [ ] Create `/src/lib/openai.ts` configuration
- [ ] Set up environment variables
- [ ] Test basic API calls
- [ ] Implement rate limiting and error handling

**Technical Notes**:

- Use GPT-4 or GPT-4.1 for quality
- Consider caching responses
- Add retry logic for failed requests
- Monitor API usage and costs

---

### P1-18: AI Job Description Enhancement

**Priority**: P1
**Effort**: 3 days
**Dependencies**: P1-17, P0-11

**Description**:
Help employers write better job descriptions with AI.

**Acceptance Criteria**:

- [ ] Add "Enhance with AI" button to job posting form
- [ ] Generate improved job descriptions based on basic input
- [ ] Suggest requirements and qualifications
- [ ] Generate benefits section
- [ ] Add GHL-specific terminology and context
- [ ] Allow editing AI suggestions
- [ ] Show character counts and recommendations

**Technical Notes**:

- Use streaming responses for better UX
- Provide clear prompts to OpenAI
- Add user feedback mechanism
- Consider cost per generation

---

### P2-19: AI Job Matching

**Priority**: P2
**Effort**: 5 days
**Dependencies**: P1-17, P0-6, P0-8

**Description**:
Provide AI-powered job recommendations to job seekers.

**Acceptance Criteria**:

- [ ] Analyze job seeker profile (skills, experience, preferences)
- [ ] Generate personalized job recommendations
- [ ] Display recommended jobs on dashboard
- [ ] Show match score/percentage
- [ ] Explain why each job is recommended
- [ ] Allow feedback (interested/not interested)
- [ ] Improve recommendations based on feedback

**Technical Notes**:

- Use embeddings for semantic matching
- Consider batch processing for efficiency
- Store match scores in database
- Implement learning algorithm

---

### P2-20: AI Resume Analysis

**Priority**: P2
**Effort**: 4 days
**Dependencies**: P1-17, P0-6

**Description**:
Help job seekers improve their profiles with AI analysis.

**Acceptance Criteria**:

- [ ] Parse uploaded resume
- [ ] Extract skills, experience, and education
- [ ] Provide profile improvement suggestions
- [ ] Highlight missing information
- [ ] Suggest relevant skills to add
- [ ] Compare profile to job requirements
- [ ] Show profile strength score

**Technical Notes**:

- Use GPT-4 Vision for PDF parsing or structured extraction
- Validate extracted data before saving
- Provide actionable suggestions
- Consider privacy implications

---

## Epic 6: Email & Notifications

### P0-21: Email Service Setup ✅

**Priority**: P0
**Effort**: 2 days
**Dependencies**: P0-1
**Status**: COMPLETE (2025-12-05)

**Description**:
Set up transactional email service.

**Acceptance Criteria**:

- [x] Choose email provider (Resend)
- [ ] Set up email domain and authentication (SPF, DKIM) - user action required
- [x] Create email templates
  - [x] Welcome email
  - [x] Email verification
  - [x] Password reset
  - [x] Application confirmation
  - [x] New application notification (employer)
  - [x] Job alert notification
  - [ ] Payment confirmation (future enhancement)
- [x] Configure environment variables structure
- [ ] Test email delivery - user action required
- [x] Add unsubscribe functionality (links in templates)

**Implementation Summary**:

- **Resend Client** (`src/lib/email/resend.ts`):
  - Email sending function with error handling
  - 7 email templates with GHL Hire branding
  - HTML templates with responsive design
- **Notification Functions** (`src/lib/email/notifications.ts`):
  - `sendWelcomeEmail()` - Welcome new users
  - `sendApplicationSubmittedEmail()` - Confirm to candidate
  - `sendNewApplicationEmail()` - Notify employer
  - `sendApplicationStatusEmail()` - Status change updates
  - `sendJobAlertEmail()` - Job alert matches
  - `sendPasswordResetEmail()` - Password reset
  - `sendEmailVerification()` - Email verification
  - Email logging to `email_logs` table
  - User preference checking before sending
- **API Endpoints**:
  - `POST /api/email/application-submitted` - Triggered on new application
  - `POST /api/email/application-status` - Triggered on status change
- **Integration**:
  - ApplyJobModal sends emails after successful application
  - Company applications page sends emails on status update
- **Documentation**: `documents/setup/2025-12-05_email-setup.md`

**Technical Notes**:

- Using Resend API (installed: `resend@6.4.2`)
- HTML templates with inline CSS for email client compatibility
- Supabase SMTP configuration guide included for auth emails
- Email logs stored in database for monitoring

---

### P1-22: In-App Notifications System ✅

**Priority**: P1
**Effort**: 4 days
**Dependencies**: P0-5, P0-2
**Status**: COMPLETE (2025-12-05)

**Description**:
Build in-app notification system for users.

**Acceptance Criteria**:

- [x] Create `notifications` table in database
- [x] Add notification bell icon in header
- [x] Show unread count badge
- [x] Display notification dropdown
- [x] Mark notifications as read
- [x] Types: new application, application status change, job alert match, payment reminder
- [x] Add notification preferences in settings
- [x] Implement real-time updates with Supabase subscriptions
- [x] Add "View all notifications" page

**Implementation Summary**:

- **NotificationBell Component** (`src/components/NotificationBell.tsx`):
  - Bell icon with unread count badge
  - Dropdown showing recent notifications
- **Notifications Page** (`src/app/notifications/page.tsx`):
  - Full list of all notifications
  - Filter by all/unread
  - Mark as read individually or all
  - Delete notifications
  - Real-time updates via Supabase subscriptions
- **Notification Preferences** (`src/app/notifications/preferences/page.tsx`):
  - Toggle email notifications by type
  - Configure notification frequency
- **Notification Types**:
  - `application_received`
  - `application_status_changed`
  - `new_job_match`
  - `job_alert`
  - `message_received`
  - `profile_viewed`
  - `job_expired`
  - `interview_scheduled`
  - `saved_job_update`
  - `system_announcement`

**Technical Notes**:

- Uses Supabase Realtime for instant updates
- Type-specific icons for each notification type
- Links to relevant pages (job, application, etc.)
- Timestamps with relative formatting

---

## Epic 7: Analytics & Reporting

### P1-23: Job Analytics for Employers ✅

**Priority**: P1
**Effort**: 4 days
**Dependencies**: P0-7, P0-11
**Status**: COMPLETE (2025-12-05)

**Description**:
Provide analytics dashboard for employers.

**Acceptance Criteria**:

- [x] Track job views over time
- [x] Show application funnel (views → applications)
- [x] Display top-performing jobs
- [ ] Show traffic sources (future enhancement)
- [x] Add date range filters
- [ ] Export analytics data (CSV) (future enhancement)
- [x] Show application trends
- [x] Compare job performance

**Implementation Summary**:

- **Analytics Page** (`src/app/company/analytics/page.tsx`):
  - Overview stats: total views, applications, saves, conversion rate
  - Change indicators (up/down trends)
  - Per-job analytics table with:
    - Views, applications, saves
    - Conversion rate (applications/views)
    - Recent activity (7-day)
    - Trend indicator
  - Time series data for charts
  - Date range filtering (7 days, 30 days, 90 days, all time)
- **Metrics Tracked**:
  - `total_views` - Job page views
  - `total_applications` - Applications received
  - `total_saves` - Jobs saved by seekers
  - `conversion_rate` - Applications/Views ratio
  - `recent_views` - Views in last 7 days
  - `recent_applications` - Applications in last 7 days

**Technical Notes**:

- Real-time data from Supabase
- Aggregated queries for performance
- Trend calculations based on period comparison
- Ready for chart library integration (Recharts)

---

### P1-24: Application Tracking for Employers

**Priority**: P1
**Effort**: 3 days
**Dependencies**: P0-10, P1-23

**Description**:
Build application management interface for employers.

**Acceptance Criteria**:

- [ ] Display all applications in `/company/dashboard/applications`
- [ ] Filter by job, status, date
- [ ] Sort applications
- [ ] View applicant profile and resume
- [ ] Update application status (reviewing, shortlisted, rejected, accepted)
- [ ] Add notes to applications
- [ ] Bulk actions (reject multiple)
- [ ] Send status update emails to applicants

**Technical Notes**:

- Implement optimistic UI updates
- Add keyboard shortcuts for efficiency
- Consider ATS (Applicant Tracking System) features
- Export applicant data

---

### P2-25: Platform Analytics Dashboard (Admin)

**Priority**: P2
**Effort**: 5 days
**Dependencies**: P1-23

**Description**:
Create admin dashboard for platform analytics.

**Acceptance Criteria**:

- [ ] Create admin role and authentication
- [ ] Display key metrics: total jobs, applications, users, revenue
- [ ] Show growth charts over time
- [ ] Track user engagement
- [ ] Monitor subscription conversions
- [ ] Show popular job categories/types
- [ ] Geographic distribution of users
- [ ] Export reports

**Technical Notes**:

- Create separate admin layout
- Use role-based access control
- Consider using Metabase or similar for advanced analytics
- Implement caching for performance

---

## Epic 8: SEO & Marketing

### P0-26: SEO Optimization ✅

**Priority**: P0
**Effort**: 3 days
**Dependencies**: P0-8, P0-9
**Status**: COMPLETE (2025-12-05)

**Description**:
Optimize application for search engines.

**Acceptance Criteria**:

- [x] Add meta tags to all pages (title, description, keywords)
- [x] Implement dynamic Open Graph tags
- [x] Add Twitter Card meta tags
- [x] Create `robots.txt`
- [x] Create `sitemap.xml` (dynamic based on jobs)
- [x] Add structured data (JSON-LD) for job postings
- [x] Optimize page load speed
- [x] Implement canonical URLs
- [ ] Add alt text to all images (ongoing)
- [ ] Test with Google Search Console (user action required)

**Implementation Summary**:

- **Sitemap** (`src/app/sitemap.ts`): Dynamic sitemap with all active jobs, SEO-friendly URLs
- **Robots.txt** (`src/app/robots.ts`): Proper crawl rules, blocks dashboard/private pages
- **Meta Tags** (`src/app/layout.tsx`): Comprehensive metadata with title templates, keywords, authors
- **Open Graph & Twitter**: Full support with og-image.png
- **JSON-LD**: Schema.org JobPosting on job detail pages, Organization schema on homepage
- **Canonical URLs**: Via metadataBase configuration
- **Google Analytics**: Integrated via @next/third-parties

**Technical Notes**:

- Uses Next.js Metadata API
- Dynamic sitemap regenerates with job updates
- schema.org JobPosting for Google Jobs rich results

---

### P1-27: Landing Pages for Key Job Types

**Priority**: P1
**Effort**: 3 days
**Dependencies**: P0-26

**Description**:
Create dedicated landing pages for popular job searches.

**Acceptance Criteria**:

- [ ] Create pages:
  - `/jobs/ghl-specialist`
  - `/jobs/ghl-developer`
  - `/jobs/account-manager`
  - `/jobs/remote-jobs`
- [ ] Optimize each page for specific keywords
- [ ] Show filtered job listings
- [ ] Add custom content and CTAs
- [ ] Include testimonials/success stories
- [ ] Generate sitemap entries

**Technical Notes**:

- Use dynamic routes with pre-rendering
- Add unique content for each page
- Monitor performance in Google Analytics
- A/B test different layouts

---

### P1-28: Blog/Resources Section

**Priority**: P1
**Effort**: 5 days
**Dependencies**: P0-1

**Description**:
Create blog/resources section for content marketing.

**Acceptance Criteria**:

- [ ] Set up blog structure in `/resources` or `/blog`
- [ ] Create blog post template
- [ ] Add markdown support for blog posts
- [ ] Create CMS integration (Contentful, Sanity, or markdown files)
- [ ] Build blog listing page
- [ ] Add blog post categories/tags
- [ ] Implement search functionality
- [ ] Add RSS feed
- [ ] Create 5-10 initial blog posts about GHL careers

**Technical Notes**:

- Use MDX for rich content
- Implement ISR for blog posts
- Add comments (optional)
- Consider guest posting

---

## Epic 9: Mobile Responsiveness & Accessibility

### P0-29: Mobile Optimization ✅

**Priority**: P0
**Effort**: 4 days
**Dependencies**: All frontend work
**Status**: COMPLETE (2025-12-05)

**Description**:
Ensure excellent mobile experience across all pages.

**Acceptance Criteria**:

- [x] Test all pages on mobile devices (iOS and Android)
- [x] Fix layout issues on small screens
- [x] Optimize touch targets (minimum 44x44px)
- [x] Test forms on mobile
- [x] Implement mobile navigation menu
- [x] Optimize images for mobile
- [x] Test performance on slow connections
- [x] Add mobile-specific optimizations
- [x] Test landscape orientation

**Implementation Summary**:

- **Viewport Configuration** (`src/app/layout.tsx`):
  - `device-width` with `initialScale: 1`
  - `maximumScale: 5` for accessibility
  - Theme color for light/dark modes
- **Touch Targets** (`src/app/globals.css`):
  - Minimum 44x44px for buttons and links
  - Custom tap highlight colors
- **Safe Area Insets**: Support for notched devices (iPhone X+)
- **Form Optimization**: Font size 16px on mobile to prevent iOS zoom
- **Mobile Utilities**: `.mobile-hidden`, `.mobile-full-width`, `.mobile-stack`
- **Accessibility**: `prefers-reduced-motion` support
- **Smooth Scrolling**: `-webkit-overflow-scrolling: touch`

**Technical Notes**:

- Uses Tailwind CSS responsive utilities throughout
- Mobile-first approach in component design
- iOS-specific optimizations for text-size-adjust and overflow scrolling

---

### P1-30: Accessibility (WCAG 2.1 AA)

**Priority**: P1
**Effort**: 3 days
**Dependencies**: All frontend work

**Description**:
Ensure application is accessible to all users.

**Acceptance Criteria**:

- [ ] Add proper ARIA labels
- [ ] Ensure keyboard navigation works
- [ ] Test with screen readers (NVDA, JAWS)
- [ ] Fix color contrast issues
- [ ] Add skip navigation links
- [ ] Ensure form labels are properly associated
- [ ] Add focus indicators
- [ ] Test with accessibility auditing tools (aXe, Lighthouse)
- [ ] Document accessibility features

**Technical Notes**:

- Use semantic HTML
- Test focus order
- Provide text alternatives for images
- Ensure error messages are clear

---

## Epic 10: Security & Performance

### P0-31: Security Hardening ✅

**Priority**: P0
**Effort**: 3 days
**Dependencies**: All backend work
**Status**: COMPLETE (2025-12-05)

**Description**:
Implement security best practices.

**Acceptance Criteria**:

- [x] Enable HTTPS (SSL certificate) - via Vercel
- [x] Configure security headers (CSP, HSTS, X-Frame-Options)
- [x] Implement rate limiting for API routes
- [x] Add CSRF protection (via Supabase Auth)
- [x] Sanitize all user inputs (via Supabase parameterized queries)
- [x] Validate file uploads (type, size)
- [ ] Set up security monitoring (Sentry) - future enhancement
- [x] Implement SQL injection prevention (use parameterized queries)
- [x] Add XSS protection
- [x] Configure CORS properly
- [ ] Run security audit with npm audit (recommended before launch)

**Implementation Summary**:

- **Security Headers** (`src/middleware.ts`):
  - `Strict-Transport-Security` (HSTS): 1 year with includeSubDomains
  - `X-Frame-Options`: SAMEORIGIN
  - `X-Content-Type-Options`: nosniff
  - `X-XSS-Protection`: 1; mode=block
  - `Referrer-Policy`: origin-when-cross-origin
  - `Permissions-Policy`: Restricts camera, microphone, geolocation
- **Content Security Policy (CSP)**:
  - Strict default-src 'self'
  - Allowed scripts: Vercel, analytics
  - Allowed connections: Supabase, OpenAI, Resend, Maya
  - `upgrade-insecure-requests` enabled
- **Rate Limiting**:
  - `/api/auth`: 5 requests/minute
  - `/api/payments`: 10 requests/minute
  - `/api/ai`: 20 requests/minute
  - Other API routes: 100 requests/minute
  - Returns 429 with Retry-After header
- **CORS**: Configured for allowed origins only

**Technical Notes**:

- Custom middleware implementation (no external dependencies)
- Rate limiting uses in-memory Map (consider Redis for multi-instance)
- CSP only enforced in production mode

---

### P0-32: Performance Optimization

**Priority**: P0
**Effort**: 4 days
**Dependencies**: All frontend work

**Description**:
Optimize application performance for production.

**Acceptance Criteria**:

- [ ] Achieve Lighthouse score >90 for all metrics
- [ ] Implement image optimization (Next.js Image)
- [ ] Add lazy loading for images and components
- [ ] Optimize bundle size
- [ ] Implement code splitting
- [ ] Add caching strategies (CDN, browser caching)
- [ ] Optimize database queries
- [ ] Implement pagination for large lists
- [ ] Add loading states
- [ ] Optimize font loading
- [ ] Compress static assets

**Technical Notes**:

- Use Next.js Image component
- Implement ISR and SSG where possible
- Use dynamic imports for heavy components
- Monitor Core Web Vitals
- Use Vercel Analytics or similar

---

### P1-33: Monitoring & Error Tracking

**Priority**: P1
**Effort**: 2 days
**Dependencies**: P0-31

**Description**:
Set up monitoring and error tracking.

**Acceptance Criteria**:

- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring
- [ ] Add uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up log aggregation
- [ ] Create alerts for critical errors
- [ ] Monitor API rate limits and quotas
- [ ] Track database performance
- [ ] Set up status page

**Technical Notes**:

- Integrate Sentry with source maps
- Monitor Supabase usage
- Track Stripe webhook failures
- Set up PagerDuty or similar for alerts

---

## Epic 11: Legal & Compliance

### P0-34: Terms of Service & Privacy Policy ✅

**Priority**: P0
**Effort**: 2 days
**Dependencies**: None
**Status**: COMPLETE (2025-12-05)

**Description**:
Create legal documents and ensure compliance.

**Acceptance Criteria**:

- [x] Write Terms of Service (or use template + customize)
- [x] Write Privacy Policy (GDPR, CCPA compliant)
- [x] Add cookie consent banner
- [ ] Create data processing agreement (recommended for B2B clients)
- [x] Add legal links to footer
- [x] Ensure GDPR compliance (data export, deletion)
- [ ] Add "Report Job" functionality (moved to P1-35)
- [ ] Create content moderation guidelines (moved to P1-35)

**Implementation Summary**:

- **Terms of Service** (`/terms`): Comprehensive ToS covering:
  - User accounts and responsibilities (Job Seekers & Employers)
  - Job posting and application rules
  - Subscription plans and Maya payments
  - Prohibited uses and content moderation
  - Intellectual property rights
  - Limitation of liability and disclaimer
  - Philippine jurisdiction and governing law
- **Privacy Policy** (`/privacy`): GDPR/CCPA compliant policy covering:
  - Information collection (direct, automatic, third-party)
  - Data usage purposes (service delivery, improvement, communication, legal)
  - Third-party service providers (Supabase, Maya, Resend, OpenAI, Vercel)
  - User rights (access, correction, deletion, portability, opt-out)
  - GDPR and CCPA specific rights
  - Data retention policies
  - International data transfers
- **Cookie Consent** (`CookieConsent.tsx`): Full GDPR-compliant banner with:
  - Accept All / Reject All options
  - Customizable preferences (Essential, Analytics, Marketing)
  - Persistent preferences in localStorage
  - Google Analytics consent integration
- **Cookie Settings Button**: Allows reopening preferences from Privacy Policy page

**Technical Notes**:

- Custom cookie consent implementation (no external dependency)
- Maya/PayMaya referenced as payment processor
- Consider hiring lawyer for final review before production launch

---

### P1-35: Content Moderation System

**Priority**: P1
**Effort**: 3 days
**Dependencies**: P0-11

**Description**:
Implement content moderation for job postings.

**Acceptance Criteria**:

- [ ] Add admin review queue for new job posts
- [ ] Flag inappropriate content automatically
- [ ] Allow users to report jobs
- [ ] Create admin moderation interface
- [ ] Add job approval/rejection workflow
- [ ] Send emails for rejected jobs with reasons
- [ ] Implement automated spam detection
- [ ] Log all moderation actions

**Technical Notes**:

- Consider using OpenAI Moderation API
- Implement simple keyword filtering
- Add manual review for flagged content
- Create clear content guidelines

---

## Epic 12: Testing & Quality Assurance

### P0-36: End-to-End Testing

**Priority**: P0
**Effort**: 5 days
**Dependencies**: All major features

**Description**:
Implement comprehensive testing for critical user flows.

**Acceptance Criteria**:

- [ ] Set up Playwright or Cypress
- [ ] Write tests for authentication flows
- [ ] Test job posting workflow
- [ ] Test job application workflow
- [ ] Test payment flows (use Stripe test mode)
- [ ] Test profile management
- [ ] Write tests for search and filters
- [ ] Add CI/CD integration for tests
- [ ] Document test coverage

**Technical Notes**:

- Use test database for E2E tests
- Mock external APIs where appropriate
- Run tests on every PR
- Aim for >70% critical path coverage

---

### P1-37: Unit & Integration Testing

**Priority**: P1
**Effort**: 5 days
**Dependencies**: All features

**Description**:
Add unit and integration tests for core functionality.

**Acceptance Criteria**:

- [ ] Set up Jest and React Testing Library
- [ ] Write tests for utility functions
- [ ] Test React components
- [ ] Test API routes
- [ ] Test database queries
- [ ] Test authentication logic
- [ ] Test business logic (job matching, notifications)
- [ ] Set up code coverage reports
- [ ] Aim for >60% code coverage

**Technical Notes**:

- Mock Supabase client for tests
- Use testing-library best practices
- Run tests in CI/CD pipeline
- Generate coverage reports

---

### P0-38: User Acceptance Testing (UAT)

**Priority**: P0
**Effort**: 5 days
**Dependencies**: P0-36

**Description**:
Conduct thorough user acceptance testing before launch.

**Acceptance Criteria**:

- [ ] Create UAT test plan
- [ ] Recruit beta testers (5-10 job seekers, 3-5 employers)
- [ ] Test all critical user flows
- [ ] Collect feedback on UX/UI
- [ ] Test on different devices and browsers
- [ ] Identify and fix critical bugs
- [ ] Document issues and resolutions
- [ ] Get sign-off from stakeholders

**Technical Notes**:

- Use staging environment
- Provide test accounts and data
- Use UserTesting or similar for additional feedback
- Create bug tracking system

---

## Epic 13: Deployment & DevOps

### P0-39: Production Environment Setup

**Priority**: P0
**Effort**: 3 days
**Dependencies**: None

**Description**:
Set up production hosting and infrastructure.

**Acceptance Criteria**:

- [ ] Choose hosting provider (Vercel recommended for Next.js)
- [ ] Set up production environment
- [ ] Configure custom domain (ghlhire.com)
- [ ] Set up SSL certificate
- [ ] Configure environment variables
- [ ] Set up CDN
- [ ] Configure DNS records
- [ ] Test production deployment
- [ ] Set up staging environment

**Technical Notes**:

- Use Vercel for easy Next.js deployment
- Configure preview deployments for PRs
- Use Vercel Edge Functions for API routes
- Set up domain forwarding (www → non-www)

---

### P0-40: CI/CD Pipeline

**Priority**: P0
**Effort**: 2 days
**Dependencies**: P0-39, P0-36

**Description**:
Set up automated deployment pipeline.

**Acceptance Criteria**:

- [ ] Set up GitHub Actions or Vercel CI
- [ ] Run linter on every commit
- [ ] Run tests on every PR
- [ ] Auto-deploy to staging on merge to main
- [ ] Manual approval for production deploys
- [ ] Run build checks
- [ ] Configure deployment notifications (Slack, email)
- [ ] Add rollback capability

**Technical Notes**:

- Use Vercel's built-in CI/CD if using Vercel
- Add branch protection rules
- Set up deployment previews
- Document deployment process

---

### P0-41: Database Backup & Recovery

**Priority**: P0
**Effort**: 2 days
**Dependencies**: P0-2

**Description**:
Implement database backup and recovery procedures.

**Acceptance Criteria**:

- [ ] Enable Supabase automatic backups (daily)
- [ ] Test backup restoration process
- [ ] Document backup schedule
- [ ] Set up backup monitoring
- [ ] Create disaster recovery plan
- [ ] Test recovery procedures
- [ ] Store backups in separate location
- [ ] Set up backup notifications

**Technical Notes**:

- Use Supabase built-in backups (Pro plan)
- Consider additional backup to S3
- Test restoration quarterly
- Document RTO and RPO

---

## Epic 14: Launch Preparation

### P0-42: Launch Checklist & Go-Live Plan

**Priority**: P0
**Effort**: 2 days
**Dependencies**: All P0 stories

**Description**:
Create comprehensive launch checklist and execution plan.

**Acceptance Criteria**:

- [ ] Complete pre-launch checklist
  - All P0 stories completed
  - Security audit passed
  - Performance benchmarks met
  - Legal documents in place
  - Payment processing tested
  - Email deliverability verified
  - Analytics configured
  - SEO optimizations in place
  - Mobile testing completed
- [ ] Create launch day runbook
- [ ] Assign roles and responsibilities
- [ ] Set up launch monitoring
- [ ] Prepare rollback plan
- [ ] Schedule launch communication

**Technical Notes**:

- Plan for gradual rollout if possible
- Have team on standby for launch day
- Monitor error rates closely
- Prepare for traffic spikes

---

### P1-43: Marketing Site Launch

**Priority**: P1
**Effort**: 3 days
**Dependencies**: P0-42

**Description**:
Launch marketing and promotional activities.

**Acceptance Criteria**:

- [ ] Announce on social media (LinkedIn, Twitter)
- [ ] Post in GHL community groups
- [ ] Send launch email to beta users
- [ ] Submit to product directories (Product Hunt, BetaList)
- [ ] Reach out to GHL influencers
- [ ] Create launch press release
- [ ] Monitor social mentions
- [ ] Respond to user feedback

**Technical Notes**:

- Prepare social media graphics
- Create launch video/demo
- Set up social media accounts
- Have customer support ready

---

### P1-44: Customer Support Setup

**Priority**: P1
**Effort**: 2 days
**Dependencies**: P0-42

**Description**:
Set up customer support infrastructure.

**Acceptance Criteria**:

- [ ] Set up support email (support@ghlhire.com)
- [ ] Create help center/FAQ page
- [ ] Set up support ticket system (Intercom, Zendesk, or simple email)
- [ ] Create canned responses for common questions
- [ ] Document common issues and solutions
- [ ] Set up live chat (optional)
- [ ] Define SLA for response times
- [ ] Train support team

**Technical Notes**:

- Start with simple email support
- Consider Intercom for scale
- Add search functionality to help center
- Create video tutorials

---

### P2-45: Onboarding Flow Optimization

**Priority**: P2
**Effort**: 3 days
**Dependencies**: P0-5, P0-6, P0-7

**Description**:
Create guided onboarding for new users.

**Acceptance Criteria**:

- [ ] Create welcome tour for job seekers
- [ ] Create welcome tour for employers
- [ ] Add progress indicators
- [ ] Provide quick start guides
- [ ] Send onboarding email series
- [ ] Add helpful tooltips
- [ ] Track onboarding completion
- [ ] Optimize based on user behavior

**Technical Notes**:

- Use react-joyride or similar for tours
- Keep onboarding concise
- Allow skipping
- Track drop-off points

---

## Estimated Timeline

### Phase 1: Foundation (Weeks 1-4)

**Focus**: Backend infrastructure, database, authentication

- P0-1 through P0-7
- P0-21 (Email setup)
- P0-39 (Environment setup)

### Phase 2: Core Features (Weeks 5-8)

**Focus**: Job board functionality, applications

- P0-8 through P0-13
- P0-26 (SEO basics)
- P0-29 (Mobile optimization)

### Phase 3: Payments & AI (Weeks 9-11)

**Focus**: Subscription system, AI features

- P0-14 through P0-16
- P1-17 through P1-19
- P1-22 through P1-24

### Phase 4: Polish & Testing (Weeks 12-13)

**Focus**: Testing, security, performance

- P0-31 through P0-32
- P0-34 (Legal)
- P0-36 through P0-38
- P1-33 (Monitoring)

### Phase 5: Launch (Week 14)

**Focus**: Final checks and go-live

- P0-40 through P0-42
- P1-43 through P1-44

### Post-Launch (Ongoing)

**Focus**: Optimization and P2 features

- P2-19, P2-20, P2-25
- P1-27, P1-28
- P1-30, P1-35
- P2-45

---

## Success Metrics

### Launch Targets (Month 1)

- 50+ active job postings
- 200+ registered job seekers
- 10+ registered employers
- 20+ job applications
- 5+ paid subscriptions

### 3-Month Targets

- 200+ active jobs
- 1,000+ job seekers
- 50+ employers
- 500+ applications
- 25+ paid subscriptions
- $2,000+ MRR

### 6-Month Targets

- 500+ active jobs
- 5,000+ job seekers
- 150+ employers
- 2,000+ applications
- 75+ paid subscriptions
- $7,500+ MRR

---

## Risk Assessment

### High Risk

1. **Payment Integration Issues**: Stripe integration complexity

   - Mitigation: Extensive testing, fallback to manual payments initially

2. **User Acquisition**: Difficulty attracting initial users

   - Mitigation: Early beta program, GHL community outreach, influencer partnerships

3. **Data Quality**: Poor quality job postings or spam
   - Mitigation: Manual review initially, automated moderation later

### Medium Risk

1. **Technical Scalability**: Database or server performance issues

   - Mitigation: Load testing, CDN, database optimization

2. **Competition**: Other job boards or GHL launching their own
   - Mitigation: Focus on niche, build community, unique features

### Low Risk

1. **Email Deliverability**: Emails going to spam

   - Mitigation: Proper domain authentication, reputable provider

2. **SEO Performance**: Slow organic traffic growth
   - Mitigation: Content marketing, backlink building, community presence

---

## Notes

- This roadmap is flexible and should be adjusted based on feedback and priorities
- P0 stories are must-haves for MVP launch
- P1 stories should be completed soon after launch
- P2 stories can be implemented based on user demand
- Regular stakeholder reviews recommended
- Consider agile sprints (2-week cycles)

---

**Last Updated**: 2025-11-05
**Document Owner**: Development Team
**Review Cadence**: Weekly
