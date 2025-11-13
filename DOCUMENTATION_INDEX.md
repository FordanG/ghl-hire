# GHL Hire - Documentation Index

**Quick Links**: All project documentation is organized in the `/documents/` folder.

---

## 📚 Documentation Structure

All documentation is located in `/documents/` with the following structure:

```
documents/
├── README.md           # Documentation guidelines and standards
├── sessions/           # Development session summaries
├── setup/             # Setup and configuration guides
├── architecture/      # Architecture decisions and designs
└── guides/            # How-to guides and tutorials
```

---

## 🚀 Quick Start

### For Developers
1. Read: [`documents/setup/2025-11-14_setup-complete.md`](documents/setup/2025-11-14_setup-complete.md)
2. Review: [`CLAUDE.md`](CLAUDE.md) for project guidelines
3. Check: [`PRODUCTION_STORIES.md`](PRODUCTION_STORIES.md) for roadmap

### For Contributors
1. Read: [`documents/README.md`](documents/README.md) for documentation standards
2. Check: Latest session in [`documents/sessions/`](documents/sessions/)
3. Review: Project structure in [`CLAUDE.md`](CLAUDE.md)

---

## 📖 Current Documentation

### Setup & Configuration
- ✅ [Complete Setup Guide](documents/setup/2025-11-14_setup-complete.md) - Backend infrastructure, database, testing

### Development Sessions
- ✅ [2025-11-14 - Database Setup](documents/sessions/2025-11-14_database-setup-session.md) - Supabase integration, migrations, testing

### Project Documentation
- ✅ [CLAUDE.md](CLAUDE.md) - Project guidelines for AI assistance
- ✅ [PRODUCTION_STORIES.md](PRODUCTION_STORIES.md) - Full development roadmap
- ✅ [README.md](README.md) - Project overview

---

## 📝 Creating New Documentation

All new documents should go in the `/documents/` folder:

```bash
# Session notes
touch documents/sessions/$(date +%Y-%m-%d)_session-topic.md

# Setup guides
touch documents/setup/$(date +%Y-%m-%d)_setup-topic.md

# Architecture docs
touch documents/architecture/topic_architecture.md

# How-to guides
touch documents/guides/how-to-topic.md
```

See [`documents/README.md`](documents/README.md) for complete documentation standards.

---

## 🔍 Finding Documentation

### By Topic
- **Setup & Installation**: `documents/setup/`
- **Architecture & Design**: `documents/architecture/`
- **Tutorials & Guides**: `documents/guides/`
- **Session History**: `documents/sessions/`

### By Date
Session notes are prefixed with dates (`YYYY-MM-DD_`) for easy chronological browsing.

### By Search
```bash
# Search all documentation
grep -r "search term" documents/

# Find specific files
find documents/ -name "*keyword*"
```

---

## 📅 Latest Updates

**Last Session**: 2025-11-14 - Database Setup & Supabase Integration

**What's New**:
- ✅ Database schema deployed (24 tables)
- ✅ Supabase client configured
- ✅ TypeScript types generated
- ✅ Testing suite created
- ✅ Documentation structure established

**Next Up**: P0-5 - Authentication UI (sign-up/sign-in pages)

---

## 🎯 Project Status

### Completed (P0)
- ✅ P0-1: Supabase Setup & Configuration
- ✅ P0-2: Database Schema Design & Migration
- ✅ P0-3: Row Level Security Policies (95%)

### In Progress
- 🔄 P1-4: Database Seed Data

### Next Priority
- ⏳ P0-5: Supabase Authentication Setup
- ⏳ P0-6: User Profile Management (Job Seekers)
- ⏳ P0-7: Company Profile Management (Employers)

See [`PRODUCTION_STORIES.md`](PRODUCTION_STORIES.md) for full roadmap.

---

## 💡 Key Resources

### For Development
- [Supabase Docs](https://supabase.com/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

### Project Specific
- Database Types: `src/types/supabase.ts`
- Supabase Client: `src/lib/supabase/`
- Environment Config: `.env.local` (use `.env.example` as template)

---

## 🤝 Contributing

When contributing documentation:

1. Follow naming conventions in [`documents/README.md`](documents/README.md)
2. Include date in session notes and setup guides
3. Update this index when adding major documentation
4. Keep documents current with code changes
5. Link related documents together

---

## 📞 Getting Help

- **Setup Issues**: Check `documents/setup/` folder
- **Architecture Questions**: Review `documents/architecture/` (when available)
- **How-To Questions**: Check `documents/guides/` folder
- **Recent Changes**: See latest in `documents/sessions/`
- **Project Guidelines**: Read `CLAUDE.md`

---

**Last Updated**: 2025-11-14
**Maintained By**: Development Team

For more information, see [`documents/README.md`](documents/README.md)
