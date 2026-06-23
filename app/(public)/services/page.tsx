import { prisma } from "@/lib/db";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getServerLocale, getTranslation } from "@/lib/server-i18n";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const locale = await getServerLocale();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-center text-pink-800 mb-2">
          {getTranslation(locale, "services.pageTitle")}
        </h1>
        <p className="text-center text-muted-foreground mb-10 max-w-md mx-auto">
          {getTranslation(locale, "services.pageSubtitle")}
        </p>

        {services.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {getTranslation(locale, "services.empty")}
          </p>
        ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {services.map((service) => (
            <Card key={service.id} className="border-pink-100 ring-0">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4 leading-none">💅</div>
                <h2 className="font-heading font-semibold text-xl mb-2">
                  {service.name}
                </h2>
                <p className="text-muted-foreground mb-1">
                  {service.duration} {getTranslation(locale, "services.minutes")}
                </p>
                {service.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {service.description}
                  </p>
                )}
                <p className="font-bold text-2xl text-pink-600 mb-4">
                  ₱{service.price.toFixed(2)}
                </p>
                <Link
                  href={`/book?service=${service.id}`}
                  className="inline-flex items-center justify-center rounded-full bg-pink-600 text-primary-foreground text-sm font-medium hover:bg-pink-700 px-2.5 py-1.5 h-9 w-full"
                >
                  {getTranslation(locale, "services.bookNow")}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href={siteConfig.messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background text-sm font-medium hover:bg-muted px-2.5 py-1.5 h-9"
          >
            {getTranslation(locale, "services.orViaMessenger")}
          </a>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
