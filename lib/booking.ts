import { prisma } from "./db";
import { checkConflicts, isSameDayBooking, getBlockedDates, isDateBlocked, getBusinessHours, parseTime, isOpenDay } from "./date-utils";
import { isBefore, addMinutes, isAfter } from "date-fns";
import { bookingConfig } from "@/config/booking";
import { siteConfig } from "@/config/site";
import type { BookingFormData } from "@/types";

export async function createBooking(data: BookingFormData) {
  const service = await prisma.service.findUnique({
    where: { id: data.serviceId },
  });
  if (!service || !service.isActive) {
    return { success: false, error: "Service not found or unavailable" };
  }

  const startTime = new Date(data.startTime);
  const endTime = addMinutes(startTime, service.duration);
  const now = new Date();

  const { open, close } = await getBusinessHours();
  const openTime = parseTime(open, startTime);
  const closeTime = parseTime(close, startTime);

  if (!isOpenDay(startTime, siteConfig.openDays)) {
    return { success: false, error: "Salon is closed on this day" };
  }

  const blockedDates = await getBlockedDates();
  if (isDateBlocked(startTime, blockedDates)) {
    return { success: false, error: "Salon is closed on this date" };
  }

  if (isBefore(startTime, openTime) || isAfter(endTime, closeTime)) {
    return { success: false, error: "Booking is outside business hours" };
  }

  const minNoticeMs = bookingConfig.minNoticeMinutes * 60 * 1000;
  if (isBefore(startTime, new Date(now.getTime() + minNoticeMs))) {
    return { success: false, error: "Minimum notice is 3 hours before the appointment" };
  }

  const conflicts = await checkConflicts(startTime, endTime);
  if (conflicts.length > 0) {
    return { success: false, error: "Time slot is unavailable" };
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
      notes: data.notes || null,
    },
  });

  return { success: true, booking, status };
}

export async function cancelBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return { success: false, error: "Booking not found" };

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "cancelled" },
  });

  return { success: true };
}

export async function rescheduleBooking(
  bookingId: string,
  newStartTime: Date
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { service: true },
  });
  if (!booking || !booking.service)
    return { success: false, error: "Booking not found" };

  const endTime = addMinutes(newStartTime, booking.service.duration);

  const conflicts = await checkConflicts(newStartTime, endTime, bookingId);
  if (conflicts.length > 0) {
    return { success: false, error: "New time slot is unavailable" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { startTime: newStartTime, endTime, status: "confirmed" },
  });

  return { success: true };
}
