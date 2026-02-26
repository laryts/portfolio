"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import posthog from 'posthog-js'

export interface ProjectLink {
  label: string
  url: string
}

interface ProjectCardProps {
  title: string
  description: string
  imageUrl: string
  projectUrl: string
  viewProjectText: string
  year?: string
  links?: ProjectLink[]
}

function trackClick(title: string, url: string) {
  posthog.capture('project_link_clicked', { project_title: title, project_url: url })
}

export function ProjectCard({
  title,
  description,
  imageUrl,
  projectUrl,
  viewProjectText,
  year,
  links = [],
}: ProjectCardProps) {
  return (
    <motion.div
      className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative h-48 shrink-0">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6 flex flex-col flex-1 min-h-0">
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold">{title}</h3>
          {year && (
            <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{year}</span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 min-h-0">{description}</p>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href={projectUrl}
            className="inline-flex items-center text-deep-purple-900 dark:text-deep-purple-400 hover:text-deep-purple-800 dark:hover:text-deep-purple-300 transition-colors"
            onClick={() => trackClick(title, projectUrl)}
          >
            {viewProjectText} <ExternalLink size={16} className="ml-1" />
          </Link>
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="inline-flex items-center text-deep-purple-900 dark:text-deep-purple-400 hover:text-deep-purple-800 dark:hover:text-deep-purple-300 transition-colors"
              onClick={() => trackClick(title, link.url)}
            >
              {link.label} <ExternalLink size={16} className="ml-1" />
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
