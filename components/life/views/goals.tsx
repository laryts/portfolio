"use client"

import * as React from "react"
import { Minus, Plus, Target } from "lucide-react"
import { useLife } from "../store"
import { AREAS, AREA_IDS, type AreaId, type Goal } from "@/lib/life/types"
import { formatDayShort, diffDays, todayISO } from "@/lib/life/dates"
import { formatBRL } from "@/lib/life/format"
import { AddButton, AreaBadge, Card, Empty, Field, PageHeader, ProgressBar, Select, Sheet, TextInput, haptic } from "../ui"
import { RowActions, emptyToUndef, parseFloatSafe } from "./shared"

const UNIT_PRESETS = ["R$", "livros", "km", "%", "vezes", "dias"]

function GoalSheet({ open, onOpenChange, goal }: { open: boolean; onOpenChange: (o: boolean) => void; goal: Goal | null }) {
  const { add, patch } = useLife()
  const [title, setTitle] = React.useState("")
  const [area, setArea] = React.useState<AreaId>("pessoal")
  const [unit, setUnit] = React.useState("R$")
  const [current, setCurrent] = React.useState("0")
  const [target, setTarget] = React.useState("100")
  const [deadline, setDeadline] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setTitle(goal?.title ?? "")
    setArea(goal?.area ?? "pessoal")
    setUnit(goal?.unit ?? "R$")
    setCurrent(String(goal?.current ?? 0))
    setTarget(String(goal?.target ?? 100))
    setDeadline(goal?.deadline ?? "")
  }, [open, goal])

  const targetNum = parseFloatSafe(target, 0)
  const valid = title.trim().length > 0 && targetNum > 0

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    const payload = {
      title: title.trim(),
      area,
      unit: unit.trim() || "un",
      current: Math.max(0, parseFloatSafe(current, 0)),
      target: targetNum,
      deadline: emptyToUndef(deadline),
    }
    if (goal) patch("goals", goal.id, payload)
    else add("goals", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={goal ? "Editar meta" : "Nova meta"}
      description="Uma meta com número é mais fácil de sustentar."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="Meta">
          <TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Juntar para a viagem" maxLength={120} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Área">
            <Select value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
              {AREA_IDS.map((a) => (
                <option key={a} value={a}>{AREAS[a].label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Prazo" hint="Opcional">
            <TextInput type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Unidade" className="col-span-1">
            <TextInput list="unit-presets" value={unit} onChange={(e) => setUnit(e.target.value)} maxLength={12} />
            <datalist id="unit-presets">
              {UNIT_PRESETS.map((u) => <option key={u} value={u} />)}
            </datalist>
          </Field>
          <Field label="Já tenho" className="col-span-1">
            <TextInput inputMode="decimal" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </Field>
          <Field label="Alvo" className="col-span-1">
            <TextInput inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
          </Field>
        </div>
        {!valid && title.length > 0 && <p className="text-xs" style={{ color: "var(--l-danger)" }}>O alvo precisa ser maior que zero.</p>}
      </form>
    </Sheet>
  )
}

function formatValue(value: number, unit: string) {
  if (unit === "R$") return formatBRL(Math.round(value * 100))
  return `${Number.isInteger(value) ? value : value.toFixed(1).replace(".", ",")} ${unit}`
}

export function GoalsView() {
  const { data, patch, remove } = useLife()
  const today = todayISO()
  const [sheet, setSheet] = React.useState<{ open: boolean; goal: Goal | null }>({ open: false, goal: null })

  const goals = React.useMemo(() => [...data.goals].sort((a, b) => progressOf(b) - progressOf(a)), [data.goals])
  const avg = goals.length ? goals.reduce((s, g) => s + progressOf(g), 0) / goals.length : 0
  const done = goals.filter((g) => progressOf(g) >= 100).length

  const step = (g: Goal, delta: number) => {
    const next = Math.max(0, +(g.current + delta).toFixed(2))
    patch("goals", g.id, { current: next })
    haptic(delta > 0 ? 8 : 4)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Crescer"
        title="Metas"
        description={goals.length ? `Média de ${Math.round(avg)}% · ${done} concluída${done === 1 ? "" : "s"}` : "O que você quer alcançar, com número e prazo."}
        action={<AddButton label="Nova meta" onClick={() => setSheet({ open: true, goal: null })} />}
      />

      {goals.length === 0 ? (
        <Card>
          <Empty icon={Target} title="Nenhuma meta ainda" text="Comece por uma que você consegue medir." action={<AddButton label="Criar meta" onClick={() => setSheet({ open: true, goal: null })} />} />
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((g) => {
            const pct = progressOf(g)
            const left = g.deadline ? diffDays(today, g.deadline) : null
            return (
              <li key={g.id}>
                <Card className="flex h-full flex-col gap-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <AreaBadge area={g.area} />
                      <h2 className="l-display mt-3 text-[20px] leading-snug">{g.title}</h2>
                    </div>
                    <RowActions label={g.title} onEdit={() => setSheet({ open: true, goal: g })} onDelete={() => remove("goals", g.id)} />
                  </div>

                  <div>
                    <div className="mb-2 flex items-end justify-between gap-3">
                      <p className="l-display text-[26px] leading-none">{Math.round(pct)}%</p>
                      <p className="l-muted text-right text-sm">
                        {formatValue(g.current, g.unit)} <span aria-hidden>/</span> {formatValue(g.target, g.unit)}
                      </p>
                    </div>
                    <ProgressBar value={pct} color={AREAS[g.area].color as "teal"} label={`${g.title}: ${Math.round(pct)}%`} />
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      <button type="button" className="l-btn l-btn-ghost l-focus h-11 w-11 p-0" onClick={() => step(g, -1)} aria-label={`Diminuir ${g.title}`}>
                        <Minus className="h-4 w-4" aria-hidden />
                      </button>
                      <button type="button" className="l-btn l-btn-ghost l-focus h-11 px-4" onClick={() => step(g, 1)} aria-label={`Somar 1 em ${g.title}`}>
                        <Plus className="h-4 w-4" aria-hidden /> 1
                      </button>
                    </div>
                    <p className="l-muted text-xs font-semibold">
                      {g.deadline ? (left !== null && left < 0 ? `prazo: ${formatDayShort(g.deadline)} (passou)` : `até ${formatDayShort(g.deadline)}`) : "sem prazo"}
                    </p>
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <GoalSheet open={sheet.open} onOpenChange={(open) => setSheet((s) => ({ ...s, open }))} goal={sheet.goal} />
    </div>
  )
}

export function progressOf(g: Goal): number {
  return g.target > 0 ? Math.min(100, (g.current / g.target) * 100) : 0
}
