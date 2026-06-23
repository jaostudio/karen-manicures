"use client";

import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  startTime: Date | string;
  status: string;
  notes?: string | null;
  service: { name: string; duration: number } | null;
}

export function ScheduleView({ bookings }: { bookings: Booking[] }) {
  const statusColors: Record<string, string> = {
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    no_show: "bg-gray-100 text-gray-700",
  };

  const sorted = [...bookings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div>
      <h2 className="font-heading font-semibold mb-3">Today&apos;s Schedule</h2>
      {sorted.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          No appointments today
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-4 bg-white rounded-xl border p-4"
            >
              <div className="text-sm font-medium text-pink-600 w-16 flex-shrink-0">
                {new Date(b.startTime).toLocaleTimeString("en-PH", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{b.customerName}</p>
                <p className="text-xs text-muted-foreground">
                  {b.service?.name} · {b.service?.duration} min
                </p>
                {b.notes && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    📝 {b.notes}
                  </p>
                )}
              </div>
              <Badge
                className={`rounded-full text-xs ${
                  statusColors[b.status] || "bg-gray-100"
                }`}
              >
                {b.status.charAt(0).toUpperCase() + b.status.slice(1).replace("_", " ")}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
