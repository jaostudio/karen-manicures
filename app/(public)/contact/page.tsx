import { siteConfig } from "@/config/site";
import Link from "next/link";
import { getServerLocale, getTranslation } from "@/lib/server-i18n";

export default async function ContactPage() {
  const locale = await getServerLocale();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-xl">
        <h1 className="font-heading text-4xl font-bold text-center text-pink-800 mb-8">
          {getTranslation(locale, "contact.pageTitle")}
        </h1>

        <div className="bg-pink-50 rounded-xl border border-pink-100 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">📍</span>
            <div>
              <p className="font-semibold">{getTranslation(locale, "contact.address")}</p>
              <p className="text-sm text-muted-foreground">
                {siteConfig.address}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">📞</span>
            <div>
              <p className="font-semibold">{getTranslation(locale, "contact.phone")}</p>
              <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-sm text-muted-foreground hover:text-pink-600 transition-colors">
                {siteConfig.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">✉️</span>
            <div>
              <p className="font-semibold">{getTranslation(locale, "contact.email")}</p>
              <a href={`mailto:${siteConfig.email}`} className="text-sm text-muted-foreground hover:text-pink-600 transition-colors">
                {siteConfig.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xl">🕐</span>
            <div>
              <p className="font-semibold">{getTranslation(locale, "contact.businessHours")}</p>
              {Object.entries(siteConfig.hours).map(([day, hours]) => {
                const dayKey = day.toLowerCase();
                const translatedDay = getTranslation(locale, `days.${dayKey}`);
                return (
                  <p key={day} className="text-sm text-muted-foreground">
                    {translatedDay}: {hours}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-full bg-pink-600 text-primary-foreground text-sm font-medium hover:bg-pink-700 px-2.5 py-1.5 h-9 flex-1"
          >
            {getTranslation(locale, "contact.bookOnline")}
          </Link>
          <a
            href={siteConfig.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background text-sm font-medium hover:bg-muted px-2.5 py-1.5 h-9 flex-1"
          >
            {getTranslation(locale, "contact.messageViaMessenger")}
          </a>
        </div>
      </div>
    </div>
  );
}
