const site =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export default function sitemap() {
  const now = new Date();
  return ["", "/read", "/write", "/about"].map((path) => ({
    url: `${site}${path}`,
    lastModified: now,
    changeFrequency: path === "/read" ? "hourly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
