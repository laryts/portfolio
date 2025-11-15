import { MetadataRoute } from "next"
import { normalizeUrl } from "@/lib/utils"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL)

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/studio/", "/_next/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

