"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { toggleServiceActive } from "@/actions/admin";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  isActive: boolean;
  sortOrder: number;
}

export function AdminServices({ services }: { services: Service[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultForm = { name: "", description: "", duration: "30", price: "0", sortOrder: "0" };
  const [form, setForm] = useState(defaultForm);

  function openCreate() {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(svc: Service) {
    setEditing(svc);
    setForm({
      name: svc.name,
      description: svc.description || "",
      duration: svc.duration.toString(),
      price: svc.price.toString(),
      sortOrder: svc.sortOrder.toString(),
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("name", form.name);
      fd.set("description", form.description);
      fd.set("duration", form.duration);
      fd.set("price", form.price);
      fd.set("sortOrder", form.sortOrder);

      if (editing) {
        const { updateService } = await import("@/actions/admin");
        const res = await updateService(editing.id, fd);
        if (res.success) toast.success("Service updated");
        else toast.error("Failed to update");
      } else {
        const { createService } = await import("@/actions/admin");
        const res = await createService(fd);
        if (res.success) toast.success("Service created");
        else toast.error("Failed to create");
      }
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleServiceActive(id, !current);
    toast.success(current ? "Service disabled" : "Service enabled");
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const { deleteService } = await import("@/actions/admin");
      await deleteService(id);
      toast.success("Service deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete service");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Services</h1>
        <Button onClick={openCreate} size="sm" className="rounded-full">
          <Plus className="h-4 w-4 mr-1" /> Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border">
          <p className="text-muted-foreground text-sm mb-1">No services yet</p>
          <p className="text-xs text-muted-foreground">
            Click &ldquo;Add Service&rdquo; to create your first service
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-xl border p-4 flex items-center gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{svc.name}</p>
                  {!svc.isActive && (
                    <Badge variant="outline" className="text-xs">
                      Hidden
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {svc.duration} min · ₱{svc.price.toFixed(0)}
                </p>
              </div>
              <Button
                variant="ghost"
                className="h-9"
                onClick={() => handleToggle(svc.id, svc.isActive)}
              >
                {svc.isActive ? "Hide" : "Show"}
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => openEdit(svc)} aria-label="Edit service">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleDelete(svc.id, svc.name)} aria-label="Delete service">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="dur">Duration (min)</Label>
                <Input id="dur" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="price">Price (₱)</Label>
                <Input id="price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : editing ? "Update Service" : "Create Service"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
