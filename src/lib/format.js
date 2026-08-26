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

export const numbers = new Intl.NumberFormat("en-US");
