# Karen Manicures — Admin Guide

Welcome! This guide walks you through everything you can do in the admin panel.

**Admin URL:** `https://karen-manicures.vercel.app/admin`

---

## Logging In

1. Go to the **Admin URL** above.
2. Enter your email and password:

   | Field | Value |
   |-------|-------|
   | Email | `karen@example.com` |
   | Password | `karen123` |

3. Tap **Sign in**.

> **Important:** Change your password after first login. Go to **Settings** in the sidebar.

---

## Dashboard

The dashboard shows your **day at a glance**:

- **Today's schedule** — all bookings for today, listed by time
- **Pending approvals** — new bookings that need your OK
- **Quick actions** — approve all pending bookings with one tap

Tap any booking to jump to the Bookings page.

---

## Bookings

View and manage all appointments.

### Viewing Bookings

- All bookings appear in a list with customer name, service, date, and status
- Statuses: **Pending**, **Confirmed**, **Completed**, **Cancelled**, **No-Show**

### Approving a Booking

1. Find the booking with **Pending** status
2. Tap **Approve** — the customer gets a confirmation SMS
3. Tap **Reject** if you can't accommodate — the customer gets a cancellation notice

### After the Appointment

- Once done, tap **Mark Complete**
- If the customer didn't show up, tap **No-Show**

---

## Services

Add, edit, or remove the services you offer.

### Adding a Service

1. Tap **Add Service**
2. Fill in:
   - **Name** — e.g. "Classic Manicure"
   - **Duration** — how long it takes (minutes)
   - **Price** — how much it costs
   - **Sort Order** — where it appears in the list (lower = first)
3. Choose an **icon** (emoji) for the service card
4. Tap **Save**

### Editing or Hiding

- Tap the **Edit** (pencil) icon to change a service
- Tap **Hide** to remove it from the public booking page (don't worry, you can show it again later)
- Tap **Delete** to remove it permanently

---

## Gallery

Show off your work! Upload photos of your nail art.

### Uploading

1. Tap **Upload Image**
2. Select a photo from your phone or computer
3. Add an **alt text** description (helps with SEO — e.g. "Pink gel manicure with flower design")
4. Tap **Save**

### Deleting

- Tap the **Delete** (trash) icon on any photo to remove it

---

## Settings

Configure your business.

### Business Hours

Set which days you're open and what time you open/close. Customers can only book during these hours.

### Blocked Dates

Block specific dates when you're not available (holidays, vacations, etc.). No bookings will be accepted on those days.

### Same-Day Booking

Set how many minutes before opening you need to accept a same-day booking. For example, if you open at 9 AM and the threshold is 180 minutes, customers can book up to 6 AM (3 hours before opening).

### Minimum Notice

The minimum time before a booking. Default is 3 hours.

---

## Templates

Edit the SMS messages sent to customers.

Available templates:

| Template | When It Sends |
|----------|---------------|
| **Confirmation** | Right after you approve a booking |
| **Reminder (24h)** | 24 hours before the appointment |
| **Reminder (2h)** | 2 hours before the appointment |
| **Cancellation** | When you reject or cancel a booking |

### Available Placeholders

Use these in your templates — they'll be replaced with real info:

| Placeholder | What It Shows |
|-------------|---------------|
| `{{name}}` | Customer's name |
| `{{service}}` | Booked service name |
| `{{date}}` | Appointment date |
| `{{time}}` | Appointment time |
| `{{salon}}` | Your salon name |
| `{{address}}` | Your salon address |

### Example Template

```
Hi {{name}}, your {{service}} on {{date}} at {{time}} is confirmed!
See you at {{salon}}, {{address}}.
```

---

## Calendar

A month-view calendar showing all your bookings at a glance. Tap any date to see that day's appointments.

---

## FAQs

### I forgot my password
Contact the developer to reset it. A password change option will be added in a future update.

### A booking isn't showing up
Check the **date** filter on the Bookings page. Also check if it was already approved or cancelled.

### A customer didn't receive their SMS
Make sure their phone number is correct in the booking. SMS credits may need to be topped up (check with the developer).

### How do I add a staff member?
Staff accounts are coming in a future update. For now, only you can log in.

---

## Need Help?

Contact the developer:

- **Jaostudio** — [jaostudio.dev](https://jaostudio.dev)
- Built with care, just like your nails.
