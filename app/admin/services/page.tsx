import { prisma } from "@/lib/db";
import { AdminServices } from "@/components/admin/admin-services";
import { requireAdmin } from "@/lib/auth";

export default async function ServicesAdminPage() {
  await requireAdmin();

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <AdminServices services={services} />
    </div>
  );
}
