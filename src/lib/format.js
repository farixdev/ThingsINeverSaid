const monthYear = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "March 2026". Pinned to UTC so the server and the browser agree. */
export function formatWhen(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : monthYear.format(date);
}

const DAY = 86400000;
const startOfDay = (date) =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

/**
 * "today", "yesterday", "4 days ago" — day-granularity on purpose. The pages
 * that use it are cached for five minutes, and a bucket this coarse can't go
 * stale inside that window.
 */
export function since(iso) {
  if (!iso) return "";
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";

  const days = Math.round((startOfDay(new Date()) - startOfDay(then)) / DAY);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 31) return `${Math.round(days / 7)} weeks ago`;
  return `in ${monthYear.format(then)}`;
}
