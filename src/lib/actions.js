"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { revalidateTag } from "next/cache";
import { insertConfession, recentWritesFor, WALL_TAG } from "./confessions";
import { isMood, DEFAULT_MOOD } from "./moods";

const MAX_TEXT = 4000;
const MIN_TEXT = 4;
const MAX_TITLE = 90;
const MAX_AUTHOR = 40;
const RATE_WINDOW_MIN = 10;
const RATE_MAX = 5;

function fail(message, field) {
  return { ok: false, message, field: field ?? null, id: null };
}

/**
 * One-way, salted hash of the writer's IP. Nothing reversible is stored — it
 * exists only so one person can't flood the wall.
 */
async function writerFingerprint() {
  const head = await headers();
  const ip =
    head.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    head.get("x-real-ip") ||
    head.get("cf-connecting-ip") ||
    "";
  if (!ip) return null;
  return createHash("sha256").update(`${process.env.IP_SALT ?? "tins"}:${ip}`).digest("hex");
}

export async function submitConfession(_prevState, formData) {
  // Bots fill every field they can see; humans never see this one.
  if (String(formData.get("website") ?? "").trim()) {
    return fail("Something went wrong. Please try again.");
  }

  const text = String(formData.get("text") ?? "").replace(/\r\n/g, "\n").trim();
  const rawTitle = String(formData.get("title") ?? "").trim();
  const rawAuthor = String(formData.get("author") ?? "").trim();
  const rawMood = String(formData.get("mood") ?? DEFAULT_MOOD).trim();

  if (text.length < MIN_TEXT) {
    return fail("There's nothing here yet. Write the part you never said.", "text");
  }
  if (text.length > MAX_TEXT) {
    return fail(`That's ${text.length} characters — the wall holds ${MAX_TEXT}.`, "text");
  }
  if (rawTitle.length > MAX_TITLE) {
    return fail("That title is a little long for a note.", "title");
  }
  if (rawAuthor.length > MAX_AUTHOR) {
    return fail("That signature is a little long for a note.", "author");
  }

  const mood = isMood(rawMood) ? rawMood : DEFAULT_MOOD;
  const title = rawTitle || firstLineOf(text);
  const author = rawAuthor || "Anonymous";

  let ipHash = null;
  try {
    ipHash = await writerFingerprint();
    if (ipHash && (await recentWritesFor(ipHash, RATE_WINDOW_MIN)) >= RATE_MAX) {
      return fail("You've pinned a few already. Give the wall a moment to breathe.");
    }
  } catch {
    // Rate limiting is a courtesy, never a gate — if the check fails, let it through.
  }

  try {
    const note = await insertConfession({ title, text, author, mood, ipHash });
    revalidateTag(WALL_TAG);
    return { ok: true, message: "It's on the wall.", field: null, id: note.id };
  } catch (error) {
    console.error("submitConfession failed:", error);
    return fail("The wall didn't take it. Try once more in a moment.");
  }
}

function firstLineOf(text) {
  const line = text.split("\n").find((l) => l.trim().length > 0) ?? text;
  const clean = line.trim().replace(/\s+/g, " ");
  if (clean.length <= 52) return clean;
  const cut = clean.slice(0, 52);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 24 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
