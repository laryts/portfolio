import { client, urlFor } from '@/sanity/client'
import {
  blogPostsByLangQuery,
  blogPostBySlugQuery,
  featuredBlogPostsQuery,
  blogSlugsByLangQuery,
} from '@/lib/sanity/queries'
import type { SanityBlogPost, BlogPostListItem, SanityImageAsset } from '@/lib/sanity/types'

function mapPostToListItem(post: {
  _id: string
  title: string
  slug: string
  summary: string
  tags: string[]
  language: string
  publishedAt: string | null
  _createdAt?: string | null
  featured?: boolean
  mainImage?: SanityImageAsset | null
}): BlogPostListItem {
  return {
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    tags: post.tags ?? [],
    language: post.language as 'pt' | 'en',
    publishedAt: post.publishedAt ?? null,
    featured: post.featured ?? false,
    createdAt: post._createdAt ?? null,
    imageUrl:
      post.mainImage != null
        ? urlFor(post.mainImage).width(600).height(340).fit('max').url()
        : null,
  }
}

export async function getBlogPosts(lang: 'pt' | 'en'): Promise<BlogPostListItem[]> {
  const posts = await client.fetch<Parameters<typeof mapPostToListItem>[0][]>(blogPostsByLangQuery, {
    lang,
  })
  return (posts ?? []).map(mapPostToListItem)
}

export async function getBlogPostBySlug(
  slug: string,
  lang: 'pt' | 'en'
): Promise<SanityBlogPost | null> {
  const post = await client.fetch<SanityBlogPost | null>(blogPostBySlugQuery, { slug, lang })
  return post ?? null
}

export async function getFeaturedBlogPosts(
  lang: 'pt' | 'en',
  limit: number = 3
): Promise<BlogPostListItem[]> {
  const posts = await client.fetch<Parameters<typeof mapPostToListItem>[0][]>(
    featuredBlogPostsQuery,
    { lang, limit }
  )
  return (posts ?? []).map(mapPostToListItem)
}

/** All slugs for a language (for generateStaticParams / sitemap) */
export async function getBlogSlugsByLang(lang: 'pt' | 'en'): Promise<string[]> {
  const slugs = await client.fetch<string[]>(blogSlugsByLangQuery, { lang })
  return slugs ?? []
}
