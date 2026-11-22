// Helpers de data em horário local, trabalhando com strings "YYYY-MM-DD".

const pad = (n: number) => String(n).padStart(2, "0")

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

export function todayISO(): string {
  return toISO(new Date())
}

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

/** Diferença em dias: b - a. */
export function diffDays(a: string, b: string): number {
  const ms = parseISO(b).getTime() - parseISO(a).getTime()
  return Math.round(ms / 86_400_000)
}

/** Segunda-feira da semana que contém a data. */
export function startOfWeek(iso: string): string {
  const d = parseISO(iso)
  const day = (d.getDay() + 6) % 7 // segunda = 0
  d.setDate(d.getDate() - day)
  return toISO(d)
}

export function weekDays(iso: string): string[] {
  const start = startOfWeek(iso)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

export function monthStart(monthIso: string): string {
  return `${monthIso}-01`
}

export function daysInMonth(monthIso: string): number {
  const [y, m] = monthIso.split("-").map(Number)
  return new Date(y, m, 0).getDate()
}

export function shiftMonth(monthIso: string, delta: number): string {
  const [y, m] = monthIso.split("-").map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

export function formatDayShort(iso: string): string {
  return parseISO(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "")
}

export function formatDateLong(iso: string): string {
  return parseISO(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
}

export function formatMonthTitle(monthIso: string): string {
  const s = parseISO(`${monthIso}-01`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** "Hoje", "Amanhã", "Ontem", ou "em 3 dias" / "há 2 dias". */
export function relativeDay(iso: string, today = todayISO()): string {
  const diff = diffDays(today, iso)
  if (diff === 0) return "Hoje"
  if (diff === 1) return "Amanhã"
  if (diff === -1) return "Ontem"
  if (diff > 1) return `em ${diff} dias`
  return `há ${Math.abs(diff)} dias`
}
