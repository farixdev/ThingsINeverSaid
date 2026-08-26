import { siteUrl } from "@/lib/site";

export default function sitemap() {
  const now = new Date();
  return ["", "/read", "/write", "/about"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/read" ? "hourly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
