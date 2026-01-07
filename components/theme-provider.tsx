"use client"

import posthog from "posthog-js"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"

function ThemeTracker({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const [prevTheme, setPrevTheme] = useState<string | undefined>()

  useEffect(() => {
    if (theme && theme !== prevTheme && prevTheme !== undefined) {
      posthog.capture("theme_changed", { new_theme: theme })
    }
    setPrevTheme(theme)
  }, [theme, prevTheme])

  return <>{children}</>
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider {...props}>
      <ThemeTracker>{children}</ThemeTracker>
    </NextThemesProvider>
  )
}
