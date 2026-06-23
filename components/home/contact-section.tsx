"use client";

import { siteConfig } from "@/config/site";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { useLocale } from "@/lib/locale-context";

export function ContactSection() {
  const { t } = useLocale();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <FadeIn className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-pink-800 mb-4">
            {t("contact.title")}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t("contact.subtitle")}
          </p>
          <div className="space-y-4 text-left bg-pink-50 rounded-xl p-6 border border-pink-100">
            <div className="flex items-start gap-3">
              <span className="text-lg">📍</span>
              <div>
                <p className="font-medium">{t("contact.address")}</p>
                <p className="text-sm text-muted-foreground">
                  {siteConfig.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📞</span>
              <div>
                <p className="font-medium">{t("contact.phone")}</p>
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-sm text-muted-foreground hover:text-pink-600 transition-colors">
                  {siteConfig.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🕐</span>
              <div>
                <p className="font-medium">{t("contact.businessHours")}</p>
                {Object.entries(siteConfig.hours).map(([day, hours]) => {
                  const dayKey = day.toLowerCase();
                  return (
                    <p key={day} className="text-sm text-muted-foreground">
                      {t(`days.${dayKey}`)}: {hours}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-full bg-pink-600 text-primary-foreground text-sm font-medium hover:bg-pink-700 active:scale-[0.97] px-2.5 py-1.5 h-10 transition-all duration-200"
            >
              {t("contact.bookOnline")}
            </Link>
            <a
              href={siteConfig.messengerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background text-sm font-medium hover:bg-muted active:scale-[0.97] px-2.5 py-1.5 h-10 transition-all duration-200"
            >
              {t("contact.messageViaMessenger")}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
