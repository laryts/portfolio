"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Flame, Repeat } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useLife } from "../store"
import { AREAS, AREA_IDS, type AreaId, type Habit } from "@/lib/life/types"
import { addDays, diffDays, parseISO, todayISO } from "@/lib/life/dates"
import { habitDone, habitRate, habitStreak } from "@/lib/life/selectors"
import { AddButton, AreaBadge, Card, Empty, Field, PageHeader, Select, Sheet, TextInput, haptic } from "../ui"
import { RowActions, useChartPalette } from "./shared"
import { cn } from "@/lib/utils"

const GRID_DAYS = 21

function HabitSheet({ open, onOpenChange, habit }: { open: boolean; onOpenChange: (o: boolean) => void; habit: Habit | null }) {
  const { add, patch } = useLife()
  const [name, setName] = React.useState("")
  const [area, setArea] = React.useState<AreaId>("saude")

  React.useEffect(() => {
    if (!open) return
    setName(habit?.name ?? "")
    setArea(habit?.area ?? "saude")
  }, [open, habit])

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!name.trim()) return
    if (habit) patch("habits", habit.id, { name: name.trim(), area })
    else add("habits", { name: name.trim(), area, doneDates: [] })
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={habit ? "Editar hábito" : "Novo hábito"}
      description="Pequeno e repetível vence o perfeito e raro."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!name.trim()} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="Hábito">
          <TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: caminhar 20 min" maxLength={80} />
        </Field>
        <Field label="Área">
          <Select value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
            {AREA_IDS.map((a) => (
              <option key={a} value={a}>{AREAS[a].label}</option>
            ))}
          </Select>
        </Field>
      </form>
    </Sheet>
  )
}

function HabitCard({ habit }: { habit: Habit }) {
  const { patch, remove } = useLife()
  const [editing, setEditing] = React.useState(false)
  const today = todayISO()
  const streak = habitStreak(habit, today)
  const rate7 = habitRate(habit, 7, today)
  const rate30 = habitRate(habit, 30, today)
  const doneToday = habitDone(habit, today)

  const toggleDay = (date: string) => {
    const done = habit.doneDates.includes(date)
    patch("habits", habit.id, {
      doneDates: done ? habit.doneDates.filter((d) => d !== date) : [...habit.doneDates, date],
    })
    haptic(done ? 4 : [10, 30, 10])
  }

  const days = Array.from({ length: GRID_DAYS }, (_, i) => addDays(today, -(GRID_DAYS - 1 - i)))

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <AreaBadge area={habit.area} />
          <h2 className="l-display mt-3 text-[20px] leading-snug">{habit.name}</h2>
        </div>
        <RowActions
          label={habit.name}
          onEdit={() => setEditing(true)}
          onDelete={() => remove("habits", habit.id)}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl p-3" style={{ background: "var(--l-bg-2)" }}>
          <p className="l-eyebrow">Sequência</p>
          <p className="l-display mt-1 flex items-center gap-1 text-[22px] leading-none" style={{ color: streak ? "var(--l-coral)" : undefined }}>
            {streak > 0 && <Flame className="h-4 w-4" aria-hidden />}
            {streak}
            <span className="text-[12px] font-semibold text-[var(--l-muted)]">d</span>
          </p>
        </div>
        <div className="rounded-2xl p-3" style={{ background: "var(--l-bg-2)" }}>
          <p className="l-eyebrow">7 dias</p>
          <p className="l-display mt-1 text-[22px] leading-none">{rate7}%</p>
        </div>
        <div className="rounded-2xl p-3" style={{ background: "var(--l-bg-2)" }}>
          <p className="l-eyebrow">30 dias</p>
          <p className="l-display mt-1 text-[22px] leading-none">{rate30}%</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="l-muted text-xs font-semibold">Últimas 3 semanas · toque para ajustar</p>
        </div>
        <div className="grid grid-cols-7 gap-1.5" role="group" aria-label={`Registro de ${habit.name}`}>
          {days.map((d) => {
            const done = habitDone(habit, d)
            const isToday = d === today
            const label = parseISO(d).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                aria-pressed={done}
                aria-label={`${label}: ${done ? "feito" : "não feito"}`}
                className={cn(
                  "l-focus flex aspect-square min-h-[36px] items-center justify-center rounded-xl text-[11px] font-semibold transition-transform active:scale-90",
                  isToday && "outline outline-2 outline-offset-2 outline-[var(--l-plum)]"
                )}
                style={{
                  background: done ? "var(--l-teal)" : "var(--l-bg-2)",
                  color: done ? "#fff" : "var(--l-muted)",
                }}
              >
                {parseISO(d).getDate()}
              </button>
            )
          })}
        </div>
      </div>

      {doneToday ? (
        <p className="text-xs font-semibold" style={{ color: "var(--l-teal)" }}>Feito hoje ✓</p>
      ) : (
        <button type="button" className="l-btn l-btn-ghost l-focus h-11 w-full" onClick={() => toggleDay(today)}>
          <Repeat className="h-4 w-4" aria-hidden /> Marcar hoje
        </button>
      )}

      <HabitSheet open={editing} onOpenChange={setEditing} habit={habit} />
    </Card>
  )
}

/** Estatísticas de um hábito dentro de um ano (até hoje, se for o ano atual). */
function yearStats(doneDates: string[], year: number, today: string) {
  const y = String(year)
  const done = new Set(doneDates.filter((d) => d.startsWith(`${y}-`)))
  const end = year === Number(today.slice(0, 4)) ? today : `${y}-12-31`
  const possible = diffDays(`${y}-01-01`, end) + 1
  let longest = 0
  let run = 0
  for (let d = `${y}-01-01`; d <= end; d = addDays(d, 1)) {
    if (done.has(d)) {
      run++
      longest = Math.max(longest, run)
    } else run = 0
  }
  return { done, possible, end, longest, count: done.size, rate: possible ? Math.round((done.size / possible) * 100) : 0 }
}

/** Mapa de calor do ano, no estilo do grafo de contribuições: colunas são semanas (segunda no topo). */
function YearHeatmap({ year, done, end, label }: { year: number; done: Set<string>; end: string; label: string }) {
  const start = (() => {
    const jan1 = parseISO(`${year}-01-01`)
    const back = (jan1.getDay() + 6) % 7
    return addDays(`${year}-01-01`, -back)
  })()
  const weeks = Math.ceil((diffDays(start, `${year}-12-31`) + 1) / 7)
  const cells: { date: string; inRange: boolean; done: boolean }[] = []
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d)
      const inYear = date.startsWith(`${year}-`)
      cells.push({ date, inRange: inYear && date <= end, done: done.has(date) })
    }
  }
  return (
    <div className="l-scroll-x overflow-x-auto pb-1">
      <div
        role="img"
        aria-label={label}
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${weeks}, 11px)`, gridTemplateRows: "repeat(7, 11px)", gridAutoFlow: "column" }}
      >
        {cells.map((c) => (
          <span
            key={c.date}
            title={c.inRange ? `${parseISO(c.date).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}${c.done ? " · feito" : ""}` : undefined}
            className="rounded-[3px]"
            style={{
              background: !c.inRange || !c.date.startsWith(`${year}-`)
                ? "transparent"
                : c.done
                  ? "var(--l-teal)"
                  : "var(--l-bg-2)",
              opacity: c.inRange ? 1 : 0.35,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function YearOverview({ habits, year, today }: { habits: Habit[]; year: number; today: string }) {
  const palette = useChartPalette()
  const stats = habits.map((h) => ({ habit: h, ...yearStats(h.doneDates, year, today) }))
  const totalDone = stats.reduce((s, x) => s + x.count, 0)
  const totalPossible = stats.reduce((s, x) => s + x.possible, 0)
  const overallRate = totalPossible ? Math.round((totalDone / totalPossible) * 100) : 0
  const bestStreak = stats.reduce((m, x) => Math.max(m, x.longest), 0)
  const bestHabit = [...stats].sort((a, b) => b.rate - a.rate)[0]

  const monthly = Array.from({ length: 12 }, (_, m) => {
    const prefix = `${year}-${String(m + 1).padStart(2, "0")}-`
    let done = 0
    let possible = 0
    for (const x of stats) {
      for (const d of x.done) if (d.startsWith(prefix)) done++
      // dias do mês que já passaram (até o fim do período calculado)
      const monthEnd = `${prefix}${String(new Date(year, m + 1, 0).getDate()).padStart(2, "0")}`
      const last = monthEnd < x.end ? monthEnd : x.end
      if (last >= `${prefix}01`) possible += diffDays(`${prefix}01`, last) + 1
    }
    return {
      label: parseISO(`${year}-${String(m + 1).padStart(2, "0")}-01`).toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      taxa: possible ? Math.round((done / possible) * 100) : 0,
    }
  })

  return (
    <Card className="mb-8">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <div>
          <p className="l-eyebrow">Dias feitos</p>
          <p className="l-display mt-1 text-[28px] leading-none">{totalDone}</p>
          <p className="l-muted mt-1 text-xs">de {totalPossible} possíveis</p>
        </div>
        <div>
          <p className="l-eyebrow">Taxa do ano</p>
          <p className="l-display mt-1 text-[28px] leading-none">{overallRate}%</p>
          <p className="l-muted mt-1 text-xs">todos os hábitos</p>
        </div>
        <div>
          <p className="l-eyebrow">Maior sequência</p>
          <p className="l-display mt-1 flex items-center gap-1 text-[28px] leading-none" style={{ color: bestStreak ? "var(--l-coral)" : undefined }}>
            {bestStreak > 0 && <Flame className="h-5 w-5" aria-hidden />}
            {bestStreak}
          </p>
          <p className="l-muted mt-1 text-xs">dias seguidos</p>
        </div>
        <div>
          <p className="l-eyebrow">Mais consistente</p>
          <p className="mt-1 truncate text-[15px] font-semibold">{bestHabit ? bestHabit.habit.name : "—"}</p>
          <p className="l-muted mt-1 text-xs">{bestHabit ? `${bestHabit.rate}% do ano` : ""}</p>
        </div>
      </div>

      <div className="mt-6 h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: palette.muted, fontSize: 11 }} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: palette.muted, fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: palette.surface, border: `1px solid ${palette.grid}`, borderRadius: 12, fontSize: 13 }} cursor={{ fill: palette.grid, opacity: 0.4 }} />
            <Bar dataKey="taxa" name="Taxa" fill={palette.teal} radius={[6, 6, 0, 0]} maxBarSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="l-eyebrow">Um quadradinho por dia</p>
          <div className="l-muted flex items-center gap-2 text-[11px]">
            Menos
            {[0, 1].map((i) => (
              <span key={i} className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: i ? "var(--l-teal)" : "var(--l-bg-2)" }} />
            ))}
            Mais
          </div>
        </div>
        {stats.map((x) => (
          <div key={x.habit.id} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="truncate font-semibold">{x.habit.name}</span>
              <span className="l-muted shrink-0 text-xs">{x.count} {x.count === 1 ? "dia" : "dias"} · {x.rate}%</span>
            </div>
            <YearHeatmap year={year} done={x.done} end={x.end} label={`${x.habit.name}: ${x.count} dias feitos em ${year}`} />
          </div>
        ))}
      </div>
    </Card>
  )
}

export function HabitsView() {
  const { data } = useLife()
  const [sheet, setSheet] = React.useState<{ open: boolean }>({ open: false })
  const [overview, setOverview] = React.useState(false)
  const today = todayISO()
  const [year, setYear] = React.useState(Number(today.slice(0, 4)))
  const doneToday = data.habits.filter((h) => habitDone(h, today)).length

  return (
    <div>
      <PageHeader
        eyebrow="Dia a dia"
        title="Hábitos"
        description={
          data.habits.length
            ? `${doneToday} de ${data.habits.length} feitos hoje`
            : "Constância mora nos detalhes. Comece com um só."
        }
        action={
          <>
            {data.habits.length > 0 && (
              <button type="button" className="l-btn l-btn-ghost l-focus" aria-pressed={overview} onClick={() => setOverview((v) => !v)}>
                {overview ? "Ver semanas" : "Visão anual"}
              </button>
            )}
            <AddButton label="Novo hábito" onClick={() => setSheet({ open: true })} />
          </>
        }
      />

      {overview && data.habits.length > 0 && (
        <>
          <div className="mb-4 flex items-center gap-1">
            <button type="button" className="l-btn-icon l-focus" onClick={() => setYear((y) => y - 1)} aria-label="Ano anterior">
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <p className="l-display min-w-[80px] text-center text-[20px]">{year}</p>
            <button
              type="button"
              className="l-btn-icon l-focus"
              onClick={() => setYear((y) => y + 1)}
              disabled={year >= Number(today.slice(0, 4))}
              aria-label="Próximo ano"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <YearOverview habits={data.habits} year={year} today={today} />
        </>
      )}

      {!overview && data.habits.length === 0 ? (
        <Card>
          <Empty
            icon={Repeat}
            title="Sem hábitos ainda"
            text="Água, caminhada, leitura, um momento sem tela. Você escolhe."
            action={<AddButton label="Criar hábito" onClick={() => setSheet({ open: true })} />}
          />
        </Card>
      ) : !overview ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.habits.map((h) => (
            <HabitCard key={h.id} habit={h} />
          ))}
        </div>
      ) : null}

      <HabitSheet open={sheet.open} onOpenChange={(open) => setSheet({ open })} habit={null} />
    </div>
  )
}
