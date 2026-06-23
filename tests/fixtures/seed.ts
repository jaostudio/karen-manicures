import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./admin-user";

let prisma: PrismaClient;

function getDb() {
  if (!prisma) {
    const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || "file:./prisma/dev.db" });
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

export async function seedTestDb() {
  const db = getDb();

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: "Karen", password: hashed },
    create: { email: ADMIN_EMAIL, name: "Karen", password: hashed },
  });

  const services = [
    { name: "Classic Manicure", duration: 30, price: 150, sortOrder: 1 },
    { name: "Gel Manicure", duration: 45, price: 250, sortOrder: 2 },
  ];

  for (const svc of services) {
    const existing = await db.service.findFirst({ where: { name: svc.name } });
    if (!existing) {
      await db.service.create({ data: svc });
    }
  }

  await db.setting.upsert({
    where: { key: "business_hours" },
    update: { value: JSON.stringify({ mon_sat: { open: "09:00", close: "18:00" } }) },
    create: { key: "business_hours", value: JSON.stringify({ mon_sat: { open: "09:00", close: "18:00" } }) },
  });

  await db.setting.upsert({
    where: { key: "same_day_threshold" },
    update: { value: "180" },
    create: { key: "same_day_threshold", value: "180" },
  });

  await db.setting.upsert({
    where: { key: "min_notice" },
    update: { value: "180" },
    create: { key: "min_notice", value: "180" },
  });

  await db.setting.upsert({
    where: { key: "blocked_dates" },
    update: { value: "[]" },
    create: { key: "blocked_dates", value: "[]" },
  });
}

export async function createPendingBooking() {
  const db = getDb();
  const service = await db.service.findFirst({ where: { name: "Classic Manicure" } });
  if (!service) throw new Error("No service found — run seedTestDb first");

  const startTime = new Date();
  startTime.setHours(10, 0, 0, 0);

  // Remove any existing booking + its notification logs so we start fresh
  const existing = await db.booking.findFirst({
    where: { customerName: "Test User Today", startTime },
  });
  if (existing) {
    await db.notificationLog.deleteMany({ where: { bookingId: existing.id } });
    await db.booking.delete({ where: { id: existing.id } });
  }

  return db.booking.create({
    data: {
      serviceId: service.id,
      customerName: "Test User Today",
      customerPhone: "09171234567",
      startTime,
      endTime: new Date(startTime.getTime() + service.duration * 60000),
      status: "pending",
    },
  });
}

export async function clearTestDb() {
  const db = getDb();
  await db.notificationLog.deleteMany();
  await db.booking.deleteMany();
  await db.galleryImage.deleteMany();
  await db.service.deleteMany();
  await db.setting.deleteMany();
  await db.user.deleteMany();
}

export async function disconnectDb() {
  if (prisma) {
    await prisma.$disconnect();
  }
}
