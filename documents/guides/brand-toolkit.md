# GHL Hire - Brand Toolkit

**Date**: 2026-07-04
**Author**: Claude (with Gabriel Fordan)
**Status**: Approved
**Last Updated**: 2026-07-04

---

## Overview

This is the reference guide for GHL Hire's visual identity: brand overview, color palette, typography, logo usage rules, and a full inventory of brand assets available in `public/brand/`. Anyone producing marketing material, social posts, or new UI surfaces for GHL Hire should start here.

---

## Brand Overview

**GHL Hire** is the job board built specifically for GoHighLevel professionals — connecting GoHighLevel agencies, SaaS companies, and specialists within the GHL ecosystem.

**Tone**: professional, optimistic, specialist. Copy and visuals should read as credible and industry-savvy (we know the GHL world), upbeat without being hype-driven, and confidently niche rather than generic-job-board.

---

## Color Palette

| Name | Hex | Usage |
|---|---|---|
| Primary | `#3b82f6` | Primary brand blue — buttons, links, accents |
| Primary Dark | `#2563eb` | Hover states, gradients, secondary emphasis |
| Deep Navy | `#0f172a` | Dark backgrounds, mono logo, dark-mode surfaces |
| Light Tint | `#eff6ff` | Light backgrounds, subtle fills, pattern base |
| Heading Text | `#111827` | Headings, high-emphasis text |
| Body Text | `#4b5563` | Body copy |
| Muted Text | `#9ca3af` | Placeholder / low-emphasis text |

---

## Typography

- **Site typeface**: Geist Sans (via `next/font/google`, see `src/app/layout.tsx`) — used for all product UI, headings, and body copy.
- **Display typeface (generated assets)**: a bold, geometric sans is used for wordmarks and headlines inside AI-generated brand assets (banners, social templates). It is not a system font — it's baked into the generated images, not used in live UI.

---

## Logo Suite

**Primary mark**: `/public/logo-mark.png` — the transparent hexagon icon. This is also the source for the site favicon at `src/app/icon.png`.

**Lockups** (new, in `public/brand/`):

| File | When to use |
|---|---|
| `logo-lockup-horizontal.png` | Standard lockup (mark + "GHL Hire" wordmark) on light/white backgrounds — default choice for docs, decks, letterhead |
| `logo-knockout-blue.png` | White knockout version for placement on brand-blue backgrounds or photography |
| `logo-mono-navy.png` | Single-color navy version for contexts that can't support the two-tone mark (embossing, single-color print, watermarks) |

### Usage Rules

- **Clear space**: maintain clear space around the lockup equal to the height of one hexagon chevron on all sides.
- **Do not** recolor, rotate, or stretch the mark or lockups.
- **Minimum size**: 24px height for the mark; do not scale lockups below legibility of the wordmark.

---

## Asset Inventory

All paths are relative to `public/`. Live URLs assume deployment to `https://ghlhire.com`.

| File | Dimensions | Intended Use | Live URL |
|---|---|---|---|
| `brand/logo-lockup-horizontal.png` | 1264x848 | Standard horizontal logo lockup for light backgrounds | https://ghlhire.com/brand/logo-lockup-horizontal.png |
| `brand/logo-knockout-blue.png` | 1264x848 | White knockout logo for blue backgrounds/photography | https://ghlhire.com/brand/logo-knockout-blue.png |
| `brand/logo-mono-navy.png` | 1264x848 | Single-color navy logo for single-color contexts | https://ghlhire.com/brand/logo-mono-navy.png |
| `brand/banner-x-header.png` | 3168x1344 | X (Twitter) profile header banner | https://ghlhire.com/brand/banner-x-header.png |
| `brand/banner-linkedin-cover.png` | 3168x1344 | LinkedIn company page cover banner | https://ghlhire.com/brand/banner-linkedin-cover.png |
| `brand/banner-email-header.png` | 1584x672 | Email newsletter header banner | https://ghlhire.com/brand/banner-email-header.png |
| `brand/social-were-hiring.png` | 1024x1024 | Instagram "We're Hiring" announcement template | https://ghlhire.com/brand/social-were-hiring.png |
| `brand/social-job-announcement.png` | 928x1152 | Vertical job announcement social template | https://ghlhire.com/brand/social-job-announcement.png |
| `brand/social-feature-announcement.png` | 1024x1024 | Product/feature announcement social card template | https://ghlhire.com/brand/social-feature-announcement.png |
| `brand/pattern-light.png` | 1024x1024 | Subtle light background pattern tile (seamless) | https://ghlhire.com/brand/pattern-light.png |
| `brand/pattern-dark.png` | 1024x1024 | Subtle dark background pattern tile (seamless) | https://ghlhire.com/brand/pattern-dark.png |
| `brand/illustration-employers.png` | 1200x896 | Employer-facing illustration (reviewing applicants) | https://ghlhire.com/brand/illustration-employers.png |
| `brand/illustration-jobseekers.png` | 1200x896 | Job seeker-facing illustration (browsing listings) | https://ghlhire.com/brand/illustration-jobseekers.png |
| `brand/illustration-empty-state.png` | 1024x1024 | Empty state illustration (no results) | https://ghlhire.com/brand/illustration-empty-state.png |
| `brand/illustration-success.png` | 1024x1024 | Success/celebration state illustration | https://ghlhire.com/brand/illustration-success.png |
| `og-image.png` | 1376x768 | Open Graph / social share image | https://ghlhire.com/og-image.png |
| `hero-illustration.png` | 1376x768 | Homepage hero illustration | https://ghlhire.com/hero-illustration.png |

### Batch 2 (2026-07-04)

| File | Dimensions | Intended Use | Live URL |
|---|---|---|---|
| `brand/story-were-hiring.png` | 768x1376 | Vertical Instagram/Facebook Story "We're Hiring" template | https://ghlhire.com/brand/story-were-hiring.png |
| `brand/banner-youtube.png` | 3168x1344 | YouTube channel art banner | https://ghlhire.com/brand/banner-youtube.png |
| `brand/card-testimonial.png` | 1024x1024 | Testimonial quote card template | https://ghlhire.com/brand/card-testimonial.png |
| `brand/card-stats.png` | 1024x1024 | Milestone/stats announcement card template | https://ghlhire.com/brand/card-stats.png |
| `brand/cover-blog.png` | 1376x768 | Blog post cover template | https://ghlhire.com/brand/cover-blog.png |
| `brand/cover-webinar.png` | 1024x1024 | Webinar event card template | https://ghlhire.com/brand/cover-webinar.png |
| `brand/banner-email-signature.png` | 1584x672 | Minimal email signature banner strip | https://ghlhire.com/brand/banner-email-signature.png |
| `brand/bg-deck-cover.png` | 2752x1536 | Presentation deck cover background (dark, title-safe center) | https://ghlhire.com/brand/bg-deck-cover.png |
| `brand/app-tile-blue.png` | 1024x1024 | App icon tile, blue gradient (light contexts) | https://ghlhire.com/brand/app-tile-blue.png |
| `brand/app-tile-dark.png` | 1024x1024 | App icon tile, dark navy (dark contexts) | https://ghlhire.com/brand/app-tile-dark.png |

**Pending / wishlist**: how-it-works step illustrations (profile / apply / hired) and an employer "post a job" illustration were **not generated** in this batch — the Higgsfield workspace ran out of credits. Carry these over to the next batch.

---

## Note on Social Templates

`social-were-hiring.png`, `social-job-announcement.png`, and `social-feature-announcement.png` are **visual templates**, not finished posts. They ship with placeholder zones (blank cards, generic headline copy). Overlay the real job title, company name, or announcement text in an image editor (Figma, Canva, Photoshop, etc.) before publishing — do not post them as-is.

---

## References

- Logo mark and favicon: `public/logo-mark.png`, `src/app/icon.png`
- Site typography config: `src/app/layout.tsx`
- Design system notes: [`CLAUDE.md`](../../CLAUDE.md#design-system)
