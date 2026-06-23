"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";

interface GalleryImg {
  id: string;
  url: string;
  publicId: string;
  altText: string | null;
  sortOrder: number;
}

export function AdminGallery({ images }: { images: GalleryImg[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Image uploaded");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this image? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/gallery`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        toast.success("Image deleted");
        router.refresh();
      }
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold">Gallery</h1>
        <label>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-1" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      {images.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No images yet. Upload your first photo!
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border">
              <Image
                src={img.url}
                alt={img.altText || "Gallery image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(img.id)}
                aria-label="Delete image"
                className="absolute top-2 right-2 size-7 opacity-80 hover:opacity-100 z-10 shadow-md"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
