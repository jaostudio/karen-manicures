import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminGallery } from "@/components/admin/admin-gallery";

export default async function GalleryAdminPage() {
  await requireAdmin();

  const images = await prisma.galleryImage.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <AdminGallery images={images} />
    </div>
  );
}
