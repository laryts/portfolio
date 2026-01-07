import Link from "next/link"
import { getDictionary } from "@/dictionaries"
import type { Locale } from "@/types/i18n"
import type { Metadata } from "next"
import { BlogPostCard } from "@/components/blog-post-card"
import { ArrowLeft } from "lucide-react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://larissasoares.dev"
  
  const isEnglish = lang === "en"
  const title = isEnglish 
    ? "Blog | Larissa Soares"
    : "Blog | Larissa Soares"
  const description = isEnglish
    ? "Read articles about React, Next.js, React Native, and web development from Larissa Soares, a Senior Software Engineer."
    : "Leia artigos sobre React, Next.js, React Native e desenvolvimento web de Larissa Soares, Engenheira de Software Sênior."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}/blog`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/${lang}/blog`,
      languages: {
        en: `${siteUrl}/en/blog`,
        pt: `${siteUrl}/pt/blog`,
      },
    },
  }
}

export default async function BlogIndex({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  // Get all blog posts
  const blogPosts = Object.entries(dictionary.blog.posts).map(([slug, post]) => ({
    slug,
    ...post,
  }))

  return (
    <div className="min-h-screen bg-white dark:bg-dark-purple-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
        <Link
          href={`/${lang}`}
          className="inline-flex items-center text-deep-purple-900 dark:text-deep-purple-400 hover:text-deep-purple-800 dark:hover:text-deep-purple-300 transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">{dictionary.blog.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-3xl">{dictionary.blog.subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post: any, index: number) => (
            <BlogPostCard
              key={post.slug}
              title={post.title}
              date={post.date}
              summary={post.summary}
              tags={post.tags}
              slug={post.slug}
              readMoreText={dictionary.blog.readMore}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
