"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Locale } from "@/types/i18n"
import { useTheme } from "next-themes"
import posthog from 'posthog-js'

interface LanguageSwitcherProps {
  currentLang: Locale
}

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const toggleDropdown = () => {
    posthog.capture('language-switcher-toggled', { opened: !isOpen })
    setIsOpen(!isOpen)
  }

  const changeLanguage = (newLocale: Locale) => {
    posthog.capture('language-changed', {
      from_locale: currentLang,
      to_locale: newLocale,
      current_path: pathname
    })
    router.push(`/${newLocale}`)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-deep-purple-900 dark:hover:text-deep-purple-400 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{currentLang === "en" ? "🇺🇸" : "🇧🇷"}</span>
        <span className="sr-only md:not-sr-only">{currentLang === "en" ? "English" : "Português"}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => changeLanguage("en")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLang === "en"
                  ? "bg-gray-100 dark:bg-gray-700 text-deep-purple-900 dark:text-deep-purple-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => changeLanguage("pt")}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentLang === "pt"
                  ? "bg-gray-100 dark:bg-gray-700 text-deep-purple-900 dark:text-deep-purple-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              🇧🇷 Português
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
