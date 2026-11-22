"use client"

import * as React from "react"
import { Plane, Plus, Trash2 } from "lucide-react"
import { useLife } from "../store"
import type { Trip } from "@/lib/life/types"
import { diffDays, formatDayShort, todayISO } from "@/lib/life/dates"
import { formatBRL, centsToInput, parseBRLToCents } from "@/lib/life/format"
import { AddButton, Card, Check, Empty, Field, PageHeader, ProgressBar, Sheet, TextInput, haptic } from "../ui"
import { RowActions, emptyToUndef } from "./shared"
import { cn } from "@/lib/utils"

function TripSheet({ open, onOpenChange, trip }: { open: boolean; onOpenChange: (o: boolean) => void; trip: Trip | null }) {
  const { add, patch } = useLife()
  const [destination, setDestination] = React.useState("")
  const [start, setStart] = React.useState("")
  const [end, setEnd] = React.useState("")
  const [budget, setBudget] = React.useState("")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setDestination(trip?.destination ?? "")
    setStart(trip?.start ?? "")
    setEnd(trip?.end ?? "")
    setBudget(centsToInput(trip?.budgetCents))
    setNotes(trip?.notes ?? "")
  }, [open, trip])

  const valid = destination.trim().length > 0

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    const payload = {
      destination: destination.trim(),
      start: emptyToUndef(start),
      end: emptyToUndef(end),
      budgetCents: parseBRLToCents(budget) ?? undefined,
      notes: emptyToUndef(notes),
    }
    if (trip) patch("trips", trip.id, payload)
    else add("trips", { ...payload, checklist: DEFAULT_CHECKLIST.map((text, i) => ({ id: `c${i}-${Date.now()}`, text, done: false })) })
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={trip ? "Editar viagem" : "Nova viagem"}
      description="Destino, datas e orçamento. A lista de preparação já vem pronta."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="Destino">
          <TextInput autoFocus value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ex.: Orlando" maxLength={100} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Ida">
            <TextInput type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="Volta">
            <TextInput type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
        </div>
        <Field label="Orçamento" hint="Opcional">
          <div className="relative">
            <span className="l-muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm">R$</span>
            <TextInput inputMode="decimal" className="pl-11" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="0,00" />
          </div>
        </Field>
        <Field label="Notas" hint="Opcional">
          <textarea className="l-input min-h-[72px] resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </form>
    </Sheet>
  )
}

const DEFAULT_CHECKLIST = [
  "Passaporte / documentos",
  "Reservas de voo e hotel",
  "Seguro viagem",
  "Carregadores e adaptador",
  "Quem cuida dos gatos",
  "Câmbio ou cartão internacional",
]

function TripCard({ trip }: { trip: Trip }) {
  const { patch, remove } = useLife()
  const [sheet, setSheet] = React.useState(false)
  const [newItem, setNewItem] = React.useState("")
  const today = todayISO()
  const done = trip.checklist.filter((c) => c.done).length
  const pct = trip.checklist.length ? (done / trip.checklist.length) * 100 : 0

  const countdown = trip.start
    ? trip.start > today
      ? { value: diffDays(today, trip.start), label: "dias para ir" }
      : trip.end && trip.end >= today
        ? { value: 0, label: "você está viajando" }
        : { value: 0, label: "viagem concluída" }
    : null

  const setChecklist = (checklist: Trip["checklist"]) => patch("trips", trip.id, { checklist })

  const addItem = (e: React.FormEvent) => {
    e.preventDefault()
    const text = newItem.trim()
    if (!text) return
    setChecklist([...trip.checklist, { id: `i-${Date.now()}`, text, done: false }])
    setNewItem("")
    haptic(6)
  }

  return (
    <Card className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="l-eyebrow flex items-center gap-1.5"><Plane className="h-3.5 w-3.5" aria-hidden /> {trip.start ? formatDayShort(trip.start) : "data a definir"}{trip.end ? ` → ${formatDayShort(trip.end)}` : ""}</p>
          <h2 className="l-display mt-2 text-[24px] leading-tight">{trip.destination}</h2>
        </div>
        <RowActions label={trip.destination} onEdit={() => setSheet(true)} onDelete={() => remove("trips", trip.id)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-3" style={{ background: "var(--l-sky-soft)" }}>
          <p className="l-eyebrow" style={{ color: "var(--l-sky)" }}>{countdown ? countdown.label : "Contagem"}</p>
          <p className="l-display mt-1 text-[24px] leading-none" style={{ color: "var(--l-sky)" }}>
            {countdown && countdown.value > 0 ? countdown.value : countdown ? "•" : "—"}
          </p>
        </div>
        <div className="rounded-2xl p-3" style={{ background: "var(--l-bg-2)" }}>
          <p className="l-eyebrow">Orçamento</p>
          <p className="l-display mt-1 text-[20px] leading-none">{trip.budgetCents ? formatBRL(trip.budgetCents) : "—"}</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-xs">
          <span className="l-muted font-semibold">Preparação</span>
          <span className="font-semibold">{done}/{trip.checklist.length}</span>
        </div>
        <ProgressBar value={pct} color="sky" label={`Preparação para ${trip.destination}`} />
      </div>

      <ul className="space-y-0.5">
        {trip.checklist.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <Check
              label={item.text}
              checked={item.done}
              onChange={(v) => setChecklist(trip.checklist.map((c) => (c.id === item.id ? { ...c, done: v } : c)))}
            />
            <span className={cn("min-w-0 flex-1 text-[14.5px]", item.done && "l-muted line-through")}>{item.text}</span>
            <button
              type="button"
              className="l-btn-icon l-focus h-11 w-11"
              aria-label={`Remover ${item.text}`}
              onClick={() => setChecklist(trip.checklist.filter((c) => c.id !== item.id))}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={addItem} className="mt-auto flex gap-2">
        <TextInput value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Adicionar item à lista" aria-label="Novo item da preparação" maxLength={120} />
        <button type="submit" className="l-btn l-btn-ghost l-focus h-11 shrink-0 px-3" aria-label="Adicionar item" disabled={!newItem.trim()}>
          <Plus className="h-4 w-4" aria-hidden />
        </button>
      </form>

      <TripSheet open={sheet} onOpenChange={setSheet} trip={trip} />
    </Card>
  )
}

export function TripsView() {
  const { data } = useLife()
  const [sheet, setSheet] = React.useState<{ open: boolean }>({ open: false })
  const today = todayISO()
  const trips = [...data.trips].sort((a, b) => {
    const aa = a.end && a.end < today ? 1 : 0
    const bb = b.end && b.end < today ? 1 : 0
    if (aa !== bb) return aa - bb
    return (a.start ?? "9999") < (b.start ?? "9999") ? -1 : 1
  })

  return (
    <div>
      <PageHeader
        eyebrow="Vida & casa"
        title="Viagens"
        description="Sonhos com data, lista de preparação e orçamento."
        action={<AddButton label="Nova viagem" onClick={() => setSheet({ open: true })} />}
      />

      {trips.length === 0 ? (
        <Card>
          <Empty icon={Plane} title="Nenhuma viagem planejada" text="Cadastre o destino: a lista de preparação e a contagem regressiva aparecem prontas." action={<AddButton label="Planejar viagem" onClick={() => setSheet({ open: true })} />} />
        </Card>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {trips.map((t) => (
            <li key={t.id}>
              <TripCard trip={t} />
            </li>
          ))}
        </ul>
      )}

      <TripSheet open={sheet.open} onOpenChange={(open) => setSheet({ open })} trip={null} />
    </div>
  )
}
