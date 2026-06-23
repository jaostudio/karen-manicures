import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBookingNotification } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    const where: Record<string, unknown> = {};
    if (date) {
      const start = new Date(date + "T00:00:00.000Z");
      const end = new Date(date + "T23:59:59.999Z");
      where.startTime = { gte: start, lte: end };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: { service: true },
      orderBy: { startTime: "asc" },
      take: 100,
    });

    const mapped = bookings.map((b) => ({
      id: b.id,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      customerEmail: b.customerEmail,
      serviceName: b.service?.name ?? "Unknown",
      serviceDuration: b.service?.duration ?? 0,
      startTime: b.startTime.toISOString(),
      status: b.status,
      smsConsent: b.smsConsent,
    }));

    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

const validTransitions: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "no_show", "cancelled"],
  completed: [],
  cancelled: [],
  no_show: [],
};

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const allowed = validTransitions[booking.status];
    if (!allowed || !allowed.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${booking.status} to ${status}` },
        { status: 400 }
      );
    }

    await prisma.booking.update({
      where: { id },
      data: { status },
    });

    const notificationType =
      status === "cancelled"
        ? "cancelled"
        : status === "confirmed"
          ? "confirmation"
          : "status_change";

    await sendBookingNotification(id, notificationType, { status });

    return NextResponse.json({ success: true, status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
