"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Loader2, Smartphone, Search } from "lucide-react";

type Status = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  startTime: string;
  status: Status;
  smsConsent: boolean;
  service: { name: string } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-700",
};

const statusActions: Record<string, { label: string; status: Status; variant?: string }[]> = {
  pending: [
    { label: "Approve", status: "confirmed" },
    { label: "Reject", status: "cancelled" },
  ],
  confirmed: [
    { label: "Complete", status: "completed" },
    { label: "No-show", status: "no_show" },
    { label: "Cancel", status: "cancelled" },
  ],
  completed: [],
  cancelled: [],
  no_show: [],
};

const statusLabels: Record<string, string> = {
  all: "All",
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
};

export default function BookingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [initLoaded, setInitLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/admin/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setInitLoaded(true);
      })
      .catch(() => {
        setInitLoaded(true);
      });
  }, []);

  const handleAction = useCallback(async (id: string, action: Status, customerName: string) => {
    const messages: Record<string, string> = {
      confirmed: `Approve booking for ${customerName}? They will be notified.`,
      cancelled: `Cancel booking for ${customerName}? They will be notified.`,
      completed: `Mark booking for ${customerName} as completed?`,
      no_show: `Mark booking for ${customerName} as no-show?`,
    };

    if (!confirm(messages[action] || `Update booking for ${customerName}?`)) return;

    setLoading(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: action }),
      });
      if (res.ok) {
        toast.success(`Booking ${action}`);
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: action } : b))
        );
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Action failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  }, [router]);

  const statusFilters = ["all", "pending", "confirmed", "completed", "cancelled", "no_show"];
  const filtered = (filter === "all" ? bookings : bookings.filter((b) => b.status === filter))
    .filter(
      (b) =>
        !searchQuery ||
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerPhone.includes(searchQuery)
    );

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium hover:bg-muted px-2.5 py-1.5 h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-heading font-bold">Bookings</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
        />
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              filter === f
                ? "bg-pink-600 text-white"
                : "bg-gray-100 text-muted-foreground hover:bg-gray-200"
            }`}
          >
            {statusLabels[f]}
            {f !== "all" && (
              <span className="ml-1 opacity-70">
                ({bookings.filter((b) => b.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {!initLoaded ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No bookings found</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((b) => {
            const actions = statusActions[b.status] || [];
            return (
              <div
                key={b.id}
                className="bg-white rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{b.customerName}</p>
                    {b.smsConsent && (
                      <Smartphone className="h-3.5 w-3.5 text-blue-500 shrink-0" aria-label="SMS consent" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {b.service?.name} ·{" "}
                    {format(new Date(b.startTime), "MMM d, yyyy h:mm a")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📞 {b.customerPhone}
                    {b.customerEmail && ` · ✉️ ${b.customerEmail}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className={`rounded-full text-xs ${statusColors[b.status] || ""}`}>
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1).replace("_", " ")}
                  </Badge>
                  {actions.map((a) => (
                    <Button
                      key={a.status}
                      size="sm"
                      variant={(a.variant as "outline" | undefined) || "outline"}
                      className={
                        a.status === "confirmed"
                          ? "bg-green-600 hover:bg-green-700 text-white text-xs h-8"
                          : a.status === "cancelled"
                            ? "text-red-600 border-red-200 hover:bg-red-50 text-xs h-8"
                            : a.status === "completed"
                              ? "bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                              : a.status === "no_show"
                                ? "text-gray-600 border-gray-200 hover:bg-gray-100 text-xs h-8"
                                : "text-xs h-8"
                      }
                      onClick={() => handleAction(b.id, a.status, b.customerName)}
                      disabled={loading === b.id}
                    >
                      {loading === b.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        a.label
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
