"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useLocale } from "@/lib/locale-context";

export function FloatingCta() {
  const { t } = useLocale();

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2 px-4 py-3">
        <Link
          href="/book"
          className="flex-1 inline-flex items-center justify-center rounded-full bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 active:scale-[0.97] h-11 transition-all duration-200"
        >
          {t("common.bookNow")}
        </Link>
        <a
          href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
          className="inline-flex items-center justify-center rounded-full border border-border bg-background text-sm font-medium hover:bg-muted active:scale-[0.97] h-11 w-11 transition-all duration-200"
          aria-label="Call Karen Manicures"
        >
          📞
        </a>
      </div>
    </div>
  );
}
