"use client"

import { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"

interface SkillBarProps {
  name: string
  percentage: number
}

export function SkillBar({ name, percentage }: SkillBarProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (isInView) {
      // Pequeno atraso para que a animação seja visível após o componente aparecer
      const timer = setTimeout(() => {
        setWidth(percentage)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isInView, percentage])

  return (
    <div ref={ref}>
      <div className="flex justify-between mb-1">
        <span className="font-medium">{name}</span>
        <span className="text-gray-600 dark:text-gray-400">{percentage}%</span>
      </div>
      <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div
          className="h-2.5 bg-deep-purple-900 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  )
}
