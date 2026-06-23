"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Menu, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLocale } from "@/lib/locale-context";

export function Header() {
  const { t, locale, setLocale } = useLocale();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-pink-600" />
          <span className="font-heading text-xl font-bold text-pink-700">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {siteConfig.navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-pink-600"
            >
              {t(`nav.${item.label.toLowerCase()}`)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "en" ? "tl" : "en")}
            className="inline-flex items-center justify-center rounded-full border border-border bg-background text-xs font-medium hover:bg-muted active:scale-[0.97] h-9 px-3 transition-all duration-200"
            aria-label={`Switch to ${locale === "en" ? "Tagalog" : "English"}`}
          >
            {locale === "en" ? "🇵🇭 TL" : "🇺🇸 EN"}
          </button>
          <a
            href={siteConfig.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background text-sm font-medium hover:bg-muted active:scale-[0.97] h-9 px-3 text-sm transition-all duration-200"
          >
            {t("common.messenger")}
          </a>
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-pink-600 text-primary-foreground text-sm font-medium hover:bg-pink-700 active:scale-[0.97] h-9 px-3 text-sm transition-all duration-200"
          >
            {t("common.bookNow")}
          </Link>
        </div>

        <Sheet>
          <SheetTrigger
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium hover:bg-muted h-10 w-10 md:hidden"
            aria-label={t("common.menu")}
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Language</span>
                <button
                  onClick={() => setLocale(locale === "en" ? "tl" : "en")}
                  className="inline-flex items-center justify-center rounded-full border border-border bg-background text-xs font-medium hover:bg-muted active:scale-[0.97] h-9 px-2.5 transition-all duration-200"
                  aria-label={`Switch to ${locale === "en" ? "Tagalog" : "English"}`}
                >
                  {locale === "en" ? "🇵🇭 TL" : "🇺🇸 EN"}
                </button>
              </div>
              {siteConfig.navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium"
                >
                  {t(`nav.${item.label.toLowerCase()}`)}
                </Link>
              ))}
              <hr />
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-pink-600 text-primary-foreground text-sm font-medium hover:bg-pink-700 active:scale-[0.97] px-2.5 py-1.5 h-9 w-full transition-all duration-200"
              >
                {t("common.bookNow")}
              </Link>
              <a
                href={siteConfig.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background text-sm font-medium hover:bg-muted active:scale-[0.97] px-2.5 py-1.5 h-9 w-full transition-all duration-200"
              >
                {t("common.messageOnMessenger")}
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
