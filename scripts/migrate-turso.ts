import { createClient } from "@libsql/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const migrationsDir = join(import.meta.dirname!, "..", "prisma", "migrations");
const migrations = readdirSync(migrationsDir)
  .filter((f) => f.match(/^\d/))
  .sort();

async function main() {
  for (const m of migrations) {
    const sql = readFileSync(join(migrationsDir, m, "migration.sql"), "utf-8");
    console.log(`Applying ${m}...`);
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      await db.execute(stmt + ";");
    }
    console.log(`  Done (${statements.length} statements).`);
  }
  console.log("All migrations applied.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
