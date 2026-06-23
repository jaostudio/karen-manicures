"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PendingBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  startTime: Date | string;
  service: { name: string; duration: number } | null;
}

export function PendingApprovals({
  bookings,
}: {
  bookings: PendingBooking[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleAction(id: string, action: "confirmed" | "cancelled") {
    if (action === "cancelled" && !confirm("Reject this booking? The customer will be notified.")) return;
    if (action === "confirmed" && !confirm("Approve this booking? The customer will be notified.")) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/admin/bookings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: action }),
      });
      if (res.ok) {
        toast.success(
          action === "confirmed"
            ? "Booking approved"
            : "Booking rejected"
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
  }

  async function handleApproveAll() {
    const pending = bookings.filter((b) => loading !== b.id);
    if (pending.length === 0) return;
    if (!confirm(`Approve all ${pending.length} pending bookings?`)) return;
    for (const b of pending) {
      await handleAction(b.id, "confirmed");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="destructive" className="rounded-full">
          {bookings.length} Pending
        </Badge>
        <h2 className="font-heading font-semibold">Approval Required</h2>
        {bookings.length > 1 && (
          <button
            onClick={handleApproveAll}
            disabled={!!loading}
            className="ml-auto text-xs text-pink-600 hover:text-pink-700 font-medium underline underline-offset-2 disabled:opacity-50"
          >
            Approve All
          </button>
        )}
      </div>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{b.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {b.service?.name} · {b.service?.duration} min
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(b.startTime).toLocaleTimeString("en-PH", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}{" "}
                  · 📞 {b.customerPhone}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                className="bg-green-600 hover:bg-green-700 h-10"
                onClick={() => handleAction(b.id, "confirmed")}
                disabled={loading === b.id}
              >
                ✓ Approve
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 h-10"
                onClick={() => handleAction(b.id, "cancelled")}
                disabled={loading === b.id}
              >
                ✕ Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
