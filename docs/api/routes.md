# API Routes

## Public
- `GET /api/booking/slots` — Available time slots for a given date and service

## Admin
- `POST /api/admin/login` — Admin login (returns session cookie)
- `POST /api/admin/logout` — Admin logout (destroys session)
- `PATCH /api/admin/bookings` — Approve/reject booking
- `POST /api/admin/gallery` — Upload image to Cloudinary
- `PUT /api/admin/settings` — Update business settings

## Cron
- `GET /api/cron/send-reminders` — Send SMS/email reminders for upcoming bookings
