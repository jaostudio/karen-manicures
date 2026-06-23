"use server";

import { prisma } from "@/lib/db";
import { bookingSchema } from "@/lib/validation";
import { checkConflicts, isSameDayBooking, getBlockedDates, isDateBlocked, getBusinessHours, parseTime, isOpenDay } from "@/lib/date-utils";
import { addMinutes, isBefore, isAfter } from "date-fns";
import { bookingConfig } from "@/config/booking";
import { siteConfig } from "@/config/site";
import { sendBookingNotification } from "@/lib/notifications";

export async function createBookingAction(formData: FormData) {
  const raw = {
    serviceId: formData.get("serviceId") as string,
    customerName: formData.get("customerName") as string,
    customerPhone: formData.get("customerPhone") as string,
    customerEmail: (formData.get("customerEmail") as string) || undefined,
    startTime: formData.get("startTime") as string,
    notes: (formData.get("notes") as string) || undefined,
    smsConsent: formData.get("smsConsent") === "true",
  };

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return { success: false, error: Object.values(errors).flat()[0] as string };
  }

  const data = parsed.data;
  const service = await prisma.service.findUnique({
    where: { id: data.serviceId },
  });
  if (!service || !service.isActive) {
    return { success: false, error: "Service not found or unavailable" };
  }

  const startTime = new Date(data.startTime);
  const endTime = addMinutes(startTime, service.duration);
  const now = new Date();

  if (!isOpenDay(startTime, siteConfig.openDays)) {
    return { success: false, error: "Salon is closed on this day" };
  }

  const blockedDates = await getBlockedDates();
  if (isDateBlocked(startTime, blockedDates)) {
    return { success: false, error: "Salon is closed on this date" };
  }

  const { open, close } = await getBusinessHours();
  const openTime = parseTime(open, startTime);
  const closeTime = parseTime(close, startTime);

  if (isBefore(startTime, openTime) || isAfter(endTime, closeTime)) {
    return { success: false, error: "Booking is outside business hours" };
  }

  const minNoticeMs = bookingConfig.minNoticeMinutes * 60 * 1000;
  if (isBefore(startTime, new Date(now.getTime() + minNoticeMs))) {
    return { success: false, error: "Minimum notice is 3 hours before the appointment" };
  }

  const conflicts = await checkConflicts(startTime, endTime);
  if (conflicts.length > 0) {
    return { success: false, error: "This time slot is no longer available" };
  }

  const sameDay = await isSameDayBooking(startTime);
  const status = sameDay ? "pending" : "confirmed";

  const booking = await prisma.booking.create({
    data: {
      serviceId: data.serviceId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      startTime,
      endTime,
      status,
      smsConsent: data.smsConsent,
      notes: data.notes || null,
    },
  });

  try {
    await sendBookingNotification(booking.id, "confirmation");
  } catch (err) {
    console.error("Failed to send notification:", err);
  }

  return {
    success: true,
    booking: {
      id: booking.id,
      status: booking.status,
      customerName: booking.customerName,
      serviceName: service.name,
      startTime: booking.startTime.toISOString(),
    },
  };
}
