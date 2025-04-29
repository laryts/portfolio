"use client"

import { useState } from "react"
import { Twitter, Linkedin, Facebook, LinkIcon } from "lucide-react"

interface SocialShareButtonsProps {
  url: string
  title: string
  className?: string
  language?: "en" | "pt"
}

export function SocialShareButtons({ url, title, className = "", language = "en" }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const shareText = language === "en" ? "Share this article" : "Compartilhe este artigo"
  const copiedText = language === "en" ? "Copied!" : "Copiado!"

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <h3 className="text-lg font-medium mb-2">{shareText}</h3>
      <div className="flex space-x-3">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-deep-purple-100 dark:hover:bg-deep-purple-900 transition-colors"
          aria-label={language === "en" ? "Share on Twitter" : "Compartilhar no Twitter"}
        >
          <Twitter size={20} />
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-deep-purple-100 dark:hover:bg-deep-purple-900 transition-colors"
          aria-label={language === "en" ? "Share on LinkedIn" : "Compartilhar no LinkedIn"}
        >
          <Linkedin size={20} />
        </a>
        <a
          href={shareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-deep-purple-100 dark:hover:bg-deep-purple-900 transition-colors"
          aria-label={language === "en" ? "Share on Facebook" : "Compartilhar no Facebook"}
        >
          <Facebook size={20} />
        </a>
        <button
          onClick={handleCopyLink}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-deep-purple-100 dark:hover:bg-deep-purple-900 transition-colors relative"
          aria-label={language === "en" ? "Copy link to clipboard" : "Copiar link para a área de transferência"}
        >
          <LinkIcon size={20} />
          {copied && (
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-deep-purple-900 text-white text-xs py-1 px-2 rounded">
              {copiedText}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
