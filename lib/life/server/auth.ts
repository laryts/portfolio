import { createHash, createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

export const SESSION_COOKIE = "lari_life_session"
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 dias

export class AuthNotConfiguredError extends Error {}

function getPasscode(): string {
  const passcode = process.env.LIFE_PASSCODE
  if (!passcode) throw new AuthNotConfiguredError("LIFE_PASSCODE não configurada")
  return passcode
}

function signingKey(): string {
  return process.env.LIFE_SESSION_SECRET || getPasscode()
}

/** Token de sessão: HMAC da chave de assinatura. Não contém a senha. */
function sessionToken(): string {
  return createHmac("sha256", signingKey()).update("lari-life-session:v1").digest("hex")
}

function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest()
  const hb = createHash("sha256").update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function checkPasscode(candidate: string): boolean {
  return safeEqual(candidate, getPasscode())
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  }
}

export async function createSession(): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, sessionToken(), sessionCookieOptions())
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 })
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies()
    const value = store.get(SESSION_COOKIE)?.value
    if (!value) return false
    return safeEqual(value, sessionToken())
  } catch (error) {
    if (error instanceof AuthNotConfiguredError) throw error
    return false
  }
}

// Limite simples de tentativas de login (por processo). Suficiente para uma pessoa só.
const failures = new Map<string, { count: number; until: number }>()
const MAX_FAILURES = 5
const LOCK_MS = 15 * 60 * 1000

export function loginIsLocked(key: string): boolean {
  const entry = failures.get(key)
  if (!entry) return false
  if (entry.until && entry.until < Date.now()) {
    failures.delete(key)
    return false
  }
  return entry.count >= MAX_FAILURES
}

export function registerFailure(key: string) {
  const entry = failures.get(key) ?? { count: 0, until: 0 }
  entry.count += 1
  if (entry.count >= MAX_FAILURES) entry.until = Date.now() + LOCK_MS
  failures.set(key, entry)
}

export function clearFailures(key: string) {
  failures.delete(key)
}
