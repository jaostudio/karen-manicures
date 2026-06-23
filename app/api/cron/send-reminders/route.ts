import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBookingNotification } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("x-cron-secret");
  if (authHeader !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

  const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const reminders = [
    { type: "reminder_2h" as const, windowStart: now, windowEnd: in2Hours },
    { type: "reminder_24h" as const, windowStart: now, windowEnd: in24Hours },
  ];

  const results: { bookingId: string; type: string; status: string }[] = [];

  for (const { type, windowStart, windowEnd } of reminders) {
    const bookings = await prisma.booking.findMany({
      where: {
        status: "confirmed",
        startTime: { gte: windowStart, lte: windowEnd },
      },
    });

    for (const booking of bookings) {
      if (!booking.smsConsent && !booking.customerEmail) {
        results.push({ bookingId: booking.id, type, status: "no_channel" });
        continue;
      }

      const alreadySent = await prisma.notificationLog.findFirst({
        where: {
          bookingId: booking.id,
          channel: booking.smsConsent ? "sms" : "email",
          status: "sent",
          createdAt: { gte: dayStart },
        },
      });

      if (alreadySent) {
        results.push({ bookingId: booking.id, type, status: "already_sent" });
        continue;
      }

      try {
        await sendBookingNotification(booking.id, type);
        results.push({ bookingId: booking.id, type, status: "sent" });
      } catch (err) {
        console.error("Cron notification error:", err);
        results.push({ bookingId: booking.id, type, status: "failed" });
      }
    }
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
