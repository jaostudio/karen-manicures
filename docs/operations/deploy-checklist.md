# Deploy Checklist (Vercel + Turso)

## Before First Deploy

### 1. Set Environment Variables in Vercel

In Vercel dashboard → Project → Settings → Environment Variables, add **Production** values for:

| Variable | Required | Source |
|----------|----------|--------|
| `TURSO_DATABASE_URL` | ✅ | Turso dashboard → database URL |
| `TURSO_AUTH_TOKEN` | ✅ | Turso dashboard → generate token |
| `IRON_SESSION_PASSWORD` | ✅ | Generate a random 32+ char string |
| `CRON_SECRET` | ✅ | Generate a random string |
| `SEMAPHORE_API_KEY` | ⚠️ | Semaphore dashboard (needed for SMS) |
| `RESEND_API_KEY` | ⚠️ | Resend dashboard (needed for email) |
| `CLOUDINARY_CLOUD_NAME` | ⚠️ | Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | ⚠️ | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | ⚠️ | Cloudinary dashboard |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ⚠️ | Cloudinary dashboard |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your production URL (e.g. `https://karen-manicures.vercel.app`) |
| `NEXT_PUBLIC_MESSENGER_URL` | ⚠️ | Facebook Messenger URL |
| `SENTRY_DSN` | Optional | Sentry dashboard |
| `BLOB_READ_WRITE_TOKEN` | Optional | Vercel Blob dashboard |

### 2. Run Production Database Migration

```bash
# Set Turso env vars for your terminal
$env:TURSO_DATABASE_URL="libsql://..."
$env:TURSO_AUTH_TOKEN="..."

# Apply migrations
npx prisma migrate deploy

# Seed admin user, services, and settings
npx tsx scripts/seed-production.ts
```

### 3. Verify vercel.json

Ensure `vercel.json` exists with the cron definition:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

## After Deploy — Smoke Test

- [ ] Visit `/` — loads in <3s, images visible, layout correct
- [ ] Click "Book Now" → wizard loads (step 1: services)
- [ ] Select a service → step 2 loads (date/time picker)
- [ ] Pick a future date + time slot → step 3 loads (customer info)
- [ ] Fill in test name/phone, check SMS consent, submit → confirmation shown
- [ ] Login at `/admin` with `karen@example.com` / `karen123`
- [ ] Dashboard shows booking in pending approvals
- [ ] Approve booking → toast confirms, status changes
- [ ] Visit `/admin/calendar` — approved booking visible
- [ ] Visit `/admin/bookings` — search, filter, and status actions work
- [ ] Visit `/admin/services` — CRUD works
- [ ] Visit `/admin/settings` — settings load and save
- [ ] Visit `/admin/templates` — templates load
- [ ] Visit `/privacy` — renders correctly
- [ ] Visit `/terms` — renders correctly
- [ ] Footer links to privacy/terms work
- [ ] Toggle language to Tagalog — all public pages translate
- [ ] Visit `/api/health` — returns `{ "status": "ok" }`
- [ ] Visit `/nonexistent` — shows branded 404 page
- [ ] Run Lighthouse (mobile) — score >85
- [ ] `robots.txt` returns proper rules (disallow `/admin/`)
- [ ] `sitemap.xml` lists all public pages

## Post-Launch

- [ ] Submit to Google Search Console
- [ ] Verify `property`, wait for indexing
- [ ] Set up crawler via sitemap ping
- [ ] Test live cron: `curl -H "x-cron-secret: <secret>" https://yourdomain.com/api/cron/send-reminders`
