"use client";

import { createContext, useContext, useCallback, useSyncExternalStore, type ReactNode } from "react";
import type { Locale } from "./i18n";
import { getTranslation } from "./i18n";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getLocaleSnapshot(): Locale {
  const stored = localStorage.getItem("locale") as Locale | null;
  if (stored === "en" || stored === "tl") return stored;
  return "en";
}

function getServerLocaleSnapshot(): Locale {
  return "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getLocaleSnapshot, getServerLocaleSnapshot);

  const setLocale = useCallback((newLocale: Locale) => {
    localStorage.setItem("locale", newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
    window.dispatchEvent(new StorageEvent("storage", { key: "locale", newValue: newLocale }));
  }, []);

  const t = useCallback((key: string) => getTranslation(locale, key), [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within a LocaleProvider");
  return context;
}
