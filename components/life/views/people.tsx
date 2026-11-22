"use client"

import * as React from "react"
import { Cake, CheckCheck, Users } from "lucide-react"
import { useLife } from "../store"
import type { Friend } from "@/lib/life/types"
import { addDays, formatDayShort, todayISO } from "@/lib/life/dates"
import { friendDueInDays } from "@/lib/life/selectors"
import { AddButton, Card, Empty, Field, PageHeader, Sheet, TextInput, haptic } from "../ui"
import { RowActions, emptyToUndef, parseIntSafe } from "./shared"
import { cn } from "@/lib/utils"

const FREQ_PRESETS = [
  { days: 7, label: "Semanal" },
  { days: 15, label: "Quinzenal" },
  { days: 30, label: "Mensal" },
  { days: 90, label: "Trimestral" },
]

function FriendSheet({ open, onOpenChange, friend }: { open: boolean; onOpenChange: (o: boolean) => void; friend: Friend | null }) {
  const { add, patch } = useLife()
  const [name, setName] = React.useState("")
  const [every, setEvery] = React.useState("30")
  const [last, setLast] = React.useState("")
  const [birthday, setBirthday] = React.useState("")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setName(friend?.name ?? "")
    setEvery(String(friend?.everyDays ?? 30))
    setLast(friend?.lastContact ?? "")
    setBirthday(friend?.birthday ?? "")
    setNotes(friend?.notes ?? "")
  }, [open, friend])

  const valid = name.trim().length > 0

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    const payload = {
      name: name.trim(),
      everyDays: Math.min(365, Math.max(1, parseIntSafe(every, 30))),
      lastContact: emptyToUndef(last),
      birthday: emptyToUndef(birthday),
      notes: emptyToUndef(notes),
    }
    if (friend) patch("friends", friend.id, payload)
    else add("friends", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={friend ? "Editar pessoa" : "Nova pessoa"}
      description="Quem você quer manter por perto, com um ritmo que faça sentido."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="Nome">
          <TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Ana" maxLength={80} />
        </Field>
        <Field label="Ritmo de contato">
          <div className="flex flex-wrap gap-2">
            {FREQ_PRESETS.map((p) => (
              <button
                key={p.days}
                type="button"
                onClick={() => setEvery(String(p.days))}
                aria-pressed={every === String(p.days)}
                className="l-focus l-chip min-h-[40px] border"
                style={{
                  borderColor: every === String(p.days) ? "var(--l-plum)" : "var(--l-border)",
                  background: every === String(p.days) ? "var(--l-plum-soft)" : "transparent",
                  color: every === String(p.days) ? "var(--l-plum)" : "var(--l-ink-2)",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <TextInput inputMode="numeric" className="max-w-[120px]" value={every} onChange={(e) => setEvery(e.target.value)} aria-label="Dias entre contatos" />
            <span className="l-muted text-sm">dias entre um contato e outro</span>
          </div>
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Último contato" hint="Opcional">
            <TextInput type="date" value={last} onChange={(e) => setLast(e.target.value)} />
          </Field>
          <Field label="Aniversário" hint="Opcional">
            <TextInput type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </Field>
        </div>
        <Field label="Notas" hint="Opcional">
          <textarea className="l-input min-h-[72px] resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Assunto que vocês gostam, algo que ela está vivendo…" />
        </Field>
      </form>
    </Sheet>
  )
}

export function PeopleView() {
  const { data, patch, remove } = useLife()
  const today = todayISO()
  const [sheet, setSheet] = React.useState<{ open: boolean; friend: Friend | null }>({ open: false, friend: null })

  const sorted = React.useMemo(() => {
    return [...data.friends].sort((a, b) => {
      const da = friendDueInDays(a, today) ?? -9999
      const db = friendDueInDays(b, today) ?? -9999
      return da - db
    })
  }, [data.friends, today])

  const contactNow = (f: Friend) => {
    patch("friends", f.id, { lastContact: today })
    haptic([10, 30, 10])
  }

  const statusOf = (f: Friend): { label: string; tone: string } => {
    const due = friendDueInDays(f, today)
    if (due === null) return { label: "Ainda não registrado", tone: "area-lilac" }
    if (due < 0) return { label: `${Math.abs(due)} dia${Math.abs(due) === 1 ? "" : "s"} de atraso`, tone: "area-coral" }
    if (due <= 3) return { label: due === 0 ? "Hoje é um bom dia" : `Falar em ${due}d`, tone: "area-mustard" }
    return { label: `Em dia · próximo em ${due}d`, tone: "area-mint" }
  }

  const birthdays = data.friends.filter((f) => f.birthday && f.birthday.slice(5) >= today.slice(5) && f.birthday.slice(5) <= addDays(today, 30).slice(5))

  return (
    <div>
      <PageHeader
        eyebrow="Pessoas & mente"
        title="Pessoas"
        description="Amizades pedem um pouco de cuidado. Aqui você lembra de quem gosta."
        action={<AddButton label="Nova pessoa" onClick={() => setSheet({ open: true, friend: null })} />}
      />

      {birthdays.length > 0 && (
        <Card tint className="mb-4 flex items-center gap-3">
          <Cake className="h-5 w-5 shrink-0" style={{ color: "var(--l-pink)" }} aria-hidden />
          <p className="text-sm">
            <span className="font-semibold">Aniversários nos próximos 30 dias:</span>{" "}
            {birthdays.map((f) => `${f.name} (${formatDayShort(`${today.slice(0, 4)}-${f.birthday!.slice(5)}`)})`).join(", ")}
          </p>
        </Card>
      )}

      {sorted.length === 0 ? (
        <Card>
          <Empty icon={Users} title="Sua rede de carinho" text="Cadastre as pessoas importantes e a frequência que quer manter o contato." action={<AddButton label="Adicionar alguém" onClick={() => setSheet({ open: true, friend: null })} />} />
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((f) => {
            const st = statusOf(f)
            return (
              <li key={f.id}>
                <Card className="flex h-full flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <span className="l-display flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[18px] area-pink">
                      {f.name.trim().charAt(0).toUpperCase() || "•"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-[17px] font-semibold">{f.name}</h2>
                      <span className={cn("l-chip mt-1", st.tone)}>{st.label}</span>
                    </div>
                    <RowActions label={f.name} onEdit={() => setSheet({ open: true, friend: f })} onDelete={() => remove("friends", f.id)} />
                  </div>
                  <p className="l-muted text-xs leading-relaxed">
                    {f.lastContact ? `Último contato ${formatDayShort(f.lastContact)}` : "Nenhum contato registrado"} · a cada {f.everyDays} dias
                    {f.birthday ? ` · aniversário ${formatDayShort(`${today.slice(0, 4)}-${f.birthday.slice(5)}`)}` : ""}
                  </p>
                  {f.notes && <p className="l-ink-2 text-sm leading-relaxed">{f.notes}</p>}
                  <button type="button" className="l-btn l-btn-ghost l-focus mt-auto h-11 w-full" onClick={() => contactNow(f)}>
                    <CheckCheck className="h-4 w-4" aria-hidden /> Conversei hoje
                  </button>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <FriendSheet open={sheet.open} onOpenChange={(open) => setSheet((s) => ({ ...s, open }))} friend={sheet.friend} />
    </div>
  )
}
