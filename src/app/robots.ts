import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.startsWith("http")
    ? siteConfig.url
    : `https://${siteConfig.url}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/category", "/play/"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
