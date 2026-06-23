import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { TemplatesList } from "@/components/admin/templates-list";

interface Setting { key: string; value: string | null; }

export default async function TemplatesPage() {
  await requireAdmin();

  const settings: Setting[] = await prisma.setting.findMany({
    where: { key: { startsWith: "template_" } },
  });

  const templates = [
    { key: "template_confirmation_sms", label: "Confirmation SMS", default: "Hi {name}, your {service} on {date} at {time} is confirmed! – Karen Manicures" },
    { key: "template_reminder_24h_sms", label: "24h Reminder SMS", default: "Reminder: {service} tomorrow at {time}. See you! – Karen Manicures" },
    { key: "template_reminder_2h_sms", label: "2h Reminder SMS", default: "Reminder: {service} at {time} today. We're ready for you! – Karen Manicures" },
    { key: "template_cancelled_sms", label: "Cancellation SMS", default: "Hi {name}, your booking for {service} on {date} at {time} has been cancelled. – Karen Manicures" },
    { key: "template_status_change_sms", label: "Status Change SMS", default: "Hi {name}, your {service} booking status has been updated to: {status}. – Karen Manicures" },
  ];

  const templateValues = templates.map((t) => ({
    ...t,
    value: settings.find((s) => s.key === t.key)?.value || t.default,
  }));

  return <TemplatesList templates={templateValues} />;
}
