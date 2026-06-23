"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t bg-pink-50">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-pink-600" />
              <span className="font-heading text-lg font-bold text-pink-700">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("hero.description")}
            </p>
          </div>

          <div>
            <h2 className="font-heading font-semibold mb-3 text-base">{t("footer.quickLinks")}</h2>
            <nav className="flex flex-col gap-2">
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-pink-600 transition-colors"
                >
                  {t(`nav.${item.label.toLowerCase()}`)}
                </Link>
              ))}
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-pink-600 transition-colors">
                {t("legal.privacy")}
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-pink-600 transition-colors">
                {t("legal.terms")}
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="font-heading font-semibold mb-3 text-base">{t("footer.contact")}</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>📍 {siteConfig.address}</p>
              <p>📞 <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-pink-600 transition-colors">{siteConfig.phone}</a></p>
              <p>✉️ <a href={`mailto:${siteConfig.email}`} className="hover:text-pink-600 transition-colors">{siteConfig.email}</a></p>
              <div className="pt-2">
                <p className="font-medium text-foreground">{t("footer.hours")}:</p>
                {Object.entries(siteConfig.hours).map(([day, hours]) => {
                  const dayKey = day.toLowerCase();
                  return (
                      <p key={day} className="text-sm">
                      {t(`days.${dayKey}`)}: {hours}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground space-y-1">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. {t("footer.copyright")} {t("footer.builtBy")} <a href="https://jaostudio.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-pink-600 transition-colors">Jaostudio</a>.</p>
          <p>{t("footer.dataNotice")}</p>
        </div>
      </div>
    </footer>
  );
}
