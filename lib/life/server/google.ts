// Integração com o Google Calendar (somente leitura).
// O refresh token fica cifrado (AES-256-GCM) no mesmo armazenamento do app.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto"
import { readRaw, writeRaw } from "./store"

const TOKEN_KEY = "lari-life:google:v1"
const SCOPE = "https://www.googleapis.com/auth/calendar.readonly"

export class GoogleNotConfiguredError extends Error {}

export interface CalendarEvent {
  id: string
  title: string
  allDay: boolean
  date: string // YYYY-MM-DD (data de início, no fuso do Google)
  startAt?: string // ISO, para eventos com horário
  endAt?: string
  link?: string
}

function config() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new GoogleNotConfiguredError("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET não configurados")
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "")
  return {
    clientId,
    clientSecret,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || `${site}/api/life/google/callback`,
    authUrl: process.env.GOOGLE_AUTH_URL || "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: process.env.GOOGLE_TOKEN_URL || "https://oauth2.googleapis.com/token",
    apiBase: process.env.GOOGLE_API_BASE || "https://www.googleapis.com",
  }
}

export function isGoogleConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
}

export function newOAuthState(): string {
  return randomBytes(24).toString("hex")
}

export function buildAuthUrl(state: string): string {
  const c = config()
  const params = new URLSearchParams({
    client_id: c.clientId,
    redirect_uri: c.redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  })
  return `${c.authUrl}?${params.toString()}`
}

function encryptionKey(): Buffer {
  const secret = process.env.LIFE_SESSION_SECRET || process.env.LIFE_PASSCODE || ""
  return createHash("sha256").update(`${secret}:google-refresh-token`).digest()
}

function encrypt(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv)
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  return JSON.stringify({ iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: data.toString("base64") })
}

function decrypt(payload: string): string | null {
  try {
    const { iv, tag, data } = JSON.parse(payload) as { iv: string; tag: string; data: string }
    const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv, "base64"))
    decipher.setAuthTag(Buffer.from(tag, "base64"))
    return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8")
  } catch {
    return null
  }
}

export async function isConnected(): Promise<boolean> {
  return (await readRaw(TOKEN_KEY)) !== null
}

export async function disconnect(): Promise<void> {
  await writeRaw(TOKEN_KEY, null)
}

/** Troca o código do callback por tokens e guarda o refresh token cifrado. */
export async function completeAuthorization(code: string): Promise<void> {
  const c = config()
  const res = await fetch(c.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: c.clientId,
      client_secret: c.clientSecret,
      redirect_uri: c.redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  })
  const body = (await res.json().catch(() => ({}))) as { refresh_token?: string; error?: string }
  if (!res.ok || !body.refresh_token) {
    throw new Error(`Google não devolveu um refresh token (${body.error ?? res.status})`)
  }
  await writeRaw(TOKEN_KEY, encrypt(body.refresh_token))
}

async function accessToken(): Promise<string> {
  const stored = await readRaw(TOKEN_KEY)
  const refresh = stored ? decrypt(stored) : null
  if (!refresh) throw new Error("NOT_CONNECTED")
  const c = config()
  const res = await fetch(c.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refresh,
      client_id: c.clientId,
      client_secret: c.clientSecret,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  })
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string }
  if (!res.ok || !body.access_token) {
    // Token revogado ou expirado: desconecta para o usuário reconectar.
    if (body.error === "invalid_grant") await disconnect()
    throw new Error(body.error === "invalid_grant" ? "NOT_CONNECTED" : `Falha ao renovar o acesso (${body.error ?? res.status})`)
  }
  return body.access_token
}

/** Eventos entre duas datas (YYYY-MM-DD, fim exclusivo), já normalizados. */
export async function listEvents(fromIso: string, toIso: string): Promise<CalendarEvent[]> {
  const c = config()
  const token = await accessToken()
  const params = new URLSearchParams({
    timeMin: `${fromIso}T00:00:00Z`,
    timeMax: `${toIso}T00:00:00Z`,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "250",
  })
  const res = await fetch(`${c.apiBase}/calendar/v3/calendars/primary/events?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Google Calendar respondeu ${res.status}`)
  const body = (await res.json()) as {
    items?: Array<{
      id: string
      status?: string
      summary?: string
      htmlLink?: string
      start?: { date?: string; dateTime?: string }
      end?: { date?: string; dateTime?: string }
    }>
  }
  const events: CalendarEvent[] = []
  for (const item of body.items ?? []) {
    if (item.status === "cancelled") continue
    const allDay = !!item.start?.date && !item.start?.dateTime
    const startAt = item.start?.dateTime
    const date = allDay ? item.start?.date : startAt?.slice(0, 10)
    if (!date) continue
    events.push({
      id: item.id,
      title: item.summary || "(sem título)",
      allDay,
      date,
      startAt: allDay ? undefined : startAt,
      endAt: allDay ? undefined : item.end?.dateTime,
      link: item.htmlLink,
    })
  }
  return events
}
