"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { useLocale } from "@/lib/locale-context";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-50/30 animate-gradient">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-200/20 via-transparent to-transparent" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300/10 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <FadeIn className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="h-4 w-4" />
            <span>{t("hero.badge")}</span>
          </div>
          <h1 className="font-heading text-[2rem] leading-tight md:text-6xl font-bold text-pink-800 mb-4 tracking-tight">
            {t("hero.tagline")}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
            {t("hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 active:scale-[0.97] h-11 px-8 text-base shadow-sm hover:shadow-md transition-all duration-200"
            >
              {t("hero.bookNow")}
            </Link>
            <a
              href={siteConfig.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border-2 border-pink-200 bg-white text-pink-700 text-sm font-medium hover:bg-pink-50 active:scale-[0.97] h-11 px-8 text-base transition-all duration-200"
            >
              {t("hero.messageUs")}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
