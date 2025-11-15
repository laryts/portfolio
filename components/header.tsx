"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import type { Locale } from "@/types/i18n"
import { LanguageSwitcher } from "./language-switcher"

interface HeaderProps {
  lang: Locale
  dictionary: any
}

export function Header({ lang, dictionary }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navLinks = [
    { href: `/${lang}#about`, label: dictionary.nav.about },
    // { href: `/${lang}#projects`, label: dictionary.nav.projects },
    { href: `/${lang}#skills`, label: dictionary.nav.skills },
    { href: `/${lang}#xp`, label: dictionary.nav.experience },
    // { href: `/${lang}#blog`, label: dictionary.nav.blog },
    { href: `/${lang}#contact`, label: dictionary.nav.contact },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-xs" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={`/${lang}`} className="text-xl font-bold">
          Larissa Soares
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 dark:text-gray-300 hover:text-deep-purple-900 dark:hover:text-deep-purple-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher currentLang={lang} />
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label={theme === "dark" ? dictionary.hero.lightMode : dictionary.hero.darkMode}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          <LanguageSwitcher currentLang={lang} />
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              aria-label={theme === "dark" ? dictionary.hero.lightMode : dictionary.hero.darkMode}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button
            className="text-gray-700 dark:text-gray-300"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 dark:text-gray-300 hover:text-deep-purple-900 dark:hover:text-deep-purple-400 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
