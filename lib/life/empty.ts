import type { LifeData } from "./types"

export function emptyLifeData(): LifeData {
  return {
    version: 1,
    updatedAt: new Date(0).toISOString(),
    tasks: [],
    goals: [],
    habits: [],
    transactions: [],
    budgets: {},
    investments: [],
    wishlist: [],
    projects: [],
    events: [],
    moments: [],
    checkins: [],
    cats: [],
    reminders: [],
    groceries: [],
    trips: [],
    friends: [],
  }
}

const LIST_KEYS = [
  "tasks",
  "goals",
  "habits",
  "transactions",
  "investments",
  "wishlist",
  "projects",
  "events",
  "moments",
  "checkins",
  "cats",
  "reminders",
  "groceries",
  "trips",
  "friends",
] as const

/**
 * Garante a forma do documento vindo do cliente/armazenamento.
 * Campos desconhecidos são descartados; listas ausentes viram [].
 */
export function normalizeLifeData(input: unknown): LifeData | null {
  if (!input || typeof input !== "object") return null
  const src = input as Record<string, unknown>
  const base = emptyLifeData()
  for (const key of LIST_KEYS) {
    const value = src[key]
    if (value === undefined) continue
    if (!Array.isArray(value)) return null
    // Check-ins são indexados pela data; as demais listas, pelo id.
    const keyField = key === "checkins" ? "date" : "id"
    ;(base as unknown as Record<string, unknown>)[key] = value.filter(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        typeof (item as Record<string, unknown>)[keyField] === "string"
    )
  }
  if (src.budgets && typeof src.budgets === "object") {
    const budgets: Record<string, number> = {}
    for (const [k, v] of Object.entries(src.budgets as Record<string, unknown>)) {
      if (typeof v === "number" && Number.isFinite(v) && v >= 0) budgets[k] = v
    }
    base.budgets = budgets
  }
  base.updatedAt = typeof src.updatedAt === "string" ? src.updatedAt : base.updatedAt
  return base
}
