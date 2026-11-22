"use client"

import * as React from "react"

export type LifeTheme = "system" | "light" | "dark"

const KEY = "lari-life:theme:v1"

interface ThemeValue {
  theme: LifeTheme
  setTheme: (t: LifeTheme) => void
}

const ThemeContext = React.createContext<ThemeValue>({ theme: "system", setTheme: () => {} })

export function LifeThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<LifeTheme>("system")

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(KEY) as LifeTheme | null
      if (saved === "light" || saved === "dark" || saved === "system") setThemeState(saved)
    } catch {
      // ignore
    }
  }, [])

  const setTheme = React.useCallback((t: LifeTheme) => {
    setThemeState(t)
    try {
      window.localStorage.setItem(KEY, t)
    } catch {
      // ignore
    }
  }, [])

  const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useLifeTheme() {
  return React.useContext(ThemeContext)
}
