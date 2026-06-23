import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminSettings } from "@/components/admin/admin-settings";

export default async function SettingsPage() {
  await requireAdmin();

  const [hoursSetting, thresholdSetting, noticeSetting, blockedSetting] =
    await Promise.all([
      prisma.setting.findUnique({ where: { key: "business_hours" } }),
      prisma.setting.findUnique({ where: { key: "same_day_threshold" } }),
      prisma.setting.findUnique({ where: { key: "min_notice" } }),
      prisma.setting.findUnique({ where: { key: "blocked_dates" } }),
    ]);

  const hours = hoursSetting?.value
    ? JSON.parse(hoursSetting.value)
    : { mon_sat: { open: "09:00", close: "18:00" } };

  return (
    <AdminSettings
      initial={{
        business_hours_open: hours.mon_sat?.open || "09:00",
        business_hours_close: hours.mon_sat?.close || "18:00",
        same_day_threshold: thresholdSetting?.value || "180",
        min_notice: noticeSetting?.value || "180",
        blocked_dates: blockedSetting?.value || "[]",
      }}
    />
  );
}
