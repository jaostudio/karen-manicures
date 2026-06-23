"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Settings {
  business_hours_open: string;
  business_hours_close: string;
  same_day_threshold: string;
  min_notice: string;
  blocked_dates: string;
}

export function AdminSettings({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [blockedInput, setBlockedInput] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Settings saved");
        router.refresh();
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function addBlockedDate() {
    if (!blockedInput) return;
    const existing = form.blocked_dates ? JSON.parse(form.blocked_dates) : [];
    existing.push(blockedInput);
    setForm({ ...form, blocked_dates: JSON.stringify(existing) });
    setBlockedInput("");
  }

  function removeBlockedDate(date: string) {
    const existing = JSON.parse(form.blocked_dates);
    setForm({
      ...form,
      blocked_dates: JSON.stringify(existing.filter((d: string) => d !== date)),
    });
  }

  const blockedDates: string[] = form.blocked_dates
    ? JSON.parse(form.blocked_dates)
    : [];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-heading font-bold">Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-xl border p-4 space-y-4">
          <h2 className="font-heading font-semibold">Business Hours</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Open Time</Label>
              <Input
                type="time"
                value={form.business_hours_open}
                onChange={(e) =>
                  setForm({ ...form, business_hours_open: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Close Time</Label>
              <Input
                type="time"
                value={form.business_hours_close}
                onChange={(e) =>
                  setForm({ ...form, business_hours_close: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 space-y-4">
          <h2 className="font-heading font-semibold">Booking Rules</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Same-day threshold (min)</Label>
              <Input
                type="number"
                value={form.same_day_threshold}
                onChange={(e) =>
                  setForm({ ...form, same_day_threshold: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Minimum notice (min)</Label>
              <Input
                type="number"
                value={form.min_notice}
                onChange={(e) =>
                  setForm({ ...form, min_notice: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 space-y-4">
          <h2 className="font-heading font-semibold">Blocked Dates</h2>
          <div className="flex gap-2">
            <Input
              type="date"
              value={blockedInput}
              onChange={(e) => setBlockedInput(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={addBlockedDate}>
              Add
            </Button>
          </div>
          {blockedDates.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blockedDates.map((d) => (
                <div
                  key={d}
                  className="bg-red-50 text-red-700 text-xs rounded-full px-3 py-1 flex items-center gap-2"
                >
                  {d}
                  <button onClick={() => removeBlockedDate(d)} aria-label={`Remove ${d}`}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full rounded-full bg-pink-600 hover:bg-pink-700"
          disabled={saving}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Save Settings
        </Button>
      </form>
    </div>
  );
}
