const requiredProdVars = [
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "IRON_SESSION_PASSWORD",
  "CRON_SECRET",
  "NEXT_PUBLIC_SITE_URL",
] as const;

const optionalProdVars = [
  "SEMAPHORE_API_KEY",
  "SEMAPHORE_SENDER",
  "RESEND_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
  "BLOB_READ_WRITE_TOKEN",
  "SENTRY_DSN",
  "SENTRY_ORG",
  "SENTRY_PROJECT",
  "SENTRY_AUTH_TOKEN",
] as const;
void optionalProdVars;

export function validateEnv() {
  if (process.env.NODE_ENV !== "production") return;

  const isTurso = Boolean(process.env.TURSO_DATABASE_URL);
  if (!isTurso) return;

  const missing: string[] = [];
  for (const key of requiredProdVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    console.warn(
      `[env] Missing required environment variables:\n  ${missing.join("\n  ")}`
    );
  }
}
