import { unstable_cache } from "next/cache";
import { sql, ensureSchema } from "./db";

export const WALL_TAG = "wall";
export const WALL_LIMIT = 240;

/** How much of a confession the wall shows before you open it. */
const PREVIEW_CHARS = 220;

function toNote(row) {
  const text = row.text ?? "";
  return {
    id: row.id,
    title: row.title || "Untitled",
    text,
    preview: text.length > PREVIEW_CHARS ? `${text.slice(0, PREVIEW_CHARS).trimEnd()}…` : text,
    truncated: text.length > PREVIEW_CHARS,
    author: row.author || "Anonymous",
    mood: row.mood || "unspoken",
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

/**
 * The wall payload. Cached in the Next data cache and invalidated by tag the
 * moment somebody pins a new confession, so reads are free until the wall
 * actually changes.
 */
export const getWall = unstable_cache(
  async () => {
    await ensureSchema();
    const rows = await sql`
      SELECT id, title, text, author, mood, "createdAt"
      FROM confessions
      ORDER BY "createdAt" DESC
      LIMIT ${WALL_LIMIT}
    `;
    return rows.map(toNote);
  },
  ["wall", `v1:${WALL_LIMIT}`],
  { revalidate: 300, tags: [WALL_TAG] }
);

export const getStats = unstable_cache(
  async () => {
    await ensureSchema();
    const [row] = await sql`
      SELECT COUNT(*)::int AS total, MAX("createdAt") AS latest FROM confessions
    `;
    return {
      total: row?.total ?? 0,
      latest: row?.latest ? new Date(row.latest).toISOString() : null,
    };
  },
  ["wall-stats", "v1"],
  { revalidate: 300, tags: [WALL_TAG] }
);

/** Paginated + searchable feed behind /api/confessions. */
export async function listConfessions({ limit = 24, offset = 0, search = "" } = {}) {
  await ensureSchema();
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const term = String(search || "").trim();

  const rows = term
    ? await sql`
        SELECT id, title, text, author, mood, "createdAt", COUNT(*) OVER()::int AS total
        FROM confessions
        WHERE title ILIKE ${"%" + term + "%"}
           OR text  ILIKE ${"%" + term + "%"}
           OR author ILIKE ${"%" + term + "%"}
        ORDER BY "createdAt" DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `
    : await sql`
        SELECT id, title, text, author, mood, "createdAt", COUNT(*) OVER()::int AS total
        FROM confessions
        ORDER BY "createdAt" DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;

  const total = rows[0]?.total ?? 0;
  return {
    data: rows.map(toNote),
    total,
    limit: safeLimit,
    offset: safeOffset,
    hasMore: safeOffset + rows.length < total,
  };
}

export async function getConfession(id) {
  await ensureSchema();
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric < 1) return null;
  const [row] = await sql`
    SELECT id, title, text, author, mood, "createdAt" FROM confessions WHERE id = ${numeric}
  `;
  return row ? toNote(row) : null;
}

export async function insertConfession({ title, text, author, mood, ipHash }) {
  await ensureSchema();
  const [row] = await sql`
    INSERT INTO confessions (title, text, author, mood, ip_hash)
    VALUES (${title}, ${text}, ${author}, ${mood}, ${ipHash})
    RETURNING id, title, text, author, mood, "createdAt"
  `;
  return toNote(row);
}

/** How many notes this (hashed) writer has pinned inside the window. */
export async function recentWritesFor(ipHash, minutes = 10) {
  if (!ipHash) return 0;
  await ensureSchema();
  const [row] = await sql`
    SELECT COUNT(*)::int AS n
    FROM confessions
    WHERE ip_hash = ${ipHash}
      AND "createdAt" > now() - (${minutes} * INTERVAL '1 minute')
  `;
  return row?.n ?? 0;
}
