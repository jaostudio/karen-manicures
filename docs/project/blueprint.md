# Karen Manicures — Project Blueprint

Mobile-first booking and portfolio platform for Karen Manicures salon in Calauag, Quezon.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **UI:** shadcn/ui v4 (@base-ui/react)
- **Database:** SQLite (local) / Turso (production)
- **ORM:** Prisma v7 (driver adapters)
- **Auth:** iron-session
- **SMS:** Semaphore
- **Email:** Resend
- **Media:** Cloudinary
- **Deploy:** Railway

## Key Decisions
- Route groups: admin uses `app/admin/` prefix (not `(admin)`) to avoid /services and /gallery conflicts with public pages
- Prisma v7 requires driver adapters (`@prisma/adapter-better-sqlite3`, `@prisma/adapter-libsql`)
- Middleware uses cookie-based session check; migration to `proxy` pending
