"use client"

import * as React from "react"
import {
  CalendarDays,
  Cat,
  CheckSquare,
  Cloud,
  CloudOff,
  Ellipsis,
  FolderKanban,
  Gift,
  HeartPulse,
  House,
  LogOut,
  Moon,
  NotebookPen,
  Plane,
  RefreshCw,
  ShoppingBasket,
  Sun,
  Target,
  CalendarCheck,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLife, type SyncState } from "./store"
import { haptic } from "./ui"
import { useLifeTheme, type LifeTheme } from "./theme"

export type ViewId =
  | "hoje"
  | "tarefas"
  | "metas"
  | "habitos"
  | "financas"
  | "desejos"
  | "projetos"
  | "calendario"
  | "bemestar"
  | "momentos"
  | "pessoas"
  | "viagens"
  | "lar"
  | "mercado"

interface ViewMeta {
  id: ViewId
  label: string
  icon: LucideIcon
  group: "Dia a dia" | "Crescer" | "Dinheiro" | "Vida & casa" | "Pessoas & mente"
}

export const VIEWS: ViewMeta[] = [
  { id: "hoje", label: "Hoje", icon: House, group: "Dia a dia" },
  { id: "tarefas", label: "Tarefas", icon: CheckSquare, group: "Dia a dia" },
  { id: "calendario", label: "Calendário", icon: CalendarDays, group: "Dia a dia" },
  { id: "habitos", label: "Hábitos", icon: CalendarCheck, group: "Dia a dia" },
  { id: "metas", label: "Metas", icon: Target, group: "Crescer" },
  { id: "projetos", label: "Projetos", icon: FolderKanban, group: "Crescer" },
  { id: "financas", label: "Finanças", icon: Wallet, group: "Dinheiro" },
  { id: "desejos", label: "Desejos", icon: Gift, group: "Dinheiro" },
  { id: "lar", label: "Lar & gatos", icon: Cat, group: "Vida & casa" },
  { id: "mercado", label: "Mercado", icon: ShoppingBasket, group: "Vida & casa" },
  { id: "viagens", label: "Viagens", icon: Plane, group: "Vida & casa" },
  { id: "bemestar", label: "Bem-estar", icon: HeartPulse, group: "Pessoas & mente" },
  { id: "pessoas", label: "Pessoas", icon: Users, group: "Pessoas & mente" },
  { id: "momentos", label: "Momentos", icon: NotebookPen, group: "Pessoas & mente" },
]

const MOBILE_PRIMARY: ViewId[] = ["hoje", "tarefas", "habitos", "financas"]

export function viewFromHash(hash: string): ViewId {
  const id = hash.replace("#", "") as ViewId
  return VIEWS.some((v) => v.id === id) ? id : "hoje"
}

function SyncBadge({ sync }: { sync: SyncState }) {
  const map: Record<SyncState, { label: string; icon: LucideIcon; color: string }> = {
    saved: { label: "Salvo", icon: Cloud, color: "var(--l-ok)" },
    saving: { label: "Salvando…", icon: RefreshCw, color: "var(--l-muted)" },
    pending: { label: "Pendente", icon: RefreshCw, color: "var(--l-warn)" },
    offline: { label: "Offline · salvo neste aparelho", icon: CloudOff, color: "var(--l-warn)" },
    error: { label: "Não sincronizou", icon: CloudOff, color: "var(--l-danger)" },
  }
  const item = map[sync]
  const Icon = item.icon
  return (
    <span
      className="l-chip"
      style={{ background: "var(--l-bg-2)", color: item.color }}
      role="status"
      aria-live="polite"
    >
      <Icon className={cn("h-3.5 w-3.5", sync === "saving" && "animate-spin")} aria-hidden />
      {item.label}
    </span>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useLifeTheme()
  const options: { value: LifeTheme; label: string }[] = [
    { value: "system", label: "Auto" },
    { value: "light", label: "Claro" },
    { value: "dark", label: "Escuro" },
  ]
  const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light"
  const Icon = theme === "dark" ? Moon : Sun
  return (
    <button
      type="button"
      className="l-btn l-btn-ghost l-focus h-11 w-full justify-start px-3 text-[13px]"
      onClick={() => {
        haptic(6)
        setTheme(next)
      }}
      aria-label={`Tema: ${options.find((o) => o.value === theme)?.label}. Trocar`}
    >
      <Icon className="h-4 w-4" aria-hidden />
      Tema: {options.find((o) => o.value === theme)?.label}
    </button>
  )
}

interface ShellProps {
  view: ViewId
  onNavigate: (id: ViewId) => void
  children: React.ReactNode
}

export function Shell({ view, onNavigate, children }: ShellProps) {
  const { sync, logout } = useLife()
  const { theme } = useLifeTheme()
  const [moreOpen, setMoreOpen] = React.useState(false)
  const current = VIEWS.find((v) => v.id === view) ?? VIEWS[0]
  const groups = Array.from(new Set(VIEWS.map((v) => v.group)))

  const go = (id: ViewId) => {
    haptic(6)
    onNavigate(id)
    setMoreOpen(false)
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
  }

  return (
    <div className="life-root l-mural min-h-dvh" data-theme={theme}>
      {/* Sidebar — desktop */}
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden w-[256px] flex-col border-r bg-[var(--l-bg)]/80 backdrop-blur-xl md:flex"
        style={{ borderColor: "var(--l-border)" }}
      >
        <div className="px-6 pb-4 pt-7">
          <p className="l-eyebrow">Painel pessoal</p>
          <p className="l-display mt-1 text-[26px] leading-none">Lari&rsquo;s life</p>
        </div>
        <nav aria-label="Principal" className="l-scroll-x flex-1 overflow-y-auto px-3 pb-4">
          {groups.map((group) => (
            <div key={group} className="mb-4">
              <p className="l-eyebrow px-3 pb-2 pt-2">{group}</p>
              <ul className="space-y-0.5">
                {VIEWS.filter((v) => v.group === group).map((item) => {
                  const active = item.id === view
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => go(item.id)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "l-focus flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-[14px] font-medium transition-colors",
                          active
                            ? "bg-[var(--l-surface)] text-[var(--l-ink)] shadow-[var(--l-shadow)]"
                            : "text-[var(--l-ink-2)] hover:bg-[var(--l-surface)]/70 hover:text-[var(--l-ink)]"
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" aria-hidden />
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="space-y-2 border-t px-4 py-4" style={{ borderColor: "var(--l-border)" }}>
          <SyncBadge sync={sync} />
          <ThemeToggle />
          <button
            type="button"
            className="l-btn l-btn-ghost l-focus h-11 w-full justify-start px-3 text-[13px]"
            onClick={() => void logout()}
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sair
          </button>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <header
        className="l-safe-top sticky top-0 z-30 border-b bg-[var(--l-bg)]/85 backdrop-blur-xl md:hidden"
        style={{ borderColor: "var(--l-border)" }}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <div className="min-w-0">
            <p className="l-eyebrow leading-none">Lari&rsquo;s life</p>
            <p className="l-display truncate text-[20px] leading-tight">{current.label}</p>
          </div>
          <SyncBadge sync={sync} />
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-[1280px] px-4 pb-[120px] pt-4 md:pb-16 md:pl-[296px] md:pr-10 md:pt-10">
        <div key={view} className="l-rise">
          {children}
        </div>
      </main>

      {/* Bottom nav — mobile */}
      <nav
        aria-label="Principal"
        className="l-safe-bottom fixed inset-x-0 bottom-0 z-30 border-t bg-[var(--l-surface)]/92 backdrop-blur-xl md:hidden"
        style={{ borderColor: "var(--l-border)" }}
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 px-2 pt-1.5">
          {MOBILE_PRIMARY.map((id) => {
            const item = VIEWS.find((v) => v.id === id)!
            const Icon = item.icon
            const active = id === view
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => go(id)}
                  aria-current={active ? "page" : undefined}
                  className="l-focus flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold"
                  style={{ color: active ? "var(--l-plum)" : "var(--l-muted)" }}
                >
                  <span
                    className={cn("flex h-7 w-12 items-center justify-center rounded-full transition-colors", active && "bg-[var(--l-plum-soft)]")}
                  >
                    <Icon className="h-[20px] w-[20px]" aria-hidden />
                  </span>
                  {item.label}
                </button>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              onClick={() => {
                haptic(6)
                setMoreOpen(true)
              }}
              className="l-focus flex min-h-[56px] w-full flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold text-[var(--l-muted)]"
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
            >
              <span className="flex h-7 w-12 items-center justify-center rounded-full">
                <Ellipsis className="h-[20px] w-[20px]" aria-hidden />
              </span>
              Mais
            </button>
          </li>
        </ul>
      </nav>

      {/* Menu "Mais" — mobile */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Todos os módulos">
          <button
            type="button"
            className="l-overlay absolute inset-0 bg-black/40"
            aria-label="Fechar menu"
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="l-sheet-mobile l-safe-bottom absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[28px] border-t px-5 pb-6 pt-3"
            style={{ background: "var(--l-surface)", borderColor: "var(--l-border)" }}
          >
            <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-[var(--l-border-strong)]" aria-hidden />
            <div className="mb-4 flex items-center justify-between">
              <p className="l-display text-[22px]">Todos os módulos</p>
              <button type="button" className="l-btn-icon l-focus -mr-2" aria-label="Fechar" onClick={() => setMoreOpen(false)}>
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            {groups.map((group) => (
              <div key={group} className="mb-5">
                <p className="l-eyebrow mb-2">{group}</p>
                <div className="grid grid-cols-3 gap-2">
                  {VIEWS.filter((v) => v.group === group).map((item) => {
                    const Icon = item.icon
                    const active = item.id === view
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => go(item.id)}
                        aria-current={active ? "page" : undefined}
                        className="l-focus flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-2xl border p-2 text-center text-[12px] font-semibold"
                        style={{
                          borderColor: active ? "var(--l-plum)" : "var(--l-border)",
                          background: active ? "var(--l-plum-soft)" : "var(--l-surface-2)",
                          color: active ? "var(--l-plum)" : "var(--l-ink-2)",
                        }}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <ThemeToggle />
              <button type="button" className="l-btn l-btn-ghost l-focus h-11" onClick={() => void logout()}>
                <LogOut className="h-4 w-4" aria-hidden /> Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

