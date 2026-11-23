"use client"

import * as React from "react"
import { Minus, Plus, Target } from "lucide-react"
import { useLife } from "../store"
import { AREAS, AREA_IDS, type AreaId, type Goal } from "@/lib/life/types"
import { formatDayShort, diffDays, todayISO } from "@/lib/life/dates"
import { formatBRL } from "@/lib/life/format"
import { AddButton, AreaBadge, Card, Empty, Field, PageHeader, ProgressBar, Segmented, Select, Sheet, TextInput, haptic } from "../ui"
import { RowActions, emptyToUndef, parseFloatSafe } from "./shared"

const UNIT_PRESETS = ["R$", "livros", "km", "%", "vezes", "dias"]

const MONEY_UNITS = ["R$", "R"]
const isMoney = (unit: string) => MONEY_UNITS.includes(unit.trim())

function GoalSheet({ open, onOpenChange, goal }: { open: boolean; onOpenChange: (o: boolean) => void; goal: Goal | null }) {
  const { add, patch } = useLife()
  const [title, setTitle] = React.useState("")
  const [area, setArea] = React.useState<AreaId>("pessoal")
  const [kind, setKind] = React.useState<"money" | "qty">("money")
  const [unit, setUnit] = React.useState("")
  const [current, setCurrent] = React.useState("0")
  const [target, setTarget] = React.useState("100")
  const [deadline, setDeadline] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    const money = goal ? isMoney(goal.unit) : true
    setTitle(goal?.title ?? "")
    setArea(goal?.area ?? "pessoal")
    setKind(money ? "money" : "qty")
    setUnit(money ? "" : goal?.unit ?? "")
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
      unit: kind === "money" ? "R$" : unit.trim(),
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
          <TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Vender a primeira caixa da Pixie" maxLength={120} />
        </Field>
        <Field label="Tipo de meta">
          <Segmented<"money" | "qty">
            label="Tipo de meta"
            value={kind}
            onChange={setKind}
            options={[
              { value: "money", label: "Dinheiro (R$)" },
              { value: "qty", label: "Quantidade" },
            ]}
          />
        </Field>
        {kind === "qty" && (
          <Field label="Unidade" hint="Ex.: caixas, livros, km. Pode deixar em branco.">
            <TextInput list="unit-presets" value={unit} onChange={(e) => setUnit(e.target.value)} maxLength={20} placeholder="caixas" />
            <datalist id="unit-presets">
              {["caixas", "unidades", "livros", "km", "vezes", "dias", "%"].map((u) => <option key={u} value={u} />)}
            </datalist>
          </Field>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Já tenho">
            <TextInput inputMode="decimal" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </Field>
          <Field label="Alvo">
            <TextInput inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
          </Field>
        </div>
        <Field label="Prazo" hint="Opcional">
          <TextInput type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Área">
            <Select value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
              {AREA_IDS.map((a) => <option key={a} value={a}>{AREAS[a].label}</option>)}
            </Select>
          </Field>
        </div>
        {!targetNum && title.length > 0 && <p className="text-xs" style={{ color: "var(--l-danger)" }}>O alvo precisa ser maior que zero.</p>}
      </form>
    </Sheet>
  )
}

function formatValue(value: number, unit: string) {
  if (isMoney(unit)) return formatBRL(Math.round(value * 100))
  const n = Number.isInteger(value) ? String(value) : value.toFixed(1).replace(".", ",")
  return unit ? `${n} ${unit}` : n
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
