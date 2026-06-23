import { prisma } from "@/lib/db";
import { BookingWizard } from "@/components/booking/booking-wizard";

export default async function BookPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="min-h-[80vh] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-lg">
        <BookingWizard services={services} />
      </div>
    </div>
  );
}
