"use client"

import * as React from "react"
import { Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { haptic } from "../ui"
import { useLifeTheme } from "../theme"

export function ProgressRing({ value, size = 64, stroke = 7 }: { value: number; size?: number; stroke?: number }) {
  const pct = Math.max(0, Math.min(100, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${Math.round(pct)}% concluído`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--l-bg-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--l-teal)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (pct / 100) * c}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold">{Math.round(pct)}%</span>
    </div>
  )
}

/** Botão de editar/apagar em linha. Apagar pede confirmação em um segundo toque. */
export function RowActions({ onEdit, onDelete, label }: { onEdit?: () => void; onDelete?: () => void; label: string }) {
  const [armed, setArmed] = React.useState(false)

  React.useEffect(() => {
    if (!armed) return
    const t = window.setTimeout(() => setArmed(false), 3000)
    return () => window.clearTimeout(t)
  }, [armed])

  return (
    <div className="flex shrink-0 items-center">
      {onEdit && (
        <button type="button" className="l-btn-icon l-focus" onClick={onEdit} aria-label={`Editar ${label}`}>
          <Pencil className="h-4 w-4" aria-hidden />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className={cn("l-focus inline-flex h-11 min-w-[44px] items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors", armed ? "" : "l-btn-icon")}
          style={armed ? { background: "var(--l-danger)", color: "#fff" } : undefined}
          onClick={() => {
            if (!armed) {
              haptic(6)
              setArmed(true)
              return
            }
            haptic([12, 40, 12])
            onDelete()
          }}
          aria-label={armed ? `Confirmar exclusão de ${label}` : `Apagar ${label}`}
        >
          {armed ? "Apagar?" : <Trash2 className="h-4 w-4" aria-hidden />}
        </button>
      )}
    </div>
  )
}

export function ActionRow({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <li
      className={cn("flex items-center gap-3 py-3", className)}
      style={{ borderBottom: "1px solid var(--l-border)" }}
    >
      {children}
    </li>
  )
}

/** Converte "" em undefined para campos opcionais de formulário. */
export function emptyToUndef(v: string): string | undefined {
  const t = v.trim()
  return t ? t : undefined
}

export function parseIntSafe(v: string, fallback: number): number {
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n) ? n : fallback
}

export function parseFloatSafe(v: string, fallback: number): number {
  const n = Number(v.replace(",", "."))
  return Number.isFinite(n) ? n : fallback
}

// Paleta para gráficos (SVG precisa de cores resolvidas, não de var()).
const CHART_LIGHT = {
  teal: "#1f6b68",
  coral: "#e4705a",
  mustard: "#e3a92f",
  sky: "#5c93c9",
  mint: "#3f9d7a",
  plum: "#5e2b5b",
  lilac: "#8a6bb8",
  pink: "#d0568a",
  rose: "#c2506b",
  emerald: "#2f8a5b",
  ink: "#5d5566",
  muted: "#8a8294",
  grid: "#e7ddd0",
  surface: "#fffdf9",
}
const CHART_DARK: typeof CHART_LIGHT = {
  teal: "#6fc7bf",
  coral: "#f08a74",
  mustard: "#f0c15a",
  sky: "#8db9e6",
  mint: "#7fd1ad",
  plum: "#d59bcf",
  lilac: "#b9a0e6",
  pink: "#f08ab4",
  rose: "#f08ba0",
  emerald: "#6fcf97",
  ink: "#c4bacd",
  muted: "#8f8599",
  grid: "#2f2839",
  surface: "#1e1a27",
}

export function useChartPalette(): typeof CHART_LIGHT {
  const { theme } = useLifeTheme()
  const [systemDark, setSystemDark] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setSystemDark(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  const dark = theme === "dark" || (theme === "system" && systemDark)
  return dark ? CHART_DARK : CHART_LIGHT
}
