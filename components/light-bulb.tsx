"use client"

import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

interface LightBulbProps {
  dictionary: any
}

export function LightBulb({ dictionary }: LightBulbProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined)

  useEffect(() => {
    setMounted(true)
    setCurrentTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col items-center">
      {/* Fio da lâmpada */}
      <div className="w-1 h-20 bg-gray-400 dark:bg-gray-600"></div>

      {/* Lâmpada com botão de toggle */}
      <div
        className="cursor-pointer transition-transform duration-300 hover:scale-110 relative"
        onClick={toggleTheme}
        role="button"
        aria-label={currentTheme === "dark" ? dictionary.hero.lightMode : dictionary.hero.darkMode}
      >
        <div className="relative w-24 h-24">
          <svg
            viewBox="0 0 512 512"
            className={`w-full h-full transform rotate-180 ${
              currentTheme === "dark" ? "filter drop-shadow-[0_0_15px_rgba(255,196,0,0.7)]" : "filter brightness-90"
            }`}
          >
            <path
              d="M256,357.209c-42.676,0-77.395,34.72-77.395,77.395S213.324,512,256,512s77.395-34.72,77.395-77.395 S298.676,357.209,256,357.209z"
              fill={currentTheme === "dark" ? "#93C7EF" : "#D5D6DB"}
            />
            <path
              d="M256,512c42.676,0,77.395-34.72,77.395-77.395s-34.72-77.395-77.395-77.395"
              fill={currentTheme === "dark" ? "#78B9EB" : "#C5C6CB"}
            />
            <path
              d="M378.461,50.471C345.652,17.893,302.215,0,256.012,0c-0.419,0-0.843,0.002-1.262,0.004 c-45.274,0.32-88.091,18.097-120.565,50.058c-32.481,31.969-50.929,74.498-51.943,119.759 c-1.066,47.514,16.713,92.286,50.059,126.07c18.076,18.312,28.443,42.832,28.443,67.272v17.86h190.512v-17.86 c0-24.583,10.191-48.925,27.96-66.785c32.623-32.791,50.588-76.323,50.588-122.574C429.804,127.147,411.569,83.346,378.461,50.471z"
              fill={currentTheme === "dark" ? "#FFAD41" : "#D5D6DB"}
            />
            <path
              d="M378.461,50.471C345.652,17.893,302.215,0,256.012,0c-0.004,0-0.008,0-0.012,0v381.023h95.256v-17.86 c0-24.583,10.191-48.925,27.96-66.785c32.623-32.791,50.588-76.323,50.588-122.574C429.804,127.147,411.569,83.346,378.461,50.471z"
              fill={currentTheme === "dark" ? "#FF9811" : "#C5C6CB"}
            />
            <g>
              <polygon
                points="314.47,135.018 289.213,160.275 314.091,185.153 289.213,210.032 314.47,235.289 364.607,185.153"
                fill={currentTheme === "dark" ? "#FFFFFF" : "#E5E6EB"}
              />
              <polygon
                points="197.909,185.153 222.787,160.275 197.53,135.018 147.393,185.153 197.53,235.289 222.787,210.032"
                fill={currentTheme === "dark" ? "#FFFFFF" : "#E5E6EB"}
              />
              <polygon
                points="289.167,114.307 252.664,114.307 222.833,256 259.336,256"
                fill={currentTheme === "dark" ? "#FFFFFF" : "#E5E6EB"}
              />
            </g>
            <rect
              x="160.744"
              y="363.163"
              width="190.512"
              height="71.442"
              fill={currentTheme === "dark" ? "#BEDDF5" : "#D5D6DB"}
            />
            <rect
              x="256"
              y="363.163"
              width="95.256"
              height="71.442"
              fill={currentTheme === "dark" ? "#93C7EF" : "#C5C6CB"}
            />
          </svg>

          {/* Efeito de brilho quando acesa */}
          {currentTheme === "dark" && (
            <div className="absolute inset-0 bg-yellow-300 opacity-20 rounded-full blur-xl animate-pulse"></div>
          )}
        </div>
        <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
          {currentTheme === "dark" ? dictionary.hero.lightMode : dictionary.hero.darkMode}
        </div>
      </div>
    </div>
  )
}
