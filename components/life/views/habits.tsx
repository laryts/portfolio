"use client"

import * as React from "react"
import { Flame, Repeat } from "lucide-react"
import { useLife } from "../store"
import { AREAS, AREA_IDS, type AreaId, type Habit } from "@/lib/life/types"
import { addDays, parseISO, todayISO } from "@/lib/life/dates"
import { habitDone, habitRate, habitStreak } from "@/lib/life/selectors"
import { AddButton, AreaBadge, Card, Empty, Field, PageHeader, Select, Sheet, TextInput, haptic } from "../ui"
import { RowActions } from "./shared"
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

export function HabitsView() {
  const { data } = useLife()
  const [sheet, setSheet] = React.useState<{ open: boolean }>({ open: false })
  const today = todayISO()
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
        action={<AddButton label="Novo hábito" onClick={() => setSheet({ open: true })} />}
      />

      {data.habits.length === 0 ? (
        <Card>
          <Empty
            icon={Repeat}
            title="Sem hábitos ainda"
            text="Água, caminhada, leitura, um momento sem tela. Você escolhe."
            action={<AddButton label="Criar hábito" onClick={() => setSheet({ open: true })} />}
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.habits.map((h) => (
            <HabitCard key={h.id} habit={h} />
          ))}
        </div>
      )}

      <HabitSheet open={sheet.open} onOpenChange={(open) => setSheet({ open })} habit={null} />
    </div>
  )
}
