"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import posthog from 'posthog-js'

interface BlogPostCardProps {
  title: string
  date: string
  summary: string
  tags: string[]
  slug: string
  readMoreText: string
  /** When provided, link is /${lang}/blog/${slug} */
  lang?: string
  /** URL da imagem de capa para o thumbnail do card */
  imageUrl?: string | null
}

export function BlogPostCard({ title, date, summary, tags, slug, readMoreText, lang, imageUrl }: BlogPostCardProps) {
  const href = lang ? `/${lang}/blog/${slug}` : `/blog/${slug}`
  return (
    <motion.div
      className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {imageUrl ? (
        <div className="relative h-48 w-full shrink-0">
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : null}
      <div className="p-6 flex flex-col flex-1 min-h-0">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
          <Calendar size={14} className="mr-1" />
          <span>{date}</span>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2">{title}</h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-5 flex-1 min-h-0 overflow-hidden text-ellipsis">
          {summary}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-deep-purple-100 dark:bg-deep-purple-900 text-deep-purple-800 dark:text-deep-purple-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={href}
          className="mt-auto inline-flex items-center text-deep-purple-900 dark:text-deep-purple-400 hover:text-deep-purple-800 dark:hover:text-deep-purple-300 transition-colors"
          onClick={() => posthog.capture('blog_post_card_read_more_clicked', { slug, title, tags })}
        >
          {readMoreText} <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  )
}
