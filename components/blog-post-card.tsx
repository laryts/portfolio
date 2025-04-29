"use client"

import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface BlogPostCardProps {
  title: string
  date: string
  summary: string
  tags: string[]
  slug: string
  readMoreText: string
}

export function BlogPostCard({ title, date, summary, tags, slug, readMoreText }: BlogPostCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-6">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
          <Calendar size={14} className="mr-1" />
          <span>{date}</span>
        </div>

        <h3 className="text-xl font-bold mb-3">{title}</h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{summary}</p>

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
          href={`/blog/${slug}`}
          className="inline-flex items-center text-deep-purple-900 dark:text-deep-purple-400 hover:text-deep-purple-800 dark:hover:text-deep-purple-300 transition-colors"
        >
          {readMoreText} <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  )
}
