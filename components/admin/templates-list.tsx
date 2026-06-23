"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Template {
  key: string;
  label: string;
  value: string;
  default: string;
}

export function TemplatesList({
  templates,
}: {
  templates: Template[];
}) {
  const router = useRouter();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const variables = ["{name}", "{service}", "{date}", "{time}", "{status}"];

  async function handleSave(key: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [`_template_${key}`]: editValue,
        }),
      });

      if (res.ok) {
        toast.success("Template saved");
        setEditingKey(null);
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(t: Template) {
    setEditingKey(t.key);
    setEditValue(t.value);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center justify-center rounded-lg text-sm font-medium hover:bg-muted px-2.5 py-1.5 h-9 w-9"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-heading font-bold">
          Notification Templates
        </h1>
      </div>

      <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 text-sm text-pink-800">
        <p className="font-medium mb-1">Available variables</p>
        <p className="text-xs">
          {variables.map((v) => (
            <code
              key={v}
              className="bg-pink-100 rounded px-1.5 py-0.5 mr-1 text-xs font-mono"
            >
              {v}
            </code>
          ))}
        </p>
      </div>

      <div className="space-y-4">
        {templates.map((t) => (
          <div
            key={t.key}
            className="bg-white rounded-xl border p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{t.label}</h3>
              {editingKey !== t.key && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEdit(t)}
                  className="text-xs"
                >
                  Edit
                </Button>
              )}
            </div>

            {editingKey === t.key ? (
              <div className="space-y-2">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={3}
                  className="text-sm font-mono"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingKey(null)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSave(t.key)}
                    disabled={saving}
                    className="bg-pink-600 hover:bg-pink-700"
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground font-mono bg-gray-50 rounded-lg p-3 leading-relaxed">
                {t.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
