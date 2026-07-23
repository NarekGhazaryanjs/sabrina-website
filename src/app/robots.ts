import type { MetadataRoute } from "next";

const siteUrl = process.env.SITE_URL || "https://example.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin", "/api/auth"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
