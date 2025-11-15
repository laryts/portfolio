"use client"

import posthog from "posthog-js"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider
      {...props}
      onThemeChange={(theme) => {
        posthog.capture("theme_changed", { new_theme: theme })
        props.onThemeChange?.(theme)
      }}
    >
      {children}
    </NextThemesProvider>
  )
}
