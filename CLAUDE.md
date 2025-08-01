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
src/app/           # Next.js App Router pages and layouts
├── globals.css    # Global styles with Tailwind imports and CSS variables
├── layout.tsx     # Root layout with Geist fonts
└── page.tsx       # Homepage component

reference designs/ # Static HTML mockups for design reference
├── home.html      # Complete homepage design with animations
└── job-listing.html # Job detail page design

public/           # Static assets (SVGs, images)
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

## Implementation Notes

- The current codebase is a fresh Next.js scaffold - the actual GHL Hire implementation needs to be built based on the reference designs
- Reference designs use Tailwind CDN and Lucide icons - these should be properly installed as dependencies
- Animations use CSS keyframes with staggered delays (fade-in-1 through fade-in-6)
- The design emphasizes GoHighLevel specialization throughout copy and features
- Environment variables will be needed for Supabase URL/keys and OpenAI API key
- Consider implementing Supabase Row Level Security (RLS) policies for data protection
