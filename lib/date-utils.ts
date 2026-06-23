import {
  format,
  startOfDay,
  endOfDay,
  addMinutes,
  isBefore,
  isAfter,
  isEqual,
  setHours,
  setMinutes,
  getDay,
} from "date-fns";
import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

export function parseTime(timeStr: string, date: Date): Date {
  const [h, m] = timeStr.split(":").map(Number);
  return setMinutes(setHours(date, h), m);
}

export function formatDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function formatTime(d: Date): string {
  return format(d, "h:mm a");
}

export function formatDateTime(d: Date): string {
  return format(d, "MMM d, yyyy h:mm a");
}

export function isOpenDay(date: Date, openDays: number[]): boolean {
  return openDays.includes(getDay(date));
}

export async function getBusinessHours(): Promise<{
  open: string;
  close: string;
}> {
  const setting = await prisma.setting.findUnique({
    where: { key: "business_hours" },
  });
  const defaultHours = { open: "09:00", close: "18:00" };
  if (!setting) return defaultHours;
  try {
    const parsed = JSON.parse(setting.value);
    return parsed.mon_sat || defaultHours;
  } catch {
    return defaultHours;
  }
}

export async function getThresholds(): Promise<{
  sameDay: number;
  minNotice: number;
}> {
  const sameDaySetting = await prisma.setting.findUnique({
    where: { key: "same_day_threshold" },
  });
  const minNoticeSetting = await prisma.setting.findUnique({
    where: { key: "min_notice" },
  });
  return {
    sameDay: sameDaySetting ? parseInt(sameDaySetting.value) : 180,
    minNotice: minNoticeSetting ? parseInt(minNoticeSetting.value) : 180,
  };
}

export async function getBlockedDates(): Promise<string[]> {
  const setting = await prisma.setting.findUnique({
    where: { key: "blocked_dates" },
  });
  if (!setting) return [];
  try {
    return JSON.parse(setting.value) as string[];
  } catch {
    return [];
  }
}

export function isDateBlocked(date: Date, blockedDates: string[]): boolean {
  const dateStr = format(date, "yyyy-MM-dd");
  return blockedDates.includes(dateStr);
}

export async function generateTimeSlots(
  date: Date,
  serviceDuration: number,
  openDays: number[]
): Promise<string[]> {
  if (!isOpenDay(date, openDays)) return [];

  const blocked = await getBlockedDates();
  if (isDateBlocked(date, blocked)) return [];

  const { open, close } = await getBusinessHours();
  const openDate = parseTime(open, date);
  const closeDate = parseTime(close, date);

  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const existingBookings = await prisma.booking.findMany({
    where: {
      status: { in: ["confirmed", "pending"] },
      startTime: { gte: dayStart, lte: dayEnd },
    },
    select: { startTime: true, endTime: true },
  });

  const slots: string[] = [];
  let cursor = openDate;

  while (isBefore(cursor, closeDate) || isEqual(cursor, closeDate)) {
    const slotEnd = addMinutes(cursor, serviceDuration);
    if (isAfter(slotEnd, closeDate)) break;

    const hasConflict = existingBookings.some(
      (b) =>
        (isBefore(cursor, b.endTime) || isEqual(cursor, b.endTime)) &&
        (isAfter(slotEnd, b.startTime) || isEqual(slotEnd, b.startTime)) &&
        (isAfter(cursor, b.startTime) || isEqual(cursor, b.startTime)) &&
        isBefore(cursor, b.endTime)
    );

    if (!hasConflict) {
      slots.push(format(cursor, "HH:mm"));
    }

    cursor = addMinutes(cursor, serviceDuration);
  }

  return slots;
}

export async function checkConflicts(
  startTime: Date,
  endTime: Date,
  excludeBookingId?: string
) {
  const where: Prisma.BookingWhereInput = {
    status: { in: ["confirmed", "pending"] },
    startTime: { lt: endTime },
    endTime: { gt: startTime },
  };
  if (excludeBookingId) {
    where.id = { not: excludeBookingId };
  }
  return prisma.booking.findMany({ where });
}

export async function isSameDayBooking(startTime: Date): Promise<boolean> {
  const { open } = await getBusinessHours();
  const openDate = parseTime(open, startOfDay(startTime));
  const thresholds = await getThresholds();
  const thresholdDate = addMinutes(openDate, thresholds.sameDay);
  return isBefore(startTime, thresholdDate);
}
