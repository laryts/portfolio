"use client"

import * as React from "react"
import { emptyLifeData, normalizeLifeData } from "@/lib/life/empty"
import type { LifeData, ListKey } from "@/lib/life/types"
import { uid } from "@/lib/life/format"

const CACHE_KEY = "lari-life:cache:v1"
const PENDING_KEY = "lari-life:pending:v1"
const SAVE_DEBOUNCE_MS = 600
const RETRY_MS = 12_000

export type AppStatus = "loading" | "locked" | "ready" | "unconfigured" | "error"
export type SyncState = "saved" | "saving" | "pending" | "offline" | "error"

interface LifeContextValue {
  data: LifeData
  status: AppStatus
  sync: SyncState
  errorMessage: string | null
  login: (passcode: string) => Promise<string | null>
  logout: () => Promise<void>
  retry: () => void
  update: (fn: (prev: LifeData) => LifeData) => void
  add: <K extends ListKey>(key: K, item: Omit<LifeData[K][number], "id" | "createdAt" | "updatedAt">) => string
  patch: <K extends ListKey>(key: K, id: string, partial: Partial<LifeData[K][number]>) => void
  remove: <K extends ListKey>(key: K, id: string) => void
}

const LifeContext = React.createContext<LifeContextValue | null>(null)

function readCache(): LifeData | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    return raw ? normalizeLifeData(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function writeCache(data: LifeData, pending: boolean) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data))
    if (pending) window.localStorage.setItem(PENDING_KEY, "1")
    else window.localStorage.removeItem(PENDING_KEY)
  } catch {
    // Armazenamento local bloqueado (modo privado, cota cheia). O app segue funcionando.
  }
}

function hadPending(): boolean {
  try {
    return window.localStorage.getItem(PENDING_KEY) === "1"
  } catch {
    return false
  }
}

export function LifeProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<LifeData>(() => emptyLifeData())
  const [status, setStatus] = React.useState<AppStatus>("loading")
  const [sync, setSync] = React.useState<SyncState>("saved")
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const dataRef = React.useRef(data)
  const dirtyRef = React.useRef(false)
  const savingRef = React.useRef(false)
  const saveTimer = React.useRef<number | null>(null)
  const retryTimer = React.useRef<number | null>(null)
  const mounted = React.useRef(true)

  const applyData = React.useCallback((next: LifeData) => {
    dataRef.current = next
    setData(next)
  }, [])

  // Referência estável para o envio, usada por timers e listeners.
  const flushRef = React.useRef<() => Promise<void>>(async () => {})

  const scheduleRetry = React.useCallback(() => {
    if (retryTimer.current) window.clearTimeout(retryTimer.current)
    retryTimer.current = window.setTimeout(() => {
      if (dirtyRef.current) void flushRef.current()
    }, RETRY_MS)
  }, [])

  flushRef.current = async () => {
    if (savingRef.current || !dirtyRef.current) return
    savingRef.current = true
    const snapshot = dataRef.current
    setSync("saving")
    try {
      const res = await fetch("/api/life/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      })
      if (res.status === 401) {
        dirtyRef.current = false
        if (mounted.current) setStatus("locked")
        return
      }
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw Object.assign(new Error(body.error || "Falha ao salvar"), { status: res.status })
      }
      const body = (await res.json()) as { updatedAt?: string }
      // Só marca como salvo se nada mudou durante o envio.
      if (dataRef.current === snapshot) {
        dirtyRef.current = false
        if (body.updatedAt) {
          const saved = { ...snapshot, updatedAt: body.updatedAt }
          dataRef.current = saved
          writeCache(saved, false)
          if (mounted.current) setData(saved)
        } else {
          writeCache(snapshot, false)
        }
        if (mounted.current) {
          setSync("saved")
          setErrorMessage(null)
        }
      } else {
        dirtyRef.current = true
        writeCache(dataRef.current, true)
        if (mounted.current) setSync("pending")
        scheduleRetry()
        // Há alterações novas: envia de novo logo em seguida.
        queueMicrotask(() => void flushRef.current())
      }
    } catch (error) {
      const offline = typeof navigator !== "undefined" && navigator.onLine === false
      if (mounted.current) {
        setSync(offline ? "offline" : "error")
        setErrorMessage(error instanceof Error ? error.message : "Falha ao salvar")
      }
      scheduleRetry()
    } finally {
      savingRef.current = false
    }
  }

  const queueSave = React.useCallback(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => void flushRef.current(), SAVE_DEBOUNCE_MS)
  }, [])

  const commit = React.useCallback(
    (next: LifeData) => {
      applyData(next)
      dirtyRef.current = true
      writeCache(next, true)
      setSync("pending")
      queueSave()
    },
    [applyData, queueSave]
  )

  const update = React.useCallback<LifeContextValue["update"]>(
    (fn) => {
      commit({ ...fn(dataRef.current), updatedAt: new Date().toISOString() })
    },
    [commit]
  )

  const add = React.useCallback<LifeContextValue["add"]>(
    (key, item) => {
      const id = uid()
      const now = new Date().toISOString()
      const next = { ...dataRef.current, updatedAt: now } as LifeData
      const list = next[key] as unknown[]
      const row = { ...item, id, createdAt: now, updatedAt: now }
      ;(next as unknown as Record<string, unknown>)[key] = [row, ...list]
      commit(next)
      return id
    },
    [commit]
  )

  const patch = React.useCallback<LifeContextValue["patch"]>(
    (key, id, partial) => {
      const list = dataRef.current[key] as Array<{ id: string }>
      const next = { ...dataRef.current, updatedAt: new Date().toISOString() } as LifeData
      ;(next as unknown as Record<string, unknown>)[key] = list.map((item) =>
        item.id === id ? { ...item, ...partial } : item
      )
      commit(next)
    },
    [commit]
  )

  const remove = React.useCallback<LifeContextValue["remove"]>(
    (key, id) => {
      const list = dataRef.current[key] as Array<{ id: string }>
      const next = { ...dataRef.current, updatedAt: new Date().toISOString() } as LifeData
      ;(next as unknown as Record<string, unknown>)[key] = list.filter((item) => item.id !== id)
      commit(next)
    },
    [commit]
  )

  /** Carrega o estado do servidor, respeitando alterações locais ainda não enviadas. */
  const loadRemote = React.useCallback(async () => {
    setStatus((s) => (s === "ready" ? s : "loading"))
    try {
      const res = await fetch("/api/life/data", { cache: "no-store" })
      if (res.status === 401) {
        if (mounted.current) setStatus("locked")
        return
      }
      if (res.status === 503) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        if (mounted.current) {
          setErrorMessage(body.error ?? "Armazenamento não configurado")
          setStatus("unconfigured")
        }
        return
      }
      if (!res.ok) throw new Error("Não foi possível carregar seus dados")

      const body = (await res.json()) as { data?: unknown }
      const remote = normalizeLifeData(body.data) ?? emptyLifeData()
      const cache = readCache()

      let next = remote
      // Se havia alterações não enviadas neste aparelho, elas prevalecem.
      if (hadPending() && cache) {
        next = cache
        dirtyRef.current = true
      } else if (cache && cache.updatedAt > remote.updatedAt) {
        next = cache
      }

      applyData(next)
      writeCache(next, dirtyRef.current)
      if (mounted.current) {
        setStatus("ready")
        setErrorMessage(null)
        setSync(dirtyRef.current ? "pending" : "saved")
      }
      if (dirtyRef.current) void flushRef.current()
    } catch (error) {
      if (!mounted.current) return
      const cache = readCache()
      if (cache) {
        applyData(cache)
        setStatus("ready")
        setSync("offline")
      } else {
        setStatus("error")
      }
      setErrorMessage(error instanceof Error ? error.message : "Erro de conexão")
      scheduleRetry()
    }
  }, [applyData, scheduleRetry])

  const checkSession = React.useCallback(async () => {
    try {
      const res = await fetch("/api/life/session", { cache: "no-store" })
      if (res.status === 503) {
        if (mounted.current) setStatus("unconfigured")
        setErrorMessage("LIFE_PASSCODE não configurada no servidor.")
        return
      }
      const body = (await res.json()) as { authenticated: boolean }
      if (!body.authenticated) {
        if (mounted.current) setStatus("locked")
        return
      }
      // Mostra o cache imediatamente e atualiza em seguida.
      const cache = readCache()
      if (cache) {
        applyData(cache)
        setStatus("ready")
      }
      await loadRemote()
    } catch {
      const cache = readCache()
      if (cache) {
        applyData(cache)
        setStatus("ready")
        setSync("offline")
      } else if (mounted.current) {
        setStatus("error")
        setErrorMessage("Sem conexão. Tente de novo.")
      }
    }
  }, [applyData, loadRemote])

  React.useEffect(() => {
    mounted.current = true
    void checkSession()

    const onOnline = () => {
      if (dirtyRef.current) void flushRef.current()
      else void loadRemote()
    }
    const onVisibility = () => {
      if (document.visibilityState === "visible" && !dirtyRef.current) void loadRemote()
    }
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        writeCache(dataRef.current, true)
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("online", onOnline)
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => {
      mounted.current = false
      window.removeEventListener("online", onOnline)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("beforeunload", onBeforeUnload)
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
      if (retryTimer.current) window.clearTimeout(retryTimer.current)
    }
  }, [checkSession, loadRemote])

  const login = React.useCallback<LifeContextValue["login"]>(
    async (passcode) => {
      try {
        const res = await fetch("/api/life/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ passcode }),
        })
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string }
          return body.error ?? "Não foi possível entrar"
        }
        await loadRemote()
        return null
      } catch {
        return "Sem conexão. Tente de novo."
      }
    },
    [loadRemote]
  )

  const logout = React.useCallback(async () => {
    try {
      await flushRef.current()
      await fetch("/api/life/session", { method: "DELETE" })
    } finally {
      try {
        window.localStorage.removeItem(CACHE_KEY)
        window.localStorage.removeItem(PENDING_KEY)
      } catch {
        // ignore
      }
      dirtyRef.current = false
      applyData(emptyLifeData())
      setStatus("locked")
    }
  }, [applyData])

  const retry = React.useCallback(() => {
    if (dirtyRef.current) void flushRef.current()
    else void checkSession()
  }, [checkSession])

  const value = React.useMemo<LifeContextValue>(
    () => ({ data, status, sync, errorMessage, login, logout, retry, update, add, patch, remove }),
    [data, status, sync, errorMessage, login, logout, retry, update, add, patch, remove]
  )

  return <LifeContext.Provider value={value}>{children}</LifeContext.Provider>
}

export function useLife(): LifeContextValue {
  const ctx = React.useContext(LifeContext)
  if (!ctx) throw new Error("useLife precisa estar dentro de <LifeProvider>")
  return ctx
}
