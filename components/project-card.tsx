"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface ProjectCardProps {
  title: string
  description: string
  imageUrl: string
  projectUrl: string
  viewProjectText: string
}

export function ProjectCard({ title, description, imageUrl, projectUrl, viewProjectText }: ProjectCardProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative h-48">
        <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <Link
          href={projectUrl}
          className="inline-flex items-center text-deep-purple-900 dark:text-deep-purple-400 hover:text-deep-purple-800 dark:hover:text-deep-purple-300 transition-colors"
        >
          {viewProjectText} <ExternalLink size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  )
}
