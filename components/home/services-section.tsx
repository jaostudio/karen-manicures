import { prisma } from "@/lib/db";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { getServerLocale, getTranslation } from "@/lib/server-i18n";

const serviceIcons = ["💅", "💎", "🦶", "✨"];

interface Svc { id: string; name: string; description: string | null; duration: number; price: number; sortOrder: number; }

export async function ServicesSection() {
  const services: Svc[] = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const locale = await getServerLocale();

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-pink-800 mb-4">
            {getTranslation(locale, "services.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-md mx-auto">
            {getTranslation(locale, "services.subtitle")}
          </p>
        </FadeIn>

        {services.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {getTranslation(locale, "services.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {services.map((service, i) => (
              <FadeIn key={service.id} delay={i * 80}>
                <div className="group rounded-xl border border-pink-100 bg-white p-6 hover:shadow-lg hover:border-pink-200 transition-all duration-200 flex flex-col h-full">
                  <div className="text-3xl mb-4 leading-none transition-transform duration-200 group-hover:scale-110">
                    {serviceIcons[i % serviceIcons.length]}
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {service.duration} {getTranslation(locale, "services.min")}
                  </p>
                  {service.description && (
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                      {service.description}
                    </p>
                  )}
                  <div className="mt-auto">
                    <p className="font-bold text-pink-600 text-xl mb-4 transition-colors duration-200 group-hover:text-pink-700">
                      ₱{service.price.toFixed(2)}
                    </p>
                    <Link
                      href={`/book?service=${service.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 active:scale-[0.97] h-10 px-4 w-full transition-all duration-200"
                    >
                      {getTranslation(locale, "services.bookNow")}
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
