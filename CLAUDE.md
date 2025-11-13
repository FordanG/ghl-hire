# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GHL Hire is a job board platform specifically for GoHighLevel professionals. It's built with Next.js 15.4.5, React 19, TypeScript, and Tailwind CSS v4. The project is designed to connect GoHighLevel agencies, SaaS companies, and professionals within the GHL ecosystem.

## Development Commands

- `npm run dev` - Start development server with Turbopack (runs on <http://localhost:3000>)
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Architecture

### Framework Stack

- **Next.js 15.4.5** - App Router architecture (`src/app/` directory)
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript** - Strict type checking enabled
- **Tailwind CSS v4** - Utility-first CSS framework with modern config
- **Supabase** - Backend-as-a-Service for database, authentication, and real-time features
- **OpenAI** - AI capabilities for job matching, content generation, and smart recommendations

### Project Structure

```text
src/
├── app/                    # Next.js App Router pages and layouts
│   ├── globals.css        # Global styles with Tailwind imports
│   ├── layout.tsx         # Root layout with Geist fonts
│   └── page.tsx           # Homepage component
├── lib/
│   └── supabase/          # Supabase client configuration
│       ├── client.ts      # Browser client
│       ├── server.ts      # Server client
│       ├── middleware.ts  # Session management
│       └── test.ts        # Connection tests
├── types/
│   └── supabase.ts        # Auto-generated database types (1,601 lines)
└── middleware.ts          # App middleware (auth + security)

supabase/
└── migrations/            # Database migrations (11 files, 24 tables)
    ├── 001_initial_schema.sql
    ├── 002_row_level_security.sql
    ├── 003_seed_data.sql
    └── ... (8 more files)

documents/                 # All project documentation
├── README.md             # Documentation guidelines
├── sessions/             # Development session notes
├── setup/               # Setup and configuration guides
├── architecture/        # Architecture decisions and designs
├── guides/              # How-to guides and tutorials
└── archive/             # Archived/deprecated docs

reference designs/        # Static HTML mockups for design reference
├── home.html            # Complete homepage design
└── job-listing.html     # Job detail page design

public/                  # Static assets (SVGs, images)
```

### Key Configuration

- **Path aliases**: `@/*` maps to `./src/*` for clean imports
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **CSS Variables**: Custom properties for theming (background, foreground colors)
- **Dark mode**: Automatic via `prefers-color-scheme`

### Backend Services

- **Supabase Database**: PostgreSQL database for storing jobs, user profiles, applications, and company data
- **Supabase Auth**: User authentication and authorization for job seekers and employers
- **Supabase Real-time**: Live updates for job applications and notifications
- **OpenAI Integration**: AI-powered features including:
  - Job matching algorithms based on skills and experience
  - Automated job description enhancement
  - Smart candidate recommendations
  - Content generation for profiles and job postings

## Design System

The reference designs in `reference designs/` show the complete UI vision:

- Clean, professional job board interface
- Blue color scheme (#3b82f6) with gray text
- Lucide icons for consistent iconography
- Smooth fade-in animations with staggered delays
- Responsive grid layouts for job listings
- Inter font family for body text

Key UI patterns:

- Job cards with hover effects and shadow transitions
- Two-column layouts for job seekers vs employers
- Minimal header with clear navigation
- Call-to-action buttons with blue primary color

## Backend Infrastructure Status

### ✅ Completed (Production Ready)

- **Database**: 24 tables deployed with full relationships, indexes, and triggers
- **Authentication**: Supabase Auth configured with session management
- **Row Level Security**: Comprehensive RLS policies protecting user data
- **TypeScript Types**: Auto-generated types for type-safe database operations
- **Testing**: Full CRUD test suite passing
- **Documentation**: Complete setup, architecture, and security guides

### 🔄 In Progress

- **Seed Data**: Creating sample jobs, companies, and profiles for development
- **Frontend**: Building UI components with real data integration

### ⏳ Next Priorities (From PRODUCTION_STORIES.md)

1. P0-5: Authentication UI (sign-up/sign-in pages)
2. P0-6: Job Seeker Profile Management
3. P0-7: Company Profile Management
4. P0-8: Job Listings Page (replace mock data)
5. P0-9: Job Detail Pages
6. P0-10: Job Application System
7. P0-11: Job Posting for Employers

## Documentation Guidelines

### All Documentation Goes in `/documents/` Folder

The project uses a structured documentation system:

```
documents/
├── sessions/      # Daily dev session summaries (YYYY-MM-DD_topic.md)
├── setup/         # Setup & configuration guides (YYYY-MM-DD_topic.md)
├── architecture/  # Architecture decisions & designs (topic_architecture.md)
├── guides/        # How-to guides & tutorials (topic_guide.md)
└── archive/       # Deprecated docs (YYYY-MM-DD_original-name.md)
```

### When Creating Documentation

1. **Session Notes**: Put in `documents/sessions/` with date prefix
2. **Setup Guides**: Put in `documents/setup/` with date prefix
3. **Architecture**: Put in `documents/architecture/` (topic-based naming)
4. **How-To Guides**: Put in `documents/guides/` (topic-based naming)
5. **Archiving**: Move outdated docs to `documents/archive/` with date prefix

### Documentation Standards

- **Date Format**: `YYYY-MM-DD_` prefix for time-sensitive docs
- **Naming**: Use lowercase with hyphens (`database-setup-session.md`)
- **Metadata**: Include Date, Author, Status, Last Updated in all docs
- **Linking**: Use relative paths to link between documents
- **Status**: Draft | In Review | Approved | Deprecated

### Key Documentation Files

- [`documents/README.md`](documents/README.md) - Documentation guidelines
- [`documents/setup/2025-11-14_setup-complete.md`](documents/setup/2025-11-14_setup-complete.md) - Complete backend setup guide
- [`documents/architecture/2025-11-14_security-model.md`](documents/architecture/2025-11-14_security-model.md) - Security & RLS policies
- [`documents/sessions/`](documents/sessions/) - Development history
- [`PRODUCTION_STORIES.md`](PRODUCTION_STORIES.md) - Full project roadmap
- [`DOCUMENTATION_INDEX.md`](DOCUMENTATION_INDEX.md) - Quick reference index

### Quick Commands for Documentation

```bash
# Create session note
touch documents/sessions/$(date +%Y-%m-%d)_session-topic.md

# Create setup guide
touch documents/setup/$(date +%Y-%m-%d)_setup-topic.md

# Create architecture doc
touch documents/architecture/topic_architecture.md

# Create guide
touch documents/guides/how-to-topic.md

# Archive old doc
mv old-doc.md documents/archive/$(date +%Y-%m-%d)_old-doc.md
```

## Implementation Notes

- Backend infrastructure is complete and production-ready
- Database has 24 tables with comprehensive RLS policies
- TypeScript types auto-generated from schema (1,601 lines)
- Supabase client configured for browser and server
- All tests passing (connectivity, CRUD, auth, RLS)
- Reference designs guide UI implementation
- Animations use CSS keyframes with staggered delays (fade-in-1 through fade-in-6)
- The design emphasizes GoHighLevel specialization throughout copy and features
