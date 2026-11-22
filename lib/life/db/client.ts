import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

export class DatabaseNotConfiguredError extends Error {}

type Db = NodePgDatabase<typeof schema>

const globalForDb = globalThis as unknown as { __lifePool?: Pool; __lifeDb?: Db }

/** Conexão reaproveitada entre requisições (o Neon usa pooler, então o limite é baixo). */
export function getDb(): Db {
  const url = process.env.DATABASE_URL
  if (!url) throw new DatabaseNotConfiguredError("DATABASE_URL não configurada")
  if (!globalForDb.__lifeDb) {
    globalForDb.__lifePool = new Pool({
      connectionString: url,
      max: 3,
      // Neon exige TLS; em localhost não há certificado, então só ativa fora de localhost.
      ssl: url.includes("localhost") || url.includes("127.0.0.1") ? undefined : { rejectUnauthorized: true },
    })
    globalForDb.__lifeDb = drizzle(globalForDb.__lifePool, { schema })
  }
  return globalForDb.__lifeDb
}

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL
}
