"use client"

import * as React from "react"
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { useLife } from "../store"
import { AREAS, AREA_IDS, type AreaId, type CalEvent } from "@/lib/life/types"
import { daysInMonth, formatMonthTitle, monthKey, parseISO, shiftMonth, todayISO, toISO } from "@/lib/life/dates"
import { AddButton, Card, Empty, Field, PageHeader, Select, Sheet, TextInput, haptic } from "../ui"
import { RowActions, emptyToUndef } from "./shared"
import { cn } from "@/lib/utils"

function EventSheet({ open, onOpenChange, event, defaultDate }: { open: boolean; onOpenChange: (o: boolean) => void; event: CalEvent | null; defaultDate: string }) {
  const { add, patch } = useLife()
  const [title, setTitle] = React.useState("")
  const [date, setDate] = React.useState(defaultDate)
  const [time, setTime] = React.useState("")
  const [area, setArea] = React.useState<AreaId>("pessoal")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setTitle(event?.title ?? "")
    setDate(event?.date ?? defaultDate)
    setTime(event?.time ?? "")
    setArea(event?.area ?? "pessoal")
    setNotes(event?.notes ?? "")
  }, [open, event, defaultDate])

  const valid = title.trim().length > 0 && !!date

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    const payload = { title: title.trim(), date, time: emptyToUndef(time), area, notes: emptyToUndef(notes) }
    if (event) patch("events", event.id, payload)
    else add("events", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={event ? "Editar compromisso" : "Novo compromisso"}
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="Título">
          <TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: consulta veterinária" maxLength={120} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Data" className="sm:col-span-1">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Horário" hint="Opcional">
            <TextInput type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
          <Field label="Área">
            <Select value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
              {AREA_IDS.map((a) => <option key={a} value={a}>{AREAS[a].label}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Notas" hint="Opcional">
          <textarea className="l-input min-h-[72px] resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </form>
    </Sheet>
  )
}

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

export function CalendarView() {
  const { data, remove } = useLife()
  const today = todayISO()
  const [month, setMonth] = React.useState(monthKey(today))
  const [selected, setSelected] = React.useState(today)
  const [sheet, setSheet] = React.useState<{ open: boolean; event: CalEvent | null }>({ open: false, event: null })

  // Marcadores por dia: eventos, tarefas com prazo, lembretes, viagens.
  const markers = React.useMemo(() => {
    const map = new Map<string, { events: number; tasks: number; reminders: number; trips: number }>()
    const get = (d: string) => {
      let m = map.get(d)
      if (!m) {
        m = { events: 0, tasks: 0, reminders: 0, trips: 0 }
        map.set(d, m)
      }
      return m
    }
    data.events.forEach((e) => get(e.date).events++)
    data.tasks.forEach((t) => t.due && !t.done && get(t.due).tasks++)
    data.reminders.forEach((r) => get(r.date).reminders++)
    data.trips.forEach((t) => {
      if (t.start) get(t.start).trips++
      if (t.end) get(t.end).trips++
    })
    return map
  }, [data])

  const first = parseISO(`${month}-01`)
  const offset = (first.getDay() + 6) % 7
  const total = daysInMonth(month)
  const cells: (string | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, i) => toISO(new Date(first.getFullYear(), first.getMonth(), i + 1))),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const dayItems = React.useMemo(() => {
    const events = data.events.filter((e) => e.date === selected).sort((a, b) => (a.time ?? "").localeCompare(b.time ?? ""))
    const tasks = data.tasks.filter((t) => t.due === selected)
    const reminders = data.reminders.filter((r) => r.date === selected)
    const trips = data.trips.filter((t) => t.start === selected || t.end === selected)
    return { events, tasks, reminders, trips }
  }, [data, selected])

  const hasItems = dayItems.events.length + dayItems.tasks.length + dayItems.reminders.length + dayItems.trips.length > 0

  const goTo = (iso: string) => {
    setSelected(iso)
    setMonth(monthKey(iso))
  }

  return (
    <div>
      <PageHeader
        eyebrow="Dia a dia"
        title="Calendário"
        description="Eventos, prazos, lembretes e viagens num só lugar."
        action={<AddButton label="Compromisso" onClick={() => setSheet({ open: true, event: null })} />}
      />

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button type="button" className="l-btn-icon l-focus" onClick={() => setMonth((m) => shiftMonth(m, -1))} aria-label="Mês anterior">
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <h2 className="l-display min-w-[170px] text-center text-[20px]">{formatMonthTitle(month)}</h2>
              <button type="button" className="l-btn-icon l-focus" onClick={() => setMonth((m) => shiftMonth(m, 1))} aria-label="Próximo mês">
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <button type="button" className="l-btn l-btn-ghost l-focus h-11 px-4" onClick={() => goTo(today)}>Hoje</button>
          </div>

          <div className="grid grid-cols-7 gap-1 pb-2" aria-hidden>
            {WEEKDAYS.map((w) => (
              <span key={w} className="l-eyebrow text-center">{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1" role="grid" aria-label={formatMonthTitle(month)}>
            {cells.map((d, i) => {
              if (!d) return <span key={`e-${i}`} aria-hidden />
              const m = markers.get(d)
              const isToday = d === today
              const isSel = d === selected
              const dayNum = parseISO(d).getDate()
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    haptic(4)
                    setSelected(d)
                  }}
                  aria-pressed={isSel}
                  aria-label={`${dayNum} de ${formatMonthTitle(month)}${m ? `, ${m.events + m.tasks + m.reminders + m.trips} itens` : ""}`}
                  className={cn(
                    "l-focus relative flex aspect-square min-h-[44px] flex-col items-center justify-center gap-1 rounded-2xl text-[15px] font-semibold transition-colors",
                    isSel ? "bg-[var(--l-plum)] text-white" : "hover:bg-[var(--l-surface-2)]",
                    isToday && !isSel && "outline outline-2 -outline-offset-2 outline-[var(--l-plum)]"
                  )}
                >
                  {dayNum}
                  <span className="flex h-1.5 items-center gap-0.5">
                    {m?.events ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: isSel ? "#fff" : "var(--l-sky)" }} /> : null}
                    {m?.tasks ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: isSel ? "#fff" : "var(--l-coral)" }} /> : null}
                    {m?.reminders ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: isSel ? "#fff" : "var(--l-mustard)" }} /> : null}
                    {m?.trips ? <span className="h-1.5 w-1.5 rounded-full" style={{ background: isSel ? "#fff" : "var(--l-teal)" }} /> : null}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="l-muted mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--l-sky)" }} />Compromisso</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--l-coral)" }} />Tarefa com prazo</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--l-mustard)" }} />Lembrete</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--l-teal)" }} />Viagem</span>
          </div>
        </Card>

        <Card>
          <p className="l-eyebrow">Dia selecionado</p>
          <h2 className="l-display mt-1 mb-4 text-[22px] capitalize">
            {parseISO(selected).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </h2>
          {!hasItems ? (
            <Empty
              icon={CalendarDays}
              title="Dia livre"
              text="Nada marcado para este dia."
              action={<AddButton label="Adicionar aqui" onClick={() => setSheet({ open: true, event: null })} />}
            />
          ) : (
            <ul className="space-y-2">
              {dayItems.events.map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: "var(--l-border)" }}>
                  <span className={cn("h-10 w-1.5 shrink-0 rounded-full", `area-bar-${AREAS[e.area].color}`)} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{e.title}</p>
                    <p className="l-muted flex items-center gap-1 text-xs">
                      {e.time ? <><Clock className="h-3 w-3" aria-hidden /> {e.time}</> : "dia inteiro"} · {AREAS[e.area].label}
                    </p>
                  </div>
                  <RowActions label={e.title} onEdit={() => setSheet({ open: true, event: e })} onDelete={() => remove("events", e.id)} />
                </li>
              ))}
              {dayItems.tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--l-bg-2)" }}>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--l-coral)" }} aria-hidden />
                  <p className={cn("min-w-0 flex-1 truncate text-sm", t.done && "line-through")}>Tarefa: {t.title}</p>
                </li>
              ))}
              {dayItems.reminders.map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--l-bg-2)" }}>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--l-mustard)" }} aria-hidden />
                  <p className="min-w-0 flex-1 truncate text-sm">Lembrete: {r.label}</p>
                </li>
              ))}
              {dayItems.trips.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "var(--l-bg-2)" }}>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--l-teal)" }} aria-hidden />
                  <p className="min-w-0 flex-1 truncate text-sm">Viagem: {t.destination}</p>
                </li>
              ))}
            </ul>
          )}
          {selected !== today && (
            <button type="button" className="l-btn l-btn-ghost l-focus mt-5 h-11 w-full" onClick={() => goTo(today)}>
              Voltar para hoje
            </button>
          )}
        </Card>
      </div>

      <EventSheet
        open={sheet.open}
        onOpenChange={(open) => setSheet((s) => ({ ...s, open }))}
        event={sheet.event}
        defaultDate={selected}
      />
    </div>
  )
}
