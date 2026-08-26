import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing. Copy .env.example to .env.local and paste your Neon connection string."
  );
}

/** Tagged-template SQL client for Neon (HTTP, serverless-friendly). */
export const sql = neon(process.env.DATABASE_URL);

const SCHEMA_KEY = Symbol.for("tins.schema.ready");

async function bootstrap() {
  await sql`
    CREATE TABLE IF NOT EXISTS confessions (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(255),
      text        TEXT NOT NULL,
      author      VARCHAR(100) NOT NULL DEFAULT 'Anonymous',
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  // Additive migrations — safe to re-run, and safe against the original TypeORM table.
  await sql`ALTER TABLE confessions ADD COLUMN IF NOT EXISTS mood VARCHAR(16) NOT NULL DEFAULT 'unspoken'`;
  await sql`ALTER TABLE confessions ADD COLUMN IF NOT EXISTS ip_hash CHAR(64)`;
  // Added with a default of 'approved' so anything written before moderation
  // existed stays on the wall; new confessions come in as 'pending'.
  await sql`ALTER TABLE confessions ADD COLUMN IF NOT EXISTS status VARCHAR(12) NOT NULL DEFAULT 'approved'`;
  await sql`ALTER TABLE confessions ALTER COLUMN status SET DEFAULT 'pending'`;
  await sql`ALTER TABLE confessions ALTER COLUMN title DROP NOT NULL`;
  await sql`CREATE INDEX IF NOT EXISTS confessions_created_idx ON confessions ("createdAt" DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS confessions_rate_idx ON confessions (ip_hash, "createdAt" DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS confessions_status_idx ON confessions (status, "createdAt" DESC)`;
}

/**
 * Creates the table on first use and never again for the life of the instance.
 * Kept on globalThis so dev-server hot reloads don't re-run the migration.
 */
export function ensureSchema() {
  if (!globalThis[SCHEMA_KEY]) {
    globalThis[SCHEMA_KEY] = bootstrap().catch((error) => {
      globalThis[SCHEMA_KEY] = undefined;
      throw error;
    });
  }
  return globalThis[SCHEMA_KEY];
}
