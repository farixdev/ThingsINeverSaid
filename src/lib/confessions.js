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
    status: row.status || "approved",
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt),
  };
}

/**
 * The wall payload — approved confessions only. Cached in the Next data cache
 * and invalidated by tag the moment the wall actually changes, so reads are
 * free in between.
 */
export const getWall = unstable_cache(
  async () => {
    await ensureSchema();
    const rows = await sql`
      SELECT id, title, text, author, mood, status, "createdAt"
      FROM confessions
      WHERE status = 'approved'
      ORDER BY "createdAt" DESC, id DESC
      LIMIT ${WALL_LIMIT}
    `;
    return rows.map(toNote);
  },
  ["wall", `v2:${WALL_LIMIT}`],
  { revalidate: 300, tags: [WALL_TAG] }
);

/** Paginated + searchable feed behind /api/confessions. Approved only. */
export async function listConfessions({ limit = 24, offset = 0, search = "" } = {}) {
  await ensureSchema();
  const safeLimit = Math.min(Math.max(Number(limit) || 24, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const term = String(search || "").trim();

  const rows = term
    ? await sql`
        SELECT id, title, text, author, mood, status, "createdAt", COUNT(*) OVER()::int AS total
        FROM confessions
        WHERE status = 'approved'
          AND (title ILIKE ${"%" + term + "%"}
            OR text  ILIKE ${"%" + term + "%"}
            OR author ILIKE ${"%" + term + "%"})
        ORDER BY "createdAt" DESC, id DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `
    : await sql`
        SELECT id, title, text, author, mood, status, "createdAt", COUNT(*) OVER()::int AS total
        FROM confessions
        WHERE status = 'approved'
        ORDER BY "createdAt" DESC, id DESC
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
    SELECT id, title, text, author, mood, status, "createdAt"
    FROM confessions
    WHERE id = ${numeric} AND status = 'approved'
  `;
  return row ? toNote(row) : null;
}

export async function insertConfession({ title, text, author, mood, ipHash }) {
  await ensureSchema();
  const [row] = await sql`
    INSERT INTO confessions (title, text, author, mood, ip_hash, status)
    VALUES (${title}, ${text}, ${author}, ${mood}, ${ipHash}, 'pending')
    RETURNING id, title, text, author, mood, status, "createdAt"
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

/* ────────────────────────────── the desk ──────────────────────────────────
   Everything below is admin-only and deliberately uncached: the desk must
   always show the real state of the database, never a five-minute-old copy.
   ------------------------------------------------------------------------ */

export const DESK_PAGE = 18;

/**
 * One page of the desk. Returns the total alongside the rows so the client
 * knows whether to keep asking for more as it scrolls.
 */
export async function pageForDesk({ status, search = "", limit = DESK_PAGE, offset = 0 } = {}) {
  await ensureSchema();
  const wanted = status === "approved" ? "approved" : "pending";
  const safeLimit = Math.min(Math.max(Number(limit) || DESK_PAGE, 1), 60);
  const safeOffset = Math.max(Number(offset) || 0, 0);
  const term = String(search || "").trim();

  const rows = term
    ? await sql`
        SELECT id, title, text, author, mood, status, "createdAt", COUNT(*) OVER()::int AS total
        FROM confessions
        WHERE status = ${wanted}
          AND (title ILIKE ${"%" + term + "%"}
            OR text  ILIKE ${"%" + term + "%"}
            OR author ILIKE ${"%" + term + "%"})
        ORDER BY "createdAt" DESC, id DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `
    : await sql`
        SELECT id, title, text, author, mood, status, "createdAt", COUNT(*) OVER()::int AS total
        FROM confessions
        WHERE status = ${wanted}
        ORDER BY "createdAt" DESC, id DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `;

  const total = rows[0]?.total ?? 0;
  return {
    data: rows.map(toNote),
    total,
    hasMore: safeOffset + rows.length < total,
  };
}

/**
 * Counts plus the highest id, which together change whenever anything on the
 * desk changes. The admin page polls this to know when to pull fresh data.
 * Counts are never filtered by a search — the tabs show the real backlog.
 */
export async function deskPulse() {
  await ensureSchema();
  const [row] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pending')::int  AS pending,
      COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
      COALESCE(MAX(id), 0)::int                        AS latest
    FROM confessions
  `;
  return {
    pending: row?.pending ?? 0,
    approved: row?.approved ?? 0,
    latest: row?.latest ?? 0,
  };
}

export async function setConfessionStatus(id, status) {
  await ensureSchema();
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric < 1) return null;
  if (status !== "approved" && status !== "pending") return null;
  const [row] = await sql`
    UPDATE confessions SET status = ${status} WHERE id = ${numeric}
    RETURNING id, title, text, author, mood, status, "createdAt"
  `;
  return row ? toNote(row) : null;
}

export async function deleteConfession(id) {
  await ensureSchema();
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric < 1) return false;
  const rows = await sql`DELETE FROM confessions WHERE id = ${numeric} RETURNING id`;
  return rows.length > 0;
}
