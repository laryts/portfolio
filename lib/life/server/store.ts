import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"
import { emptyLifeData, normalizeLifeData } from "../empty"
import type { LifeData } from "../types"

const KEY = "lari-life:v1"
const DEV_FILE = path.join(process.cwd(), ".life-data", "life.json")

export class StorageNotConfiguredError extends Error {}

function kvConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (url && token) return { url: url.replace(/\/$/, ""), token }
  return null
}

async function kvCommand(cmd: unknown[]): Promise<unknown> {
  const cfg = kvConfig()
  if (!cfg) throw new StorageNotConfiguredError("KV não configurado")
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  })
  const json = (await res.json().catch(() => null)) as { result?: unknown; error?: string } | null
  if (!res.ok || !json || json.error) {
    throw new Error(`KV falhou: ${json?.error ?? res.status}`)
  }
  return json.result
}

export function storageMode(): "kv" | "dev-file" | "none" {
  if (kvConfig()) return "kv"
  if (process.env.NODE_ENV !== "production") return "dev-file"
  return "none"
}

export async function loadLifeData(): Promise<LifeData> {
  const mode = storageMode()
  if (mode === "none") throw new StorageNotConfiguredError("Armazenamento não configurado")

  let raw: unknown = null
  if (mode === "kv") {
    const result = await kvCommand(["GET", KEY])
    if (typeof result === "string") {
      try {
        raw = JSON.parse(result)
      } catch {
        raw = null
      }
    }
  } else {
    try {
      raw = JSON.parse(await readFile(DEV_FILE, "utf8"))
    } catch {
      raw = null
    }
  }
  return normalizeLifeData(raw) ?? emptyLifeData()
}

export async function saveLifeData(data: LifeData): Promise<void> {
  const mode = storageMode()
  if (mode === "none") throw new StorageNotConfiguredError("Armazenamento não configurado")
  const serialized = JSON.stringify(data)

  if (mode === "kv") {
    await kvCommand(["SET", KEY, serialized])
    return
  }
  await mkdir(path.dirname(DEV_FILE), { recursive: true })
  await writeFile(DEV_FILE, serialized, "utf8")
}

/** Acesso genérico a outros documentos (ex.: tokens de integração), mesmo backend. */
export async function readRaw(key: string): Promise<string | null> {
  const mode = storageMode()
  if (mode === "none") throw new StorageNotConfiguredError("Armazenamento não configurado")
  if (mode === "kv") {
    const result = await kvCommand(["GET", key])
    return typeof result === "string" ? result : null
  }
  try {
    return await readFile(path.join(process.cwd(), ".life-data", `${key.replace(/[^\w.-]/g, "_")}.json`), "utf8")
  } catch {
    return null
  }
}

export async function writeRaw(key: string, value: string | null): Promise<void> {
  const mode = storageMode()
  if (mode === "none") throw new StorageNotConfiguredError("Armazenamento não configurado")
  if (mode === "kv") {
    if (value === null) await kvCommand(["DEL", key])
    else await kvCommand(["SET", key, value])
    return
  }
  const file = path.join(process.cwd(), ".life-data", `${key.replace(/[^\w.-]/g, "_")}.json`)
  await mkdir(path.dirname(file), { recursive: true })
  if (value === null) await writeFile(file, "", "utf8")
  else await writeFile(file, value, "utf8")
}
