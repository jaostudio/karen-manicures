import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();

    for (const [key, value] of Object.entries(data)) {
      if (!value || typeof value !== "string") continue;

      let settingKey = key;

      if (key === "business_hours_open" || key === "business_hours_close") {
        continue;
      }
      if (key === "same_day_threshold") {
        settingKey = "same_day_threshold";
      } else if (key === "min_notice") {
        settingKey = "min_notice";
      } else if (key === "blocked_dates") {
        settingKey = "blocked_dates";
      } else if (key.startsWith("_template_")) {
        settingKey = key.slice(1);
      } else {
        continue;
      }

      if (key === "business_hours_open" || key === "business_hours_close") {
        continue;
      }

      await prisma.setting.upsert({
        where: { key: settingKey },
        update: { value },
        create: { key: settingKey, value },
      });
    }

    if (data.business_hours_open && data.business_hours_close) {
      await prisma.setting.upsert({
        where: { key: "business_hours" },
        update: {
          value: JSON.stringify({
            mon_sat: { open: data.business_hours_open, close: data.business_hours_close },
          }),
        },
        create: {
          key: "business_hours",
          value: JSON.stringify({
            mon_sat: { open: data.business_hours_open, close: data.business_hours_close },
          }),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
