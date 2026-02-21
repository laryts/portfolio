import { MetadataRoute } from 'next'
import { locales } from '@/proxy'
import { normalizeUrl } from '@/lib/utils'
import { getBlogSlugsByLang } from '@/lib/sanity/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL)

  const routes = locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(locales.map((loc) => [loc, `${siteUrl}/${loc}`])),
    },
  }))

  const blogRoutes = locales.map((locale) => ({
    url: `${siteUrl}/${locale}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: Object.fromEntries(locales.map((loc) => [loc, `${siteUrl}/${loc}/blog`])),
    },
  }))

  const blogPostRoutes: MetadataRoute.Sitemap = []
  try {
    for (const locale of locales) {
      const slugs = await getBlogSlugsByLang(locale as 'en' | 'pt')
      for (const slug of slugs) {
        blogPostRoutes.push({
          url: `${siteUrl}/${locale}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(
              locales.map((loc) => [loc, `${siteUrl}/${loc}/blog/${slug}`])
            ),
          },
        })
      }
    }
  } catch {
    // Sanity API may be unreachable at build time; sitemap still works without blog posts
  }

  return [...routes, ...blogRoutes, ...blogPostRoutes]
}

