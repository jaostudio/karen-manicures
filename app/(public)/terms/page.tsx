import { getServerLocale } from "@/lib/server-i18n";
import { getTranslation } from "@/lib/i18n";
import { siteConfig } from "@/config/site";

export default async function TermsPage() {
  const locale = await getServerLocale();
  const t = (key: string) => getTranslation(locale, key);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading text-foreground">
          {t("legal.terms")}
        </h1>
        <div className="w-12 h-1 bg-pink-600 rounded mx-auto mt-4" />
        <p className="text-muted-foreground mt-4">
          {t("legal.lastUpdated")}: June 2026
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.bookingConfirm")}</h2>
          <p className="text-muted-foreground">{t("legal.bookingConfirmDesc")}</p>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.cancellation")}</h2>
          <p className="text-muted-foreground">{t("legal.cancellationDesc")}</p>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.noShow")}</h2>
          <p className="text-muted-foreground">{t("legal.noShowDesc")}</p>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.payment")}</h2>
          <p className="text-muted-foreground">{t("legal.paymentDesc")}</p>
        </div>

        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-heading mb-3">{t("legal.contact")}</h2>
          <p className="text-muted-foreground">
            For any questions or concerns, please contact Karen:
          </p>
          <p className="text-foreground mt-2 font-medium">
            📞 {siteConfig.phone}
          </p>
        </div>
      </div>
    </main>
  );
}
