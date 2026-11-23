import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { asc, eq } from "drizzle-orm"
import { emptyLifeData, normalizeLifeData } from "../empty"
import { getDb, hasDatabase } from "../db/client"
import {
  lifeBooks,
  lifeCats,
  lifeCheckins,
  lifeEvents,
  lifeFriends,
  lifeGoals,
  lifeGroceries,
  lifeHabits,
  lifeInvestments,
  lifeKv,
  lifeMeta,
  lifeMoments,
  lifeProjects,
  lifeReminders,
  lifeTasks,
  lifeTransactions,
  lifeTrips,
  lifeWishlist,
} from "../db/schema"
import type { LifeData } from "../types"

export class StorageNotConfiguredError extends Error {}

const DEV_DIR = path.join(process.cwd(), ".life-data")

export function storageMode(): "postgres" | "dev-file" | "none" {
  if (hasDatabase()) return "postgres"
  if (process.env.NODE_ENV !== "production") return "dev-file"
  return "none"
}

/** Coleções do app e a tabela de cada uma. A chave é o id, exceto nos check-ins (data). */
const COLLECTIONS = [
  { key: "tasks", table: lifeTasks, sortDate: (i: Record<string, unknown>) => (i.due as string) ?? null },
  { key: "goals", table: lifeGoals, sortDate: (i: Record<string, unknown>) => (i.deadline as string) ?? null },
  { key: "habits", table: lifeHabits, sortDate: () => null },
  { key: "transactions", table: lifeTransactions, sortDate: (i: Record<string, unknown>) => (i.date as string) ?? null },
  { key: "investments", table: lifeInvestments, sortDate: () => null },
  { key: "wishlist", table: lifeWishlist, sortDate: () => null },
  { key: "projects", table: lifeProjects, sortDate: () => null },
  { key: "events", table: lifeEvents, sortDate: (i: Record<string, unknown>) => (i.date as string) ?? null },
  { key: "moments", table: lifeMoments, sortDate: (i: Record<string, unknown>) => (i.date as string) ?? null },
  { key: "checkins", table: lifeCheckins, sortDate: (i: Record<string, unknown>) => (i.date as string) ?? null },
  { key: "cats", table: lifeCats, sortDate: () => null },
  { key: "reminders", table: lifeReminders, sortDate: (i: Record<string, unknown>) => (i.date as string) ?? null },
  { key: "groceries", table: lifeGroceries, sortDate: () => null },
  { key: "trips", table: lifeTrips, sortDate: (i: Record<string, unknown>) => (i.start as string) ?? null },
  { key: "friends", table: lifeFriends, sortDate: (i: Record<string, unknown>) => (i.lastContact as string) ?? null },
  { key: "books", table: lifeBooks, sortDate: (i: Record<string, unknown>) => (i.finishedAt as string) ?? (i.startedAt as string) ?? null },
] as const

function idOf(collection: string, item: Record<string, unknown>): string {
  return collection === "checkins" ? String(item.date) : String(item.id)
}

export async function loadLifeData(): Promise<LifeData> {
  const mode = storageMode()
  if (mode === "none") throw new StorageNotConfiguredError("Armazenamento não configurado")

  if (mode === "dev-file") {
    let raw: unknown = null
    try {
      raw = JSON.parse(await readFile(path.join(DEV_DIR, "life.json"), "utf8"))
    } catch {
      raw = null
    }
    return normalizeLifeData(raw) ?? emptyLifeData()
  }

  const db = getDb()
  const doc: Record<string, unknown> = {}
  for (const c of COLLECTIONS) {
    const rows = await db.select().from(c.table).orderBy(asc(c.table.position))
    doc[c.key] = rows.map((r) => r.data)
  }
  const meta = await db.select().from(lifeMeta)
  for (const m of meta) {
    if (m.key === "budgets" || m.key === "readingGoal" || m.key === "updatedAt") doc[m.key] = m.value
  }
  return normalizeLifeData(doc) ?? emptyLifeData()
}

export async function saveLifeData(data: LifeData): Promise<void> {
  const mode = storageMode()
  if (mode === "none") throw new StorageNotConfiguredError("Armazenamento não configurado")

  if (mode === "dev-file") {
    await mkdir(DEV_DIR, { recursive: true })
    await writeFile(path.join(DEV_DIR, "life.json"), JSON.stringify(data), "utf8")
    return
  }

  const db = getDb()
  await db.transaction(async (tx) => {
    for (const c of COLLECTIONS) {
      const items = ((data as unknown as Record<string, unknown[]>)[c.key] ?? []) as Record<string, unknown>[]
      // Garante ids únicos (a chave primária não aceita repetidos).
      const seen = new Set<string>()
      const rows = []
      for (const item of items) {
        const id = idOf(c.key, item)
        if (seen.has(id)) continue
        seen.add(id)
        rows.push({ id, data: item, sortDate: c.sortDate(item), position: rows.length })
      }
      await tx.delete(c.table)
      if (rows.length) await tx.insert(c.table).values(rows as never)
    }

    await tx.delete(lifeMeta)
    await tx.insert(lifeMeta).values([
      { key: "budgets", value: data.budgets },
      { key: "updatedAt", value: data.updatedAt },
      ...(data.readingGoal ? [{ key: "readingGoal", value: data.readingGoal }] : []),
    ])
  })
}

/** Acesso genérico a documentos auxiliares (ex.: tokens de integração), no mesmo banco. */
export async function readRaw(key: string): Promise<string | null> {
  const mode = storageMode()
  if (mode === "none") throw new StorageNotConfiguredError("Armazenamento não configurado")
  if (mode === "dev-file") {
    try {
      return await readFile(path.join(DEV_DIR, `${key.replace(/[^\w.-]/g, "_")}.json`), "utf8")
    } catch {
      return null
    }
  }
  const rows = await getDb().select().from(lifeKv).where(eq(lifeKv.key, key))
  return rows[0]?.value ?? null
}

export async function writeRaw(key: string, value: string | null): Promise<void> {
  const mode = storageMode()
  if (mode === "none") throw new StorageNotConfiguredError("Armazenamento não configurado")
  if (mode === "dev-file") {
    await mkdir(DEV_DIR, { recursive: true })
    await writeFile(path.join(DEV_DIR, `${key.replace(/[^\w.-]/g, "_")}.json`), value ?? "", "utf8")
    return
  }
  const db = getDb()
  if (value === null) {
    await db.delete(lifeKv).where(eq(lifeKv.key, key))
    return
  }
  await db
    .insert(lifeKv)
    .values({ key, value })
    .onConflictDoUpdate({ target: lifeKv.key, set: { value } })
}
