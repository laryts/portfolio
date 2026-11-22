"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Plus, Inbox, AlertTriangle, RotateCw } from "lucide-react"
import { AREAS, type AreaId } from "@/lib/life/types"
import { cn } from "@/lib/utils"
import { useLifeTheme } from "./theme"

/** Feedback tátil leve (Android/Chrome). No iOS web é ignorado; no app Expo use expo-haptics. */
export function haptic(pattern: number | number[] = 8) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern)
  } catch {
    // ignore
  }
}

export function Card({
  className,
  tint = false,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { tint?: boolean }) {
  return (
    <div className={cn(tint ? "l-card-tint" : "l-card", "p-5 md:p-6", className)} {...rest}>
      {children}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-6 md:pb-8">
      <div className="min-w-0">
        {eyebrow && <p className="l-eyebrow mb-2">{eyebrow}</p>}
        <h1 className="l-display text-[32px] leading-tight md:text-[40px]">{title}</h1>
        {description && <p className="l-ink-2 mt-2 max-w-xl text-[15px] leading-relaxed">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </header>
  )
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="l-display text-[19px] leading-tight">{children}</h2>
      {action}
    </div>
  )
}

export function AreaBadge({ area, className }: { area: AreaId; className?: string }) {
  const meta = AREAS[area]
  return <span className={cn("l-chip", `area-${meta.color}`, className)}>{meta.label}</span>
}

export function ProgressBar({
  value,
  color = "teal",
  className,
  label,
}: {
  value: number
  color?: "teal" | "plum" | "coral" | "mustard" | "sky" | "mint" | "lilac" | "pink" | "rose" | "emerald" | "ink"
  className?: string
  label?: string
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div
      className={cn("l-track", className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cn("l-fill", `area-bar-${color}`)} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      className="l-check l-focus"
      onClick={() => {
        haptic(checked ? 4 : [10, 30, 10])
        onChange(!checked)
      }}
    >
      <span>
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path d="M2 6.5 4.8 9 10 3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  )
}

export function Empty({
  icon: Icon = Inbox,
  title,
  text,
  action,
}: {
  icon?: React.ElementType
  title: string
  text?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--l-bg-2)]">
        <Icon className="h-6 w-6 l-muted" aria-hidden />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        {text && <p className="l-muted mt-1 text-sm leading-relaxed">{text}</p>}
      </div>
      {action}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("l-skeleton", className)} aria-hidden />
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-[var(--l-radius)] border p-5 sm:flex-row sm:items-center sm:justify-between"
      style={{ borderColor: "color-mix(in srgb, var(--l-danger) 35%, transparent)", background: "color-mix(in srgb, var(--l-danger) 8%, var(--l-surface))" }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--l-danger)" }} aria-hidden />
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button type="button" className="l-btn l-btn-ghost" onClick={onRetry}>
          <RotateCw className="h-4 w-4" aria-hidden /> Tentar de novo
        </button>
      )}
    </div>
  )
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn("block", className)}>
      <span className="l-label">{label}</span>
      {children}
      {hint && <span className="l-muted mt-1.5 block text-xs">{hint}</span>}
    </label>
  )
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { value: T; label: React.ReactNode }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-full bg-[var(--l-bg-2)] p-1">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              haptic(6)
              onChange(opt.value)
            }}
            className={cn(
              "l-focus min-h-[36px] rounded-full px-3.5 text-[13px] font-semibold transition-colors",
              active ? "bg-[var(--l-surface)] text-[var(--l-ink)] shadow-sm" : "text-[var(--l-muted)] hover:text-[var(--l-ink)]"
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/** Sheet: bottom-sheet no celular, modal centralizado no desktop. Renderiza fora da árvore, então herda o tema. */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg"
}) {
  const { theme } = useLifeTheme()
  const width = size === "sm" ? "md:max-w-md" : size === "lg" ? "md:max-w-2xl" : "md:max-w-xl"
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="l-overlay fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
        />
        <Dialog.Content
          data-theme={theme}
          className={cn(
            "life-root l-sheet-mobile fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col rounded-t-[28px] border-t outline-none shadow-[var(--l-shadow-lg)]",
            "md:l-sheet-desktop md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[86vh] md:w-[calc(100%-48px)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-[24px] md:border",
            width
          )}
          style={{ background: "var(--l-surface)", borderColor: "var(--l-border)", color: "var(--l-ink)" }}
        >
          <div className="mx-auto mt-2 h-1.5 w-11 rounded-full bg-[var(--l-border-strong)] md:hidden" aria-hidden />
          <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4 md:px-6 md:pt-6">
            <div className="min-w-0">
              <Dialog.Title className="l-display text-[22px] leading-tight">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="l-muted mt-1 text-sm">{description}</Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button type="button" className="l-btn-icon l-focus -mr-2 -mt-1" aria-label="Fechar">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 pb-2 md:px-6">{children}</div>
          {footer && (
            <div
              className="l-safe-bottom flex items-center justify-end gap-2 border-t px-5 py-4 md:px-6"
              style={{ borderColor: "var(--l-border)" }}
            >
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="l-btn l-btn-primary l-focus">
      <Plus className="h-4 w-4" aria-hidden />
      <span>{label}</span>
    </button>
  )
}

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: React.ReactNode
  hint?: React.ReactNode
  tone?: "default" | "good" | "bad"
}) {
  return (
    <div className="min-w-0">
      <p className="l-eyebrow">{label}</p>
      <p
        className="l-display mt-1 truncate text-[26px] leading-none"
        style={tone === "bad" ? { color: "var(--l-danger)" } : tone === "good" ? { color: "var(--l-ok)" } : undefined}
      >
        {value}
      </p>
      {hint && <p className="l-muted mt-1.5 text-xs">{hint}</p>}
    </div>
  )
}

/** Campo de texto com label que aceita propriedades de input. */
export const TextInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn("l-input", className)} {...props} />
  }
)

export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function TextArea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn("l-input min-h-[96px] resize-y leading-relaxed", className)} {...props} />
  }
)

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn("l-input pr-10", className)} {...props}>
      {children}
    </select>
  )
}
