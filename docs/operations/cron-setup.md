# Cron Job Setup (Vercel)

The app has a `GET /api/cron/send-reminders` endpoint that sends SMS/email reminders for upcoming bookings. It must be called periodically by Vercel Cron Jobs.

## Endpoint

```
GET /api/cron/send-reminders
Header: x-cron-secret: <CRON_SECRET>
```

The `CRON_SECRET` environment variable must match between the endpoint and Vercel's cron configuration.

## What It Does

- Finds `confirmed` bookings starting within the next 2 hours → sends `reminder_2h`
- Finds `confirmed` bookings starting within the next 24 hours → sends `reminder_24h`
- Skips bookings where the customer did not give SMS consent and has no email
- Deduplicates: won't re-send if a notification was already sent today for that booking/channel
- Returns JSON summary: `{ ok: true, processed: N, results: [...] }`

## Vercel Configuration

### 1. `vercel.json`

Create `vercel.json` in the project root:

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

This runs every 15 minutes, which is sufficient for catching all 24h and 2h reminders.

### 2. Environment Variables (Vercel Dashboard)

Set these in your Vercel project → Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `CRON_SECRET` | Shared secret to authorize cron calls (choose a random string) |
| `SEMAPHORE_API_KEY` | For SMS sending |
| `RESEND_API_KEY` | For email fallback |

### 3. Free Tier Limits

Vercel Hobby plan allows **2 active cron jobs** per project. This cron uses **1 slot**, leaving 1 spare for future use.

## Testing

```bash
curl -H "x-cron-secret: your_secret" https://yourdomain.com/api/cron/send-reminders
```

Or locally:

```bash
curl -H "x-cron-secret: your_secret" http://localhost:3000/api/cron/send-reminders
```
