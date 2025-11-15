import { MetadataRoute } from "next"
import { locales } from "@/proxy"
// import { getDictionary } from "@/dictionaries"
import { normalizeUrl } from "@/lib/utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL)
  
  // Base routes for each locale
  const routes = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}`])
      ),
    },
  }))

  // // Blog index pages
  // const blogRoutes = locales.map((locale) => ({
  //   url: `${siteUrl}/${locale}/blog`,
  //   lastModified: new Date(),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.8,
  //   alternates: {
  //     languages: Object.fromEntries(
  //       locales.map((loc) => [loc, `${siteUrl}/${loc}/blog`])
  //     ),
  //   },
  // }))

  // // Blog post pages
  // const blogPostRoutes: MetadataRoute.Sitemap = []
  
  // for (const locale of locales) {
  //   const dictionary = await getDictionary(locale as "en" | "pt")
  //   const posts = Object.keys(dictionary.blog.posts)
    
  //   for (const slug of posts) {
  //     blogPostRoutes.push({
  //       url: `${siteUrl}/${locale}/blog/${slug}`,
  //       lastModified: new Date(),
  //       changeFrequency: "monthly" as const,
  //       priority: 0.7,
  //       alternates: {
  //         languages: Object.fromEntries(
  //           locales.map((loc) => [loc, `${siteUrl}/${loc}/blog/${slug}`])
  //         ),
  //       },
  //     })
  //   }
  // }

  return [...routes]
}

