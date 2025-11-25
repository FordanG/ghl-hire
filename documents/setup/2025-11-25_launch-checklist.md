# GHL Hire - Updated Launch Checklist

**Date**: 2025-11-25
**Status**: Pre-Launch Assessment
**Last Updated**: 2025-11-25

This checklist supersedes PRODUCTION_STORIES.md for launch planning. It reflects the actual current state of the codebase.

---

## Executive Summary

| Category | Status | Items Remaining |
|----------|--------|-----------------|
| Core Features | 90% Complete | 2 pages need real data |
| Payments | 85% Complete | Needs E2E testing |
| Legal | 100% Complete | Done |
| Email | 0% Complete | Not started |
| DevOps | 0% Complete | Not started |

---

## Category 1: Mock Data Migration (Priority: HIGH)

These pages currently use mock data and need Supabase integration:

### 1.1 Job Seeker Dashboard Pages

| Page | File | Mock Source | Effort |
|------|------|-------------|--------|
| Saved Jobs | `src/app/dashboard/saved/page.tsx` | `mockSavedJobs` | 2-3 hours |
| Job Alerts | `src/app/dashboard/alerts/page.tsx` | `mockJobAlerts` | 3-4 hours |

**Note**: The alerts page has UI for creating alerts but only stores in local state. Needs:
- Supabase integration for CRUD
- The `job_alerts` table already exists (migration 004)

### 1.2 Company Dashboard Pages

| Page | File | Mock Source | Effort |
|------|------|-------------|--------|
| Job Postings | `src/app/company/dashboard/jobs/page.tsx` | `mockJobPostings` | 2-3 hours |
| Analytics | `src/app/company/dashboard/analytics/page.tsx` | Mock stats | 4-6 hours |

**Note**: The jobs table exists and post-job creates real jobs. This page just needs to query real data instead of mock.

### 1.3 Files to Delete After Migration

Once migration is complete, remove:
- `src/lib/mock-data.ts`
- `src/lib/dashboard-data.ts` (keep type definitions, move to types/)
- `src/lib/company-data.ts` (keep type definitions, move to types/)

---

## Category 2: Payment Flow (Priority: HIGH)

### 2.1 What's Built
- [x] Pricing page with 3 tiers (Free, Basic $49.99, Premium $149.99)
- [x] Maya (PayMaya) checkout integration
- [x] `POST /api/payments/create-checkout` - Creates checkout session
- [x] `POST /api/payments/webhook` - Handles Maya webhooks
- [x] `payment_transactions` table
- [x] `subscriptions` table
- [x] Post-job page checks subscription limits

### 2.2 Needs Testing/Verification
- [ ] Test complete checkout flow end-to-end (Maya sandbox)
- [ ] Verify webhook updates subscription correctly
- [ ] Test subscription limit enforcement on job posting
- [ ] Verify billing page shows current plan (`/company/dashboard/billing`)
- [ ] Test plan upgrade/downgrade flow
- [ ] Verify free tier limits work correctly

### 2.3 Missing Payment Pages (Check if needed)
- [ ] `/company/billing/success` - Success redirect page
- [ ] `/company/billing/failed` - Failed payment page
- [ ] `/company/billing/canceled` - Canceled payment page

---

## Category 3: Email System (Priority: MEDIUM-HIGH)

### 3.1 Current State
- No email service configured
- No transactional emails implemented
- Supabase Auth handles password reset emails only

### 3.2 Required for Launch
- [ ] Choose email provider (Resend recommended for Next.js)
- [ ] Configure SPF, DKIM, DMARC for domain
- [ ] Implement critical emails:
  - [ ] Welcome email (after signup)
  - [ ] Application confirmation (job seeker)
  - [ ] New application notification (employer)

### 3.3 Nice to Have (Post-Launch)
- [ ] Job alert notifications
- [ ] Weekly job digest
- [ ] Application status updates
- [ ] Payment receipts

---

## Category 4: Production Environment (Priority: HIGH)

### 4.1 Hosting Setup
- [ ] Vercel project created
- [ ] Custom domain configured (ghlhire.com)
- [ ] SSL certificate active
- [ ] Environment variables set in Vercel

### 4.2 Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MAYA_PUBLIC_KEY=
MAYA_SECRET_KEY=
MAYA_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
OPENAI_API_KEY= (if using AI features)
```

### 4.3 Database Production
- [ ] Supabase production project created
- [ ] Migrations applied to production
- [ ] RLS policies verified
- [ ] Backup schedule enabled (Supabase Pro)

---

## Category 5: Security (Priority: MEDIUM)

### 5.1 Already Implemented
- [x] Row Level Security on all tables
- [x] Authentication middleware
- [x] Protected routes
- [x] Supabase Auth (secure by default)

### 5.2 Needs Verification/Implementation
- [ ] Security headers (CSP, HSTS, X-Frame-Options)
- [ ] Rate limiting on API routes
- [ ] Input sanitization review
- [ ] File upload size/type validation
- [ ] npm audit - check for vulnerabilities

---

## Category 6: Legal & Compliance (Priority: HIGH)

### 6.1 Completed
- [x] Terms of Service page (`/terms`)
- [x] Privacy Policy page (`/privacy`)
- [x] Cookie consent component exists

### 6.2 Verify Before Launch
- [ ] Review Terms of Service content for accuracy
- [ ] Review Privacy Policy for GDPR/compliance
- [ ] Cookie consent banner functional
- [ ] Contact email working (legal@ghlhire.com)

---

## Category 7: SEO & Analytics (Priority: MEDIUM)

### 7.1 Already Implemented
- [x] Dynamic meta tags on job pages
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] JSON-LD structured data (JobPosting schema)
- [x] View count tracking

### 7.2 Before Launch
- [ ] Create `robots.txt`
- [ ] Create dynamic `sitemap.xml`
- [ ] Verify canonical URLs
- [ ] Set up Google Search Console
- [ ] Set up Google Analytics / Vercel Analytics

---

## Category 8: Testing (Priority: MEDIUM)

### 8.1 Manual Testing Checklist
- [ ] Job seeker signup flow
- [ ] Employer signup flow
- [ ] Profile creation/editing
- [ ] Job posting flow
- [ ] Job application flow
- [ ] Search and filters
- [ ] Payment flow (sandbox)
- [ ] Mobile responsiveness

### 8.2 Optional E2E Tests
- [ ] Set up Playwright (if time permits)
- [ ] Critical path tests only

---

## Launch Sequence

### Phase 1: Data Migration (1-2 days)
1. Migrate Saved Jobs page to Supabase
2. Migrate Job Alerts page to Supabase
3. Migrate Company Jobs page to Supabase
4. Remove mock data files

### Phase 2: Payment Verification (1 day)
1. Test Maya checkout in sandbox
2. Verify webhook handling
3. Test subscription limits
4. Create success/failed redirect pages if missing

### Phase 3: Production Setup (1 day)
1. Create Vercel project
2. Configure domain
3. Set environment variables
4. Deploy and test

### Phase 4: Email Setup (1-2 days)
1. Set up Resend account
2. Configure domain
3. Implement 3 critical emails
4. Test delivery

### Phase 5: Final Checks (1 day)
1. Security headers
2. SEO files (robots.txt, sitemap)
3. Manual testing
4. Go live!

---

## Quick Wins (Can Do Now)

1. **robots.txt** - 5 minutes
2. **Remove unused mock imports** - 30 minutes
3. **npm audit fix** - 15 minutes
4. **Verify all pages load** - 30 minutes

---

## What's NOT Needed for MVP

These items from PRODUCTION_STORIES.md can wait:

- AI job matching (P2-19)
- AI resume analysis (P2-20)
- Blog/content system (already has pages, but content can wait)
- In-app notifications (P1-22)
- Job analytics dashboard (P1-23) - can launch with basic stats
- Admin platform analytics (P2-25)
- Content moderation system (P1-35) - manual review initially
- Onboarding tours (P2-45)

---

## Contact

For questions about this checklist, refer to:
- PRODUCTION_STORIES.md - Original roadmap (outdated)
- CLAUDE.md - Project setup guide
- documents/architecture/ - Technical decisions
