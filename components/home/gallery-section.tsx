import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { Sparkles } from "lucide-react";
import { getServerLocale, getTranslation } from "@/lib/server-i18n";

interface GalleryImg { id: string; url: string; altText: string | null; sortOrder: number; }

export async function GallerySection() {
  const images: GalleryImg[] = await prisma.galleryImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });

  const locale = await getServerLocale();

  if (images.length === 0) return null;

  return (
    <section className="py-16 bg-pink-50">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center text-pink-800 mb-4">
            {getTranslation(locale, "gallery.title")}
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-md mx-auto">
            {getTranslation(locale, "gallery.subtitle")}
          </p>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {images.map((img, i) => (
            <div
              key={img.id}
              className={`group relative aspect-square overflow-hidden rounded-xl ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || getTranslation(locale, "gallery.alt")}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <Sparkles className="size-5 text-white drop-shadow-lg" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/gallery"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background text-sm font-medium hover:bg-muted active:scale-[0.97] px-2.5 py-1.5 h-10 transition-all duration-200"
          >
            {getTranslation(locale, "gallery.viewFull")}
          </Link>
        </div>
      </div>
    </section>
  );
}
