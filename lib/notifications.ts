import { prisma } from "./db";
import type { NotificationChannel } from "@prisma/client";

interface SendResult {
  success: boolean;
  error?: string;
}

async function sendSMS(phone: string, message: string): Promise<SendResult> {
  const apiKey = process.env.SEMAPHORE_API_KEY;
  const sender = process.env.SEMAPHORE_SENDER || "KarenMan";

  if (!apiKey) {
    return { success: false, error: "SEMAPHORE_API_KEY not configured" };
  }

  try {
    const url = new URL("https://api.semaphore.co/api/v4/messages");
    url.searchParams.set("apikey", apiKey);
    url.searchParams.set("number", phone);
    url.searchParams.set("message", message);
    url.searchParams.set("sendername", sender);

    const res = await fetch(url.toString(), { method: "POST" });
    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: `Semaphore error: ${text}` };
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

async function sendEmail(
  to: string,
  subject: string,
  message: string
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Karen Manicures <noreply@karenmanicures.com>",
        to,
        subject,
        text: message,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return { success: false, error: `Resend error: ${text}` };
    }
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

function fillTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] || `{${key}}`);
}

async function getTemplate(key: string): Promise<string> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  if (setting?.value) return setting.value;

  const fallbacks: Record<string, string> = {
    template_confirmation_sms:
      "Hi {name}, your {service} on {date} at {time} is confirmed! – Karen Manicures",
    template_reminder_24h_sms:
      "Reminder: {service} tomorrow at {time}. See you! – Karen Manicures",
    template_reminder_2h_sms:
      "Reminder: {service} at {time} today. We're ready for you! – Karen Manicures",
    template_cancelled_sms:
      "Hi {name}, your booking for {service} on {date} at {time} has been cancelled. – Karen Manicures",
    template_status_change_sms:
      "Hi {name}, your {service} booking status has been updated to: {status}. – Karen Manicures",
  };
  return fallbacks[key] || "";
}

export async function sendBookingNotification(
  bookingId: string,
  type:
    | "confirmation"
    | "reminder_24h"
    | "reminder_2h"
    | "status_change"
    | "cancelled",
  customVars?: Record<string, string>
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  });

  if (!booking) return;

  const vars: Record<string, string> = {
    name: booking.customerName,
    service: booking.service.name,
    date: new Date(booking.startTime).toLocaleDateString("en-PH", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    time: new Date(booking.startTime).toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
    }),
    status: booking.status,
    ...customVars,
  };

  const templateKeyMap: Record<string, string> = {
    confirmation: "template_confirmation_sms",
    reminder_24h: "template_reminder_24h_sms",
    reminder_2h: "template_reminder_2h_sms",
    cancelled: "template_cancelled_sms",
    status_change: "template_status_change_sms",
  };

  const templateKey = templateKeyMap[type] || "template_confirmation_sms";
  const message = fillTemplate(await getTemplate(templateKey), vars);

  const channels: { channel: NotificationChannel; recipient: string }[] = [];

  if (booking.smsConsent) {
    channels.push({ channel: "sms", recipient: booking.customerPhone });
  }

  if (booking.customerEmail) {
    channels.push({ channel: "email", recipient: booking.customerEmail });
  }

  if (channels.length === 0) return;

  for (const { channel, recipient } of channels) {
    const log = await prisma.notificationLog.create({
      data: {
        bookingId: booking.id,
        channel,
        recipient,
        message,
      },
    });

    let result: SendResult;
    if (channel === "sms") {
      result = await sendSMS(recipient, message);
    } else {
      const subject = `Karen Manicures - ${type.replace(/_/g, " ")}`;
      result = await sendEmail(recipient, subject, message);
    }

    await prisma.notificationLog.update({
      where: { id: log.id },
      data: {
        status: result.success ? "sent" : "failed",
        sentAt: result.success ? new Date() : null,
        error: result.error || null,
      },
    });

    if (!result.success && channel === "sms" && booking.customerEmail) {
      const fallbackLog = await prisma.notificationLog.create({
        data: {
          bookingId: booking.id,
          channel: "email",
          recipient: booking.customerEmail,
          message,
        },
      });

      const fallbackResult = await sendEmail(
        booking.customerEmail,
        `Karen Manicures - ${type.replace(/_/g, " ")}`,
        message
      );

      await prisma.notificationLog.update({
        where: { id: fallbackLog.id },
        data: {
          status: fallbackResult.success ? "sent" : "failed",
          sentAt: fallbackResult.success ? new Date() : null,
          error: fallbackResult.error || null,
        },
      });
    }
  }
}
