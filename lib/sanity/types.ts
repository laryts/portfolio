/** Portable Text block (from Sanity); minimal type for typing body */
export type PortableTextBlock = {
  _type: string
  _key?: string
  children?: Array<{ _type: string; _key: string; text?: string; marks?: string[] }>
  markDefs?: unknown[]
  level?: number
  listItem?: string
  style?: string
  [key: string]: unknown
}

export interface SanityImageAsset {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

/** Full post as returned by getBlogPostBySlug (slug projected as string) */
export interface SanityBlogPost {
  _id: string
  _type: 'post'
  title: string
  slug: string
  summary: string
  body: PortableTextBlock[] | null
  mainImage: SanityImageAsset | null
  tags: string[]
  language: 'pt' | 'en'
  publishedAt: string | null
  featured?: boolean
}

export interface BlogPostListItem
  extends Pick<SanityBlogPost, 'title' | 'summary' | 'tags' | 'language' | 'publishedAt' | 'featured'> {
  slug: string
}
