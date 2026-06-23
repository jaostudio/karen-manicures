import Link from "next/link";
import { Scissors, Ban, Image, Settings } from "lucide-react";

export function QuickActions() {
  return (
    <div>
      <h2 className="font-heading font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/admin/services"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted h-auto py-4 flex-col gap-1"
        >
          <Scissors className="h-5 w-5 text-pink-600" />
          <span className="text-xs font-normal">New Service</span>
        </Link>
        <Link
          href="/admin/settings"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted h-auto py-4 flex-col gap-1"
        >
          <Ban className="h-5 w-5 text-amber-600" />
          <span className="text-xs font-normal">Block Date</span>
        </Link>
        <Link
          href="/admin/gallery"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted h-auto py-4 flex-col gap-1"
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image className="h-5 w-5 text-blue-600" />
          <span className="text-xs font-normal">Add Photo</span>
        </Link>
        <Link
          href="/admin/settings"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted h-auto py-4 flex-col gap-1"
        >
          <Settings className="h-5 w-5 text-gray-600" />
          <span className="text-xs font-normal">Settings</span>
        </Link>
      </div>
    </div>
  );
}
