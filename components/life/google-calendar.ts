"use client"

import * as React from "react"
import { toISO } from "@/lib/life/dates"

// Mesmo formato devolvido por /api/life/google/events (definido aqui para não importar código de servidor).
export interface CalendarEvent {
  id: string
  title: string
  allDay: boolean
  date: string
  startAt?: string
  endAt?: string
  link?: string
}

export type GoogleStatus = "loading" | "off" | "disconnected" | "connected" | "error"

/** Data local (YYYY-MM-DD) de um evento do Google. Eventos de dia inteiro já vêm com a data certa. */
export function googleLocalDate(e: CalendarEvent): string {
  if (e.allDay || !e.startAt) return e.date
  return toISO(new Date(e.startAt))
}

/** Horário local "HH:mm" de um evento com hora, ou undefined para dia inteiro. */
export function googleLocalTime(e: CalendarEvent): string | undefined {
  if (e.allDay || !e.startAt) return undefined
  const d = new Date(e.startAt)
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
}

/** Lê o estado da integração e os eventos do período. Os eventos não são salvos no app: sempre vêm do Google. */
export function useGoogleCalendar(from: string, to: string) {
  const [status, setStatus] = React.useState<GoogleStatus>("loading")
  const [events, setEvents] = React.useState<CalendarEvent[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const requestId = React.useRef(0)

  const load = React.useCallback(async () => {
    const id = ++requestId.current
    setStatus((s) => (s === "connected" ? s : "loading"))
    try {
      const s = await fetch("/api/life/google", { cache: "no-store" })
      if (id !== requestId.current) return
      if (!s.ok) return setStatus("off")
      const state = (await s.json()) as { configured: boolean; connected: boolean }
      if (!state.configured) return setStatus("off")
      if (!state.connected) return setStatus("disconnected")

      const r = await fetch(`/api/life/google/events?from=${from}&to=${to}`, { cache: "no-store" })
      if (id !== requestId.current) return
      if (r.status === 409) return setStatus("disconnected")
      const body = (await r.json().catch(() => ({}))) as { events?: CalendarEvent[]; error?: string }
      if (!r.ok || !body.events) throw new Error(body.error ?? "Falha ao carregar")
      setEvents(body.events)
      setError(null)
      setStatus("connected")
    } catch (err) {
      if (id !== requestId.current) return
      setError(err instanceof Error ? err.message : "Falha ao carregar")
      setStatus("error")
    }
  }, [from, to])

  React.useEffect(() => {
    void load()
  }, [load])

  const disconnect = React.useCallback(async () => {
    await fetch("/api/life/google", { method: "DELETE" })
    setEvents([])
    setStatus("disconnected")
  }, [])

  return { status, events, error, reload: load, disconnect }
}
