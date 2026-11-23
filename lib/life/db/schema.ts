// Schema do Postgres (Neon). Cada coleção do app vira uma tabela:
// - id: chave do item (ou a data, para check-ins)
// - data: o item completo em jsonb (o app lê e grava o objeto inteiro)
// - sort_date: data principal do item, indexada para consultas por período
// - position: preserva a ordem da lista
import { pgTable, text, jsonb, integer, index } from "drizzle-orm/pg-core"

const collection = (name: string) =>
  pgTable(
    `life_${name}`,
    {
      id: text("id").primaryKey(),
      data: jsonb("data").notNull(),
      sortDate: text("sort_date"),
      position: integer("position").notNull().default(0),
    },
    (t) => [index(`life_${name}_sort_date_idx`).on(t.sortDate)]
  )

export const lifeTasks = collection("tasks")
export const lifeGoals = collection("goals")
export const lifeHabits = collection("habits")
export const lifeTransactions = collection("transactions")
export const lifeInvestments = collection("investments")
export const lifeWishlist = collection("wishlist")
export const lifeProjects = collection("projects")
export const lifeEvents = collection("events")
export const lifeMoments = collection("moments")
export const lifeCheckins = collection("checkins")
export const lifeCats = collection("cats")
export const lifeReminders = collection("reminders")
export const lifeGroceries = collection("groceries")
export const lifeTrips = collection("trips")
export const lifeFriends = collection("friends")
export const lifeBooks = collection("books")

/** Valores únicos do app: orçamentos, meta de leitura, versão, data de atualização. */
export const lifeMeta = pgTable("life_meta", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
})

/** Documentos auxiliares (ex.: refresh token cifrado do Google). */
export const lifeKv = pgTable("life_kv", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
})
