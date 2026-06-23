"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}

function getSnapshot() {
  return localStorage.getItem("cookie-consent");
}

function getServerSnapshot() {
  return null;
}

export function CookieBanner() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const accept = useCallback(() => {
    localStorage.setItem("cookie-consent", "accepted");
    window.dispatchEvent(new StorageEvent("storage", { key: "cookie-consent", newValue: "accepted" }));
  }, []);

  if (consent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-lg p-4 animate-slide-up">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          We use cookies to improve your experience. By using our site, you agree to our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-pink-600 transition-colors">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex gap-2 shrink-0">
          <Link
            href="/privacy"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background text-xs font-medium hover:bg-muted h-9 px-4 transition-all duration-200"
          >
            Learn more
          </Link>
          <button
            onClick={accept}
            className="inline-flex items-center justify-center rounded-full bg-pink-600 text-white text-xs font-medium hover:bg-pink-700 active:scale-[0.97] h-9 px-4 transition-all duration-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
