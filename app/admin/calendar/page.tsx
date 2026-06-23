"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface BookingSummary {
  id: string;
  customerName: string;
  serviceName: string;
  startTime: string;
  status: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!date) return;
    const dateStr = date.toISOString().split("T")[0];
    fetch(`/api/admin/bookings?date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBookings(data);
        else setBookings([]);
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [date]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const statusBadge: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    no_show: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium hover:bg-muted px-2.5 py-1.5 h-9 w-9"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-heading font-bold">Calendar</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(d) => {
              const day = new Date(d);
              day.setHours(0, 0, 0, 0);
              return day < today;
            }}
            className="rounded-xl border mx-auto"
          />
        </div>

        <div>
          <h2 className="font-heading font-semibold mb-3">
            {date
              ? date.toLocaleDateString("en-PH", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : "Select a date"}
          </h2>
          {loading ? (
            <div className="flex items-center gap-2 py-4">
              <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                Loading bookings...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No bookings for this date
            </p>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 bg-white rounded-xl border p-3"
                >
                  <div className="text-sm font-medium text-pink-600 w-14 flex-shrink-0">
                    {new Date(b.startTime).toLocaleTimeString("en-PH", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {b.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {b.serviceName}
                    </p>
                  </div>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                      statusBadge[b.status] || "bg-gray-100"
                    }`}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1).replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
