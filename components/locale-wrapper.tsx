"use client";

import { LocaleProvider } from "@/lib/locale-context";
import type { ReactNode } from "react";

export function LocaleWrapper({ children }: { children: ReactNode }) {
  return <LocaleProvider>{children}</LocaleProvider>;
}
