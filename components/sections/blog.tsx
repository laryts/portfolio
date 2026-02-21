import Link from 'next/link'
import { AnimateOnScroll } from '../animate-on-scroll'
import { BlogPostCard } from '../blog-post-card'
import type { BlogPostListItem } from '@/lib/sanity/types'

type BlogSectionProps = {
  dictionary: {
    blog: {
      title: string
      subtitle: string
      readMore: string
      viewAll: string
    }
  }
  lang: string
  posts: BlogPostListItem[]
}

export function BlogSection({ dictionary, lang, posts }: BlogSectionProps) {
  return (
    <section id="blog" className="py-20 px-4 md:px-8 max-w-6xl mx-auto">
      <AnimateOnScroll animation="fade" duration={0.8}>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{dictionary.blog.title}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          {dictionary.blog.subtitle}
        </p>
      </AnimateOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <AnimateOnScroll key={post.slug} animation="slide-up" duration={0.6} delay={0.1 * (index + 1)}>
            <BlogPostCard
              title={post.title}
              date={post.publishedAt ? formatPostDate(post.publishedAt, lang) : ''}
              summary={post.summary}
              tags={post.tags}
              slug={post.slug}
              readMoreText={dictionary.blog.readMore}
              lang={lang}
            />
          </AnimateOnScroll>
        ))}
      </div>

      <AnimateOnScroll animation="fade" duration={0.6} delay={0.5}>
        <div className="mt-12 text-center">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-deep-purple-900 text-white font-medium hover:bg-deep-purple-800 transition-colors duration-300"
          >
            {dictionary.blog.viewAll}
          </Link>
        </div>
      </AnimateOnScroll>
    </section>
  )
}

function formatPostDate(isoDate: string, lang: string): string {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}
