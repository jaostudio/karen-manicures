import { cookies } from "next/headers";
import type { Locale } from "./i18n";

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const stored = cookieStore.get("locale")?.value;
  if (stored === "en" || stored === "tl") return stored;
  return "en";
}

export { getTranslation } from "./i18n";
