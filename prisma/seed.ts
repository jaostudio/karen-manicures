import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const dbUrl = process.env.DATABASE_URL || "file:./prisma/dev.db";

  if (tursoUrl && tursoToken) {
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
    return new PrismaClient({ adapter });
  }

  const adapter = new PrismaBetterSqlite3({ url: dbUrl });
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

async function seed() {
  console.log("Seeding database...");

  const adminEmail = "karen@example.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashed = await bcrypt.hash("karen123", 12);
    await prisma.user.create({
      data: { email: adminEmail, name: "Karen", password: hashed },
    });
    console.log("Admin user created (email: karen@example.com, password: karen123)");
  }

  const services = [
    { name: "Classic Manicure", duration: 30, price: 150, sortOrder: 1 },
    { name: "Gel Manicure", duration: 45, price: 250, sortOrder: 2 },
    { name: "Classic Pedicure", duration: 40, price: 180, sortOrder: 3 },
    { name: "Gel Pedicure", duration: 55, price: 280, sortOrder: 4 },
  ];

  for (const svc of services) {
    const exists = await prisma.service.findFirst({ where: { name: svc.name } });
    if (!exists) {
      await prisma.service.create({ data: svc });
      console.log(`Service created: ${svc.name}`);
    }
  }

  const defaultSettings: Record<string, string> = {
    business_hours: JSON.stringify({
      mon_sat: { open: "09:00", close: "18:00" },
    }),
    same_day_threshold: "180",
    min_notice: "180",
    blocked_dates: "[]",
    template_confirmation_sms:
      "Hi {name}, your {service} on {date} at {time} is confirmed! – Karen Manicures",
    template_reminder_24h_sms:
      "Reminder: {service} tomorrow at {time}. See you! – Karen Manicures",
    template_reminder_2h_sms:
      "Reminder: {service} at {time} today. We're ready for you! – Karen Manicures",
    template_cancelled_sms:
      "Hi {name}, your booking for {service} on {date} at {time} has been cancelled. – Karen Manicures",
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    const exists = await prisma.setting.findUnique({ where: { key } });
    if (!exists) {
      await prisma.setting.create({ data: { key, value } });
      console.log(`Setting created: ${key}`);
    }
  }

  console.log("Seed complete.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
