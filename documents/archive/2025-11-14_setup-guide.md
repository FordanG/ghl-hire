# GHL Hire - Setup & Deployment Guide

**Last Updated**: 2025-11-05

This guide will help you set up GHL Hire for local development and deploy to production.

---

## Prerequisites

- Node.js 20+ and npm
- Git
- Supabase account (free tier is fine for development)
- Vercel account (for deployment)

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/FordanG/ghl-hire.git
cd ghl-hire
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `ghl-hire` (or your choice)
   - Database Password: Generate a secure password
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

#### Run Database Migrations

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase/migrations/001_initial_schema.sql`
5. Paste and click "Run"
6. Repeat for `002_row_level_security.sql`
7. Repeat for `003_seed_data.sql`

#### Get API Keys

1. In Supabase dashboard, go to "Project Settings" → "API"
2. Copy the following:
   - Project URL
   - `anon` `public` key

### 4. Configure Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Deployment

### 1. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

### 2. Set Production Environment Variables

In Vercel dashboard → Project Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 3. Configure Custom Domain

1. In Vercel dashboard → Project → Settings → Domains
2. Add your custom domain (e.g., `ghlhire.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate to be issued (~minutes)

### 4. Update Supabase Auth Settings

1. Go to Supabase dashboard → Authentication → URL Configuration
2. Add your production URL to "Site URL"
3. Add your production URL to "Redirect URLs"
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com`

### 5. Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret
7. In Supabase dashboard → Authentication → Providers → Google
8. Enable Google provider and paste credentials

---

## Adding Additional Services

### Stripe (for Payments)

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API Keys
3. Add to environment variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```
4. Set up webhook endpoint in Stripe Dashboard
5. Add webhook secret to environment variables

### OpenAI (for AI Features)

1. Create account at [platform.openai.com](https://platform.openai.com)
2. Generate API key
3. Add to environment variables:
   ```
   OPENAI_API_KEY=sk-...
   ```
4. Set up billing and usage limits

### Resend (for Emails)

1. Create account at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key
4. Add to environment variables:
   ```
   RESEND_API_KEY=re_...
   ```

### Vapi (for Voice Interviews)

1. Create account at [vapi.ai](https://vapi.ai)
2. Get API key from dashboard
3. Add to environment variables:
   ```
   VAPI_API_KEY=...
   ```

---

## Database Backup & Maintenance

### Automatic Backups

Supabase Pro plan includes:
- Daily automatic backups
- Point-in-time recovery
- 7-day backup retention

To enable:
1. Upgrade to Pro plan ($25/month)
2. Backups are automatic

### Manual Backup

```bash
# Using Supabase CLI
supabase db dump --db-url "postgresql://..." > backup.sql

# Restore
psql "postgresql://..." < backup.sql
```

---

## Monitoring & Analytics

### Error Tracking

Recommended: [Sentry](https://sentry.io)

1. Create Sentry project
2. Install Sentry SDK:
   ```bash
   npm install @sentry/nextjs
   ```
3. Run setup wizard:
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```

### Performance Monitoring

Use Vercel Analytics (built-in):
- Automatically enabled on Pro plan
- Shows Core Web Vitals, page views, etc.

### Database Monitoring

Use Supabase Dashboard:
- Database health
- Query performance
- Connection pooling stats
- API usage

---

## Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] Row Level Security (RLS) is enabled on all tables
- [ ] API keys are stored securely (use environment variables)
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Email verification is required for signups
- [ ] Rate limiting is implemented for API routes
- [ ] File uploads are validated and sanitized
- [ ] SQL injection is prevented (using parameterized queries)
- [ ] XSS protection is enabled
- [ ] CSRF tokens are used for forms
- [ ] Secrets are rotated regularly
- [ ] Database backups are configured

---

## Performance Optimization

### Caching Strategy

- Use Next.js ISR (Incremental Static Regeneration) for job listings
- Cache database queries with SWR or React Query
- Use CDN for static assets (automatic with Vercel)
- Optimize images with Next.js Image component

### Database Optimization

- Create indexes on frequently queried columns (already done in migrations)
- Use connection pooling (Supabase handles this)
- Paginate large result sets
- Use database views for complex queries

### Bundle Optimization

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

Optimize:
- Use dynamic imports for large components
- Tree-shake unused code
- Minimize dependencies
- Use Next.js Image for automatic optimization

---

## Troubleshooting

### Common Issues

#### "Failed to fetch from Supabase"
- Check if Supabase URL and anon key are correct
- Verify RLS policies allow the operation
- Check if you're authenticated (for protected routes)

#### "Authentication not working"
- Verify redirect URLs in Supabase settings
- Check if email verification is required
- Ensure OAuth credentials are correct

#### "Deployment failed on Vercel"
- Check build logs for errors
- Verify all environment variables are set
- Ensure Node.js version is compatible

#### "Database connection error"
- Check if Supabase project is active
- Verify database password
- Check if connection pooling is enabled

### Getting Help

- **Documentation**: Check `PRODUCTION_STORIES.md` and `FEATURE_ENHANCEMENTS.md`
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Community**: GitHub Issues

---

## Development Workflow

### Feature Development

1. Create feature branch: `git checkout -b feature/your-feature-name`
2. Make changes
3. Test locally
4. Commit: `git commit -m "Add feature description"`
5. Push: `git push origin feature/your-feature-name`
6. Create Pull Request on GitHub
7. Review and merge

### Database Changes

1. Create new migration file: `supabase/migrations/004_description.sql`
2. Write SQL for schema changes
3. Test in development
4. Run in production via Supabase SQL Editor
5. Document changes

### Deployment

Automatic deployment with Vercel:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment

---

## Cost Estimation

### Development (Free Tier)
- Supabase: Free
- Vercel: Free (Hobby)
- **Total**: $0/month

### Production (Minimal)
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Resend: $20/month
- **Total**: $65/month

### Production (With AI Features)
- Supabase Pro: $25/month
- Vercel Pro: $20/month
- Resend: $100/month (higher volume)
- OpenAI: $200-500/month
- Vapi: $200-500/month
- Stripe: 2.9% + $0.30 per transaction
- **Total**: $545-1,145/month

---

## Next Steps

1. Complete setup following this guide
2. Create test accounts (job seeker and employer)
3. Test all major flows:
   - Sign up / Sign in
   - Post a job
   - Apply to a job
   - Browse job listings
4. Review `PRODUCTION_STORIES.md` for feature implementation roadmap
5. Review `FEATURE_ENHANCEMENTS.md` for advanced features
6. Start implementing P0 features

---

**Need Help?** Check the documentation or create an issue on GitHub.

**Document Owner**: Development Team
