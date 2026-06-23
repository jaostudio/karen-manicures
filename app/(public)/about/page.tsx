import { getServerLocale, getTranslation } from "@/lib/server-i18n";

export default async function AboutPage() {
  const locale = await getServerLocale();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-heading text-4xl font-bold text-center text-pink-800 mb-8">
          {getTranslation(locale, "about.pageTitle")}
        </h1>

        <div className="prose prose-pink max-w-none space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {getTranslation(locale, "about.pagePara1")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {getTranslation(locale, "about.pagePara2")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {getTranslation(locale, "about.pagePara3")}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {getTranslation(locale, "about.pagePara4")}
          </p>
        </div>
      </div>
    </div>
  );
}
