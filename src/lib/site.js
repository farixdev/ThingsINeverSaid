const FALLBACK = "http://localhost:3000";

/**
 * Turns whatever is in the environment into a usable origin, or null.
 *
 * Deliberately strict: a value like "NEXT_PUBLIC_SITE_URL" or "my-site" would
 * technically parse as a URL once a protocol is bolted on, and silently poison
 * every canonical link and sitemap entry. Better to ignore it and fall back.
 */
function toOrigin(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const host = url.hostname;
  if (host !== "localhost" && !host.includes(".")) return null;

  return url.origin;
}

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const fromConfig = toOrigin(configured);
  if (fromConfig) return fromConfig;

  if (configured && String(configured).trim()) {
    console.warn(
      `NEXT_PUBLIC_SITE_URL is set to "${configured}", which is not a URL. Ignoring it.`
    );
  }

  // Vercel provides these on its own, so the variable is optional there.
  return (
    toOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    toOrigin(process.env.VERCEL_URL) ??
    FALLBACK
  );
}

export const siteUrl = resolveSiteUrl();
