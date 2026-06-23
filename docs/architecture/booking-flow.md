# Booking Flow

1. User selects service → date → time → fills contact info
2. Server action validates with Zod, checks for time conflicts
3. Booking created with `pending` status
4. Admin receives notification (SMS/email), approves or rejects
5. Customer gets confirmation SMS/email
6. 24h and 2h reminders sent automatically via cron route
