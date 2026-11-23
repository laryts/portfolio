"use client"

import * as React from "react"
import { ExternalLink, Gift } from "lucide-react"
import { useLife } from "../store"
import { PRIORITY_LABEL, WISH_STATUS_LABEL, type Priority, type WishItem, type WishStatus } from "@/lib/life/types"
import { formatBRL, centsToInput, parseBRLToCents } from "@/lib/life/format"
import { AddButton, Card, Empty, Field, PageHeader, Segmented, Select, Sheet, Stat, TextInput, haptic } from "../ui"
import { RowActions, emptyToUndef } from "./shared"
import { cn } from "@/lib/utils"

function WishSheet({ open, onOpenChange, item }: { open: boolean; onOpenChange: (o: boolean) => void; item: WishItem | null }) {
  const { add, patch } = useLife()
  const [name, setName] = React.useState("")
  const [price, setPrice] = React.useState("")
  const [priority, setPriority] = React.useState<Priority>(2)
  const [status, setStatus] = React.useState<WishStatus>("quero")
  const [link, setLink] = React.useState("")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setName(item?.name ?? "")
    setPrice(centsToInput(item?.priceCents))
    setPriority(item?.priority ?? 2)
    setStatus(item?.status ?? "quero")
    setLink(item?.link ?? "")
    setNotes(item?.notes ?? "")
  }, [open, item])

  const cents = parseBRLToCents(price) ?? 0
  const valid = name.trim().length > 0

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    const payload = { name: name.trim(), priceCents: cents, priority, status, link: emptyToUndef(link), notes: emptyToUndef(notes) }
    if (item) patch("wishlist", item.id, payload)
    else add("wishlist", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={item ? "Editar desejo" : "Novo desejo"}
      description="Guarde com preço e prioridade para decidir com calma."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="O que é?">
          <TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Jogo de tabuleiro, passagem…" maxLength={120} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Preço">
            <TextInput inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0,00" />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as WishStatus)}>
              {(Object.keys(WISH_STATUS_LABEL) as WishStatus[]).map((s) => (
                <option key={s} value={s}>{WISH_STATUS_LABEL[s]}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Prioridade">
          <Segmented<Priority>
            label="Prioridade"
            value={priority}
            onChange={setPriority}
            options={[1, 2, 3].map((p) => ({ value: p as Priority, label: PRIORITY_LABEL[p as Priority] }))}
          />
        </Field>
        <Field label="Link" hint="Opcional">
          <TextInput inputMode="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" />
        </Field>
        <Field label="Notas" hint="Opcional">
          <textarea className="l-input min-h-[72px] resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </form>
    </Sheet>
  )
}

const STATUS_COLOR: Record<WishStatus, string> = {
  quero: "area-coral",
  pesquisando: "area-sky",
  comprado: "area-mint",
  desisti: "area-ink",
}

export function WishlistView() {
  const { data, patch, remove } = useLife()
  const [sheet, setSheet] = React.useState<{ open: boolean; item: WishItem | null }>({ open: false, item: null })
  const [filter, setFilter] = React.useState<WishStatus | "todos">("quero")

  const items = React.useMemo(() => {
    const base = filter === "todos" ? data.wishlist : data.wishlist.filter((w) => w.status === filter)
    return [...base].sort((a, b) => a.priority - b.priority || b.priceCents - a.priceCents)
  }, [data.wishlist, filter])

  const wantTotal = data.wishlist.filter((w) => w.status === "quero").reduce((s, w) => s + w.priceCents, 0)
  const boughtTotal = data.wishlist.filter((w) => w.status === "comprado").reduce((s, w) => s + w.priceCents, 0)

  return (
    <div>
      <PageHeader
        eyebrow="Dinheiro"
        title="Desejos"
        description="O que você quer, quanto custa e em que ordem."
        action={<AddButton label="Novo desejo" onClick={() => setSheet({ open: true, item: null })} />}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card><Stat label="Quero" value={formatBRL(wantTotal)} hint={`${data.wishlist.filter((w) => w.status === "quero").length} itens`} /></Card>
        <Card><Stat label="Já realizados" value={formatBRL(boughtTotal)} hint={`${data.wishlist.filter((w) => w.status === "comprado").length} itens`} tone="good" /></Card>
        <Card className="col-span-2 md:col-span-1"><Stat label="Prioridade alta" value={data.wishlist.filter((w) => w.priority === 1 && w.status === "quero").length} hint="para o próximo ciclo" /></Card>
      </div>

      <div className="mb-5 l-scroll-x -mx-4 px-4 md:mx-0 md:px-0">
        <Segmented<WishStatus | "todos">
          label="Filtrar por status"
          value={filter}
          onChange={setFilter}
          options={[{ value: "todos", label: "Todos" }, ...(Object.keys(WISH_STATUS_LABEL) as WishStatus[]).map((s) => ({ value: s, label: WISH_STATUS_LABEL[s] }))]}
        />
      </div>

      {items.length === 0 ? (
        <Card>
          <Empty icon={Gift} title="Nada por aqui" text="Ideias, presentes para você mesma, aquela coisa que você vem namorando." action={<AddButton label="Adicionar" onClick={() => setSheet({ open: true, item: null })} />} />
        </Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((w) => (
            <li key={w.id}>
              <Card className="flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="l-display truncate text-[19px] leading-snug">{w.name}</p>
                    <p className="l-display mt-1 text-[22px]">{formatBRL(w.priceCents)}</p>
                  </div>
                  <RowActions label={w.name} onEdit={() => setSheet({ open: true, item: w })} onDelete={() => remove("wishlist", w.id)} />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("l-chip", STATUS_COLOR[w.status])}>{WISH_STATUS_LABEL[w.status]}</span>
                  <span className="l-chip" style={{ background: "var(--l-bg-2)", color: "var(--l-ink-2)" }}>
                    Prioridade {PRIORITY_LABEL[w.priority].toLowerCase()}
                  </span>
                  {w.link && (
                    <a href={w.link} target="_blank" rel="noopener noreferrer" className="l-chip l-focus underline-offset-4 hover:underline" style={{ color: "var(--l-plum)" }}>
                      Ver <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  )}
                </div>
                {w.notes && <p className="l-muted text-sm leading-relaxed">{w.notes}</p>}
                <div className="mt-auto flex items-center gap-2 pt-1">
                  <label className="sr-only" htmlFor={`st-${w.id}`}>Alterar status de {w.name}</label>
                  <Select id={`st-${w.id}`} className="h-11 min-h-[44px] py-2 text-sm" value={w.status} onChange={(e) => patch("wishlist", w.id, { status: e.target.value as WishStatus })}>
                    {(Object.keys(WISH_STATUS_LABEL) as WishStatus[]).map((s) => (
                      <option key={s} value={s}>{WISH_STATUS_LABEL[s]}</option>
                    ))}
                  </Select>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <WishSheet open={sheet.open} onOpenChange={(open) => setSheet((s) => ({ ...s, open }))} item={sheet.item} />
    </div>
  )
}
