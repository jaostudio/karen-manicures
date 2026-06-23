import { prisma } from "@/lib/db";
import Image from "next/image";
import { getServerLocale, getTranslation } from "@/lib/server-i18n";

interface GalleryImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
}

export default async function GalleryPage() {
  const images: GalleryImage[] = await prisma.galleryImage.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const locale = await getServerLocale();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl font-bold text-center text-pink-800 mb-2">
          {getTranslation(locale, "gallery.pageTitle")}
        </h1>
        <p className="text-center text-muted-foreground mb-10 max-w-md mx-auto">
          {getTranslation(locale, "gallery.pageSubtitle")}
        </p>

        {images.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {getTranslation(locale, "gallery.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={img.url}
                  alt={img.altText || getTranslation(locale, "gallery.altFallback")}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
