import { getServerLocale } from "@/lib/server-i18n";
import { getTranslation } from "@/lib/i18n";
import { siteConfig } from "@/config/site";

export default async function PrivacyPage() {
  const locale = await getServerLocale();
  const t = (key: string) => getTranslation(locale, key);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading text-foreground">
          {t("legal.privacy")}
        </h1>
        <div className="w-12 h-1 bg-pink-600 rounded mx-auto mt-4" />
        <p className="text-muted-foreground mt-4">
          {t("legal.lastUpdated")}: June 2026
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.collect")}</h2>
          <p className="text-muted-foreground">{t("legal.collectDesc")}</p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Name / Pangalan</li>
            <li>Phone number / Numero ng telepono</li>
            <li>Email address (optional / opsyonal)</li>
            <li>Service preferences / Kagustuhan sa serbisyo</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.useInfo")}</h2>
          <p className="text-muted-foreground">{t("legal.useInfoDesc")}</p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Confirm and manage appointments / Kumpirmahin at pamahalaan ang appointments</li>
            <li>Send appointment reminders / Magpadala ng paalala</li>
            <li>Contact you about your booking / Kontakin ka tungkol sa iyong booking</li>
          </ul>
          <p className="text-muted-foreground mt-4">
            We do not share your information with third parties except for SMS delivery providers (Semaphore) and email providers (Resend).
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.retention")}</h2>
          <p className="text-muted-foreground">{t("legal.retentionDesc")}</p>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.consent")}</h2>
          <p className="text-muted-foreground">{t("legal.consentDesc")}</p>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.contact")}</h2>
          <p className="text-muted-foreground">{t("legal.contactDesc")}</p>
          <p className="text-foreground mt-2 font-medium">
            📞 {siteConfig.phone}
          </p>
        </div>
      </div>
    </main>
  );
}
