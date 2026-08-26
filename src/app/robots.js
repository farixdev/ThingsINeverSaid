import { siteUrl } from "@/lib/site";

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
