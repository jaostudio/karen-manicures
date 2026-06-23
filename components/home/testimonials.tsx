"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { useLocale } from "@/lib/locale-context";

const testimonials = [
  { id: "t1", key: "1" },
  { id: "t2", key: "2" },
  { id: "t3", key: "3" },
];

export function Testimonials() {
  const { t } = useLocale();

  return (
    <section className="py-16 bg-pink-50">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-pink-800 mb-10">
            {t("testimonials.title")}
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((tItem, i) => (
            <FadeIn key={tItem.id} delay={i * 120}>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-pink-100 hover:shadow-md hover:translate-y-[-2px] transition-all duration-200">
                <div className="text-amber-400 text-lg mb-2">{"★★★★★"}</div>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  &ldquo;{t(`testimonials.review${tItem.key}`)}&rdquo;
                </p>
                <p className="font-semibold text-sm text-pink-700">
                  — {t(`testimonials.name${tItem.key}`)}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
