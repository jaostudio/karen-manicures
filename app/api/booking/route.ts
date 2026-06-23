import { NextRequest, NextResponse } from "next/server";
import { generateTimeSlots } from "@/lib/date-utils";
import { siteConfig } from "@/config/site";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const dateStr = searchParams.get("date");
  const duration = parseInt(searchParams.get("duration") || "30");

  if (!dateStr) {
    return NextResponse.json({ slots: [] });
  }

  const date = new Date(dateStr + "T00:00:00+08:00");

  try {
    const slots = await generateTimeSlots(date, duration, siteConfig.openDays);
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("Time slot generation error:", err);
    return NextResponse.json({ slots: [] });
  }
}
