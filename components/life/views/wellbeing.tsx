"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { HeartPulse, Moon, Sparkles, Wind } from "lucide-react"
import { useLife } from "../store"
import { MOOD_EMOJI, type Checkin, type Mood } from "@/lib/life/types"
import { addDays, formatDayShort, todayISO } from "@/lib/life/dates"
import { Card, Empty, Field, PageHeader, Stat, TextArea, TextInput, haptic } from "../ui"
import { useChartPalette } from "./shared"
import { cn } from "@/lib/utils"

const MOOD_LABEL: Record<Mood, string> = { 1: "Pesado", 2: "Difícil", 3: "Ok", 4: "Bem", 5: "Ótimo" }

function MoodPicker({ value, onChange, label }: { value: Mood | undefined; onChange: (m: Mood) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-2">
      {([1, 2, 3, 4, 5] as Mood[]).map((m) => {
        const active = value === m
        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${MOOD_LABEL[m]} (${m} de 5)`}
            onClick={() => {
              haptic(6)
              onChange(m)
            }}
            className="l-focus flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-2xl border transition-transform active:scale-95"
            style={{
              borderColor: active ? "var(--l-plum)" : "var(--l-border)",
              background: active ? "var(--l-plum-soft)" : "var(--l-surface-2)",
            }}
          >
            <span className="text-2xl leading-none" aria-hidden>{MOOD_EMOJI[m]}</span>
            <span className="l-muted text-[10.5px] font-semibold">{MOOD_LABEL[m]}</span>
          </button>
        )
      })}
    </div>
  )
}

function Breathing() {
  const [running, setRunning] = React.useState(false)
  const [phase, setPhase] = React.useState<"in" | "out">("in")

  React.useEffect(() => {
    if (!running) return
    let current: "in" | "out" = "in"
    setPhase("in")
    haptic(12)
    const id = window.setInterval(() => {
      current = current === "in" ? "out" : "in"
      setPhase(current)
      haptic(10)
    }, 4000)
    return () => window.clearInterval(id)
  }, [running])

  return (
    <Card tint className="flex flex-col items-center gap-5 text-center">
      <div className="w-full text-left">
        <p className="l-eyebrow">Pausa de 1 minuto</p>
        <h2 className="l-display mt-1 text-[20px]">Respirar com calma</h2>
      </div>
      <div className="relative flex h-40 w-40 items-center justify-center" aria-live="polite">
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, var(--l-teal-soft), transparent 70%)",
            transform: running && phase === "in" ? "scale(1)" : "scale(0.72)",
            transition: running ? "transform 4s ease-in-out" : "transform 0.4s ease",
            opacity: running ? 1 : 0.6,
          }}
          aria-hidden
        />
        <span className="l-display relative text-[15px] font-semibold">
          {running ? (phase === "in" ? "Inspire…" : "Solte…") : "Pronta?"}
        </span>
      </div>
      <button type="button" className={cn("l-btn l-focus h-11 w-full", running ? "l-btn-ghost" : "l-btn-primary")} onClick={() => setRunning((r) => !r)}>
        <Wind className="h-4 w-4" aria-hidden /> {running ? "Parar" : "Começar"}
      </button>
    </Card>
  )
}

export function WellbeingView() {
  const { data, update } = useLife()
  const palette = useChartPalette()
  const today = todayISO()
  const existing = data.checkins.find((c) => c.date === today)

  const [mood, setMood] = React.useState<Mood | undefined>(existing?.mood)
  const [energy, setEnergy] = React.useState<Mood | undefined>(existing?.energy)
  const [sleep, setSleep] = React.useState(existing?.sleepHours !== undefined ? String(existing.sleepHours) : "")
  const [gratitude, setGratitude] = React.useState(existing?.gratitude ?? "")
  const [note, setNote] = React.useState(existing?.note ?? "")
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    setMood(existing?.mood)
    setEnergy(existing?.energy)
    setSleep(existing?.sleepHours !== undefined ? String(existing.sleepHours) : "")
    setGratitude(existing?.gratitude ?? "")
    setNote(existing?.note ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.date])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mood || !energy) return
    const sleepNum = Number(sleep.replace(",", "."))
    const entry: Checkin = {
      date: today,
      mood,
      energy,
      sleepHours: sleep && Number.isFinite(sleepNum) && sleepNum >= 0 && sleepNum <= 24 ? sleepNum : undefined,
      gratitude: gratitude.trim() || undefined,
      note: note.trim() || undefined,
    }
    update((prev) => ({ ...prev, checkins: [...prev.checkins.filter((c) => c.date !== today), entry].sort((a, b) => (a.date < b.date ? -1 : 1)) }))
    haptic([10, 40, 10])
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  const series = React.useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => addDays(today, -(13 - i)))
    return days.map((d) => {
      const c = data.checkins.find((x) => x.date === d)
      return { d, label: formatDayShort(d).slice(0, 5), mood: c?.mood ?? null, energy: c?.energy ?? null }
    })
  }, [data.checkins, today])

  const week = data.checkins.filter((c) => c.date > addDays(today, -7) && c.date <= today)
  const avgMood = week.length ? week.reduce((s, c) => s + c.mood, 0) / week.length : null
  const avgSleep = (() => {
    const s = week.filter((c) => c.sleepHours !== undefined)
    return s.length ? s.reduce((a, c) => a + (c.sleepHours ?? 0), 0) / s.length : null
  })()

  const recent = [...data.checkins].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 7)

  return (
    <div>
      <PageHeader eyebrow="Pessoas & mente" title="Bem-estar" description="Um minuto por dia para perceber como você está. Sem julgamento." />

      <div className="grid gap-4 lg:grid-cols-5">
        <form onSubmit={save} className="space-y-5 lg:col-span-3">
          <Card>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="l-eyebrow">Check-in de hoje</p>
                <h2 className="l-display mt-1 text-[20px]">Como você está?</h2>
              </div>
              {existing && <span className="l-chip" style={{ background: "var(--l-mint-soft)", color: "var(--l-mint)" }}>Registrado</span>}
            </div>
            <div className="space-y-6">
              <Field label="Humor">
                <MoodPicker value={mood} onChange={setMood} label="Humor" />
              </Field>
              <Field label="Energia">
                <MoodPicker value={energy} onChange={setEnergy} label="Energia" />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Horas de sono" hint="Ontem à noite">
                  <TextInput inputMode="decimal" value={sleep} onChange={(e) => setSleep(e.target.value)} placeholder="7,5" />
                </Field>
                <Field label="Uma gratidão de hoje">
                  <TextInput value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="Ex.: o café da manhã com os gatos" maxLength={160} />
                </Field>
              </div>
              <Field label="Algo que queira registrar?" hint="Opcional">
                <TextArea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Como foi o dia, o que pesou, o que deu certo…" />
              </Field>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              {saved && <span role="status" className="text-sm font-semibold" style={{ color: "var(--l-ok)" }}>Salvo ✓</span>}
              <button type="submit" className="l-btn l-btn-plum l-focus h-12 px-6" disabled={!mood || !energy}>
                Salvar check-in
              </button>
            </div>
          </Card>
        </form>

        <div className="space-y-4 lg:col-span-2">
          <Breathing />
          <Card>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Humor médio" value={avgMood ? avgMood.toFixed(1).replace(".", ",") : "—"} hint="7 dias" />
              <Stat label="Sono médio" value={avgSleep ? `${avgSleep.toFixed(1).replace(".", ",")}h` : "—"} hint="7 dias" />
              <Stat label="Check-ins" value={data.checkins.length} hint="no total" />
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="l-display text-[19px]">Últimas 2 semanas</h2>
          <div className="l-muted flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: palette.plum }} />Humor</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: palette.mint }} />Energia</span>
          </div>
        </div>
        <div className="h-[220px] w-full">
          {series.every((s) => s.mood === null) ? (
            <Empty icon={HeartPulse} title="Sem histórico ainda" text="Seus check-ins aparecem aqui em forma de linha do tempo." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: palette.muted, fontSize: 11 }} interval={1} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickLine={false} axisLine={false} tick={{ fill: palette.muted, fontSize: 11 }} />
                <Tooltip contentStyle={{ background: palette.surface, border: `1px solid ${palette.grid}`, borderRadius: 12, fontSize: 13 }} />
                <Line type="monotone" dataKey="mood" name="Humor" stroke={palette.plum} strokeWidth={2.5} dot={{ r: 3.5, strokeWidth: 0, fill: palette.plum }} connectNulls />
                <Line type="monotone" dataKey="energy" name="Energia" stroke={palette.mint} strokeWidth={2} strokeDasharray="5 4" dot={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      {recent.length > 0 && (
        <section className="mt-6" aria-labelledby="recent-ci">
          <h2 id="recent-ci" className="l-display mb-3 flex items-center gap-2 text-[19px]"><Sparkles className="h-4 w-4" aria-hidden /> Registros recentes</h2>
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {recent.map((c) => (
              <li key={c.date}>
                <Card className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="l-eyebrow">{formatDayShort(c.date)}</p>
                    <span className="text-2xl" aria-label={MOOD_LABEL[c.mood]}>{MOOD_EMOJI[c.mood]}</span>
                  </div>
                  <p className="l-muted mt-2 flex items-center gap-3 text-xs font-semibold">
                    <span>Energia {c.energy}/5</span>
                    {c.sleepHours !== undefined && <span className="flex items-center gap-1"><Moon className="h-3 w-3" aria-hidden /> {c.sleepHours}h</span>}
                  </p>
                  {c.gratitude && <p className="mt-2 text-sm">🌿 {c.gratitude}</p>}
                  {c.note && <p className="l-ink-2 mt-2 line-clamp-3 text-sm leading-relaxed">{c.note}</p>}
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
