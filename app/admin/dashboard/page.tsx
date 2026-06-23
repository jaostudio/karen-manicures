import { prisma } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";
import { PendingApprovals } from "@/components/admin/pending-approvals";
import { ScheduleView } from "@/components/admin/schedule-view";
import { QuickActions } from "@/components/admin/quick-actions";
import { format } from "date-fns";
import { requireAdmin } from "@/lib/auth";

export default async function DashboardPage() {
  await requireAdmin();

  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);

  const [pendingBookings, confirmedBookings, totalCount] =
    await Promise.all([
      prisma.booking.findMany({
        where: {
          status: "pending",
          startTime: { gte: dayStart, lte: dayEnd },
        },
        include: { service: true },
        orderBy: { startTime: "asc" },
      }),
      prisma.booking.findMany({
        where: {
          status: { in: ["confirmed", "completed"] },
          startTime: { gte: dayStart, lte: dayEnd },
        },
        include: { service: true },
        orderBy: { startTime: "asc" },
      }),
      prisma.booking.count({
        where: {
          status: { not: "cancelled" },
          startTime: { gte: dayStart, lte: dayEnd },
        },
      }),
    ]);

  const totalRevenue = confirmedBookings.reduce(
    (sum: number, b: { service?: { price?: number } | null }) => sum + (b.service?.price || 0),
    0
  );

  const hour = today.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">
            {greeting}, Karen!
          </h1>
          <p className="text-muted-foreground text-sm">
            {format(today, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-pink-600">{totalCount}</p>
            <p className="text-[11px] text-muted-foreground">Today</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              ₱{totalRevenue.toFixed(0)}
            </p>
            <p className="text-[11px] text-muted-foreground">Revenue</p>
          </div>
        </div>
      </div>

      {pendingBookings.length > 0 && (
        <PendingApprovals bookings={pendingBookings} />
      )}

      <ScheduleView bookings={confirmedBookings} />

      <QuickActions />
    </div>
  );
}
