"use client";

import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { useLocale } from "@/lib/locale-context";

export function AboutSection() {
  const { t } = useLocale();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto">
          <FadeIn delay={0}>
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-20 h-20 text-pink-400" />
            </div>
          </FadeIn>
          <FadeIn delay={100} className="flex-1">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-pink-800 mb-4">
              {t("about.title")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t("about.para1")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.para2")}
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
