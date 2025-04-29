import { getDictionary } from "@/dictionaries"
import type { Locale } from "@/types/i18n"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, ArrowLeft } from "lucide-react"
import { ReactPerformanceContent } from "@/lib/blog-content/en/react-performance"
import { DesignSystemsContent } from "@/lib/blog-content/en/design-systems"
import { MobileDevTipsContent } from "@/lib/blog-content/en/mobile-dev-tips"
// Import the SocialShareButtons component
import { SocialShareButtons } from "@/components/social-share-buttons"

// Import Portuguese content
import { ReactPerformanceContent as ReactPerformanceContentPT } from "@/lib/blog-content/pt/react-performance"

export default async function BlogPost({
  params: { lang, slug },
}: {
  params: { lang: Locale; slug: string }
}) {
  const dictionary = getDictionary(lang)

  // Get the blog post data based on the slug
  const postKey = Object.keys(dictionary.blog.posts).find((key) => key === slug)

  if (!postKey) {
    notFound()
  }

  const post = dictionary.blog.posts[postKey as keyof typeof dictionary.blog.posts]

  // Render the appropriate content based on slug and language
  const renderContent = () => {
    if (lang === "en") {
      switch (slug) {
        case "reactPerformance":
          return <ReactPerformanceContent />
        case "designSystems":
          return <DesignSystemsContent />
        case "mobileDevTips":
          return <MobileDevTipsContent />
        default:
          return (
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-6">{post.summary}</p>
              <p className="mb-6">Full content for this article is coming soon.</p>
            </div>
          )
      }
    } else if (lang === "pt") {
      switch (slug) {
        case "reactPerformance":
          return <ReactPerformanceContentPT />
        // Add other Portuguese content components as they become available
        default:
          return (
            <div className="prose dark:prose-invert prose-lg max-w-none">
              <p className="text-lg leading-relaxed mb-6">{post.summary}</p>
              <p className="mb-6">Conteúdo completo para este artigo em breve.</p>
            </div>
          )
      }
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark-purple-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
        <Link
          href={`/${lang}#blog`}
          className="inline-flex items-center text-deep-purple-900 dark:text-deep-purple-400 hover:text-deep-purple-800 dark:hover:text-deep-purple-300 transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-1" /> {lang === "en" ? "Back to blog" : "Voltar para o blog"}
        </Link>

        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
          <Calendar size={16} className="mr-2" />
          <span>{post.date}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {renderContent()}

        {/* Add social sharing buttons */}
        <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-8">
          <SocialShareButtons
            url={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/${lang}/blog/${slug}`}
            title={post.title}
            language={lang as "en" | "pt"}
          />
        </div>
      </div>
    </div>
  )
}
