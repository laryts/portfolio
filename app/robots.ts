import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://larissasoares.dev"

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

