"use client"

import * as React from "react"
import { Cat, CheckCircle2, House, Plus } from "lucide-react"
import { useLife } from "../store"
import { type AreaId, type Cat as CatT, type Reminder } from "@/lib/life/types"
import { addDays, formatDayShort, relativeDay, todayISO } from "@/lib/life/dates"
import { foodDaysLeft } from "@/lib/life/selectors"
import { AddButton, AreaBadge, Card, Empty, Field, PageHeader, Segmented, Select, Sheet, TextInput, haptic } from "../ui"
import { RowActions, emptyToUndef } from "./shared"
import { cn } from "@/lib/utils"

const REPEAT_OPTIONS = [
  { value: 0, label: "Uma vez" },
  { value: 30, label: "Mensal" },
  { value: 60, label: "Bimestral" },
  { value: 90, label: "Trimestral" },
  { value: 180, label: "Semestral" },
  { value: 365, label: "Anual" },
]

function CatSheet({ open, onOpenChange, cat }: { open: boolean; onOpenChange: (o: boolean) => void; cat: CatT | null }) {
  const { add, patch } = useLife()
  const today = todayISO()
  const [name, setName] = React.useState("")
  const [birthday, setBirthday] = React.useState("")
  const [food, setFood] = React.useState("")
  const [runsOut, setRunsOut] = React.useState("")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setName(cat?.name ?? "")
    setBirthday(cat?.birthday ?? "")
    setFood(cat?.food ?? "")
    setRunsOut(cat?.foodRunsOut ?? "")
    setNotes(cat?.notes ?? "")
  }, [open, cat])

  const valid = name.trim().length > 0

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    const payload = {
      name: name.trim(),
      birthday: emptyToUndef(birthday),
      food: emptyToUndef(food),
      foodRunsOut: emptyToUndef(runsOut),
      notes: emptyToUndef(notes),
    }
    if (cat) patch("cats", cat.id, payload)
    else add("cats", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={cat ? `Sobre ${cat.name}` : "Novo gato"}
      description="Ração, aniversário e observações. Lembretes de saúde ficam na aba Lar."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="Nome">
          <TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Aniversário" hint="Opcional">
            <TextInput type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </Field>
          <Field label="Ração" hint="Marca ou tipo">
            <TextInput value={food} onChange={(e) => setFood(e.target.value)} maxLength={80} />
          </Field>
        </div>
        <Field label="Ração acaba em" hint="Use o atalho abaixo ao comprar">
          <TextInput type="date" value={runsOut} onChange={(e) => setRunsOut(e.target.value)} />
          <div className="mt-2 flex flex-wrap gap-2">
            {[15, 30, 45].map((d) => (
              <button
                key={d}
                type="button"
                className="l-chip l-focus min-h-[40px] border"
                style={{ borderColor: "var(--l-border)", background: "var(--l-surface-2)", color: "var(--l-ink-2)" }}
                onClick={() => {
                  setRunsOut(addDays(today, d))
                  haptic(6)
                }}
              >
                +{d} dias
              </button>
            ))}
          </div>
        </Field>
        <Field label="Observações" hint="Opcional">
          <textarea className="l-input min-h-[72px] resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alergias, remédios, manias…" />
        </Field>
      </form>
    </Sheet>
  )
}

function ReminderSheet({ open, onOpenChange, reminder, cats }: { open: boolean; onOpenChange: (o: boolean) => void; reminder: Reminder | null; cats: CatT[] }) {
  const { add, patch } = useLife()
  const today = todayISO()
  const [label, setLabel] = React.useState("")
  const [area, setArea] = React.useState<AreaId>("gatos")
  const [date, setDate] = React.useState(today)
  const [repeat, setRepeat] = React.useState(0)
  const [catId, setCatId] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setLabel(reminder?.label ?? "")
    setArea(reminder?.area ?? "gatos")
    setDate(reminder?.date ?? today)
    setRepeat(reminder?.everyDays ?? 0)
    setCatId(reminder?.catId ?? "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reminder])

  const valid = label.trim().length > 0 && !!date

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    const payload = {
      label: label.trim(),
      area,
      date,
      everyDays: repeat || undefined,
      catId: area === "gatos" && catId ? catId : undefined,
    }
    if (reminder) patch("reminders", reminder.id, payload)
    else add("reminders", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={reminder ? "Editar lembrete" : "Novo lembrete"}
      description="Vacina, vermífugo, faxina, filtro do ar… você escolhe a frequência."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="O que lembrar?">
          <TextInput autoFocus value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ex.: vermífugo, vacina anual, limpar o filtro" maxLength={120} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Área">
            <Select value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
              <option value="gatos">Gatos</option>
              <option value="casa">Casa</option>
            </Select>
          </Field>
          <Field label="Próxima data">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Repetir">
          <Select value={String(repeat)} onChange={(e) => setRepeat(Number(e.target.value))}>
            {REPEAT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        {area === "gatos" && cats.length > 0 && (
          <Field label="Para qual gato?" hint="Opcional">
            <Select value={catId} onChange={(e) => setCatId(e.target.value)}>
              <option value="">Os dois / geral</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </Field>
        )}
      </form>
    </Sheet>
  )
}

export function HomeCareView() {
  const { data, patch, remove } = useLife()
  const today = todayISO()
  const [tab, setTab] = React.useState<"gatos" | "casa">("gatos")
  const [catSheet, setCatSheet] = React.useState<{ open: boolean; cat: CatT | null }>({ open: false, cat: null })
  const [remSheet, setRemSheet] = React.useState<{ open: boolean; reminder: Reminder | null }>({ open: false, reminder: null })

  const reminders = React.useMemo(
    () => data.reminders.filter((r) => r.area === tab).sort((a, b) => (a.date < b.date ? -1 : 1)),
    [data.reminders, tab]
  )

  const complete = (r: Reminder) => {
    if (r.everyDays) {
      const base = r.date > today ? r.date : today
      patch("reminders", r.id, { date: addDays(base, r.everyDays) })
      haptic([10, 40, 10])
    } else {
      remove("reminders", r.id)
      haptic([10, 40, 10])
    }
  }

  const renewFood = (c: CatT) => {
    patch("cats", c.id, { foodRunsOut: addDays(today, 30) })
    haptic([10, 40, 10])
  }

  return (
    <div>
      <PageHeader
        eyebrow="Vida & casa"
        title="Lar & gatos"
        description="Cuidados, ração e a rotina da casa — sem depender da memória."
        action={
          tab === "gatos" ? (
            <AddButton label="Novo gato" onClick={() => setCatSheet({ open: true, cat: null })} />
          ) : (
            <AddButton label="Novo lembrete" onClick={() => setRemSheet({ open: true, reminder: null })} />
          )
        }
      />

      <div className="mb-6">
        <Segmented<"gatos" | "casa">
          label="Seção"
          value={tab}
          onChange={setTab}
          options={[
            { value: "gatos", label: "Gatos" },
            { value: "casa", label: "Casa" },
          ]}
        />
      </div>

      {tab === "gatos" && (
        <>
          {data.cats.length === 0 ? (
            <Card>
              <Empty icon={Cat} title="Cadastre seus gatos" text="Assim a ração e os lembretes de saúde passam a aparecer aqui e no Hoje." action={<AddButton label="Adicionar gato" onClick={() => setCatSheet({ open: true, cat: null })} />} />
            </Card>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {data.cats.map((c) => {
                const left = foodDaysLeft(c, today)
                const low = left !== null && left <= 7
                return (
                  <li key={c.id}>
                    <Card className="flex h-full flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <span className="area-mustard flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                          <Cat className="h-7 w-7" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h2 className="l-display text-[22px] leading-tight">{c.name}</h2>
                          <p className="l-muted mt-1 text-xs">
                            {c.birthday ? `Aniversário ${formatDayShort(c.birthday)}` : "Aniversário não cadastrado"}
                            {c.food ? ` · ${c.food}` : ""}
                          </p>
                        </div>
                        <RowActions label={c.name} onEdit={() => setCatSheet({ open: true, cat: c })} onDelete={() => remove("cats", c.id)} />
                      </div>
                      <div className="rounded-2xl p-4" style={{ background: low ? "color-mix(in srgb, var(--l-warn) 14%, var(--l-surface))" : "var(--l-bg-2)" }}>
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="l-eyebrow">Ração</p>
                            <p className="l-display mt-1 text-[22px] leading-none">
                              {left === null ? "sem data" : left <= 0 ? "acabou" : `${left} dia${left === 1 ? "" : "s"}`}
                            </p>
                            {c.foodRunsOut && <p className="l-muted mt-1 text-xs">acaba {relativeDay(c.foodRunsOut, today)}</p>}
                          </div>
                          <button type="button" className="l-btn l-btn-plum l-focus h-11 px-4" onClick={() => renewFood(c)}>
                            Comprei · +30 dias
                          </button>
                        </div>
                      </div>
                      {c.notes && <p className="l-ink-2 text-sm leading-relaxed">{c.notes}</p>}
                    </Card>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}

      <section className={cn("mt-8", tab === "gatos" && "mt-10")} aria-labelledby="rem-title">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="rem-title" className="l-display text-[19px]">
            {tab === "gatos" ? "Saúde e rotina dos gatos" : "Rotina da casa"}
          </h2>
          {tab === "gatos" && (
            <button type="button" className="l-btn l-btn-ghost l-focus h-11" onClick={() => setRemSheet({ open: true, reminder: null })}>
              <Plus className="h-4 w-4" aria-hidden /> Lembrete
            </button>
          )}
        </div>
        <div className="l-card px-4 md:px-5">
          {reminders.length === 0 ? (
            <Empty
              icon={tab === "gatos" ? Cat : House}
              title="Nenhum lembrete"
              text={tab === "gatos" ? "Vacina, vermífugo, consulta de rotina — o app avisa com antecedência." : "Faxina, troca de filtro, pagar a conta da internet…"}
            />
          ) : (
            <ul>
              {reminders.map((r) => {
                const overdue = r.date < today
                const cat = r.catId ? data.cats.find((c) => c.id === r.catId) : undefined
                return (
                  <li key={r.id} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid var(--l-border)" }}>
                    <button
                      type="button"
                      onClick={() => complete(r)}
                      className="l-focus flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full"
                      aria-label={`Marcar como feito: ${r.label}`}
                    >
                      <CheckCircle2 className="h-6 w-6" style={{ color: overdue ? "var(--l-warn)" : "var(--l-muted)" }} aria-hidden />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{r.label}{cat ? <span className="l-muted"> · {cat.name}</span> : null}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold" style={overdue ? { color: "var(--l-danger)" } : { color: "var(--l-ink-2)" }}>
                          {relativeDay(r.date, today)} · {formatDayShort(r.date)}
                        </span>
                        {r.everyDays ? <span className="l-muted">repete a cada {r.everyDays} dias</span> : null}
                      </p>
                    </div>
                    <AreaBadge area={r.area} className="hidden sm:inline-flex" />
                    <RowActions label={r.label} onEdit={() => setRemSheet({ open: true, reminder: r })} onDelete={() => remove("reminders", r.id)} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <p className="l-muted mt-3 text-xs">Ao concluir um lembrete que repete, a próxima data é calculada automaticamente.</p>
      </section>

      <CatSheet open={catSheet.open} onOpenChange={(open) => setCatSheet((s) => ({ ...s, open }))} cat={catSheet.cat} />
      <ReminderSheet open={remSheet.open} onOpenChange={(open) => setRemSheet((s) => ({ ...s, open }))} reminder={remSheet.reminder} cats={data.cats} />
    </div>
  )
}

