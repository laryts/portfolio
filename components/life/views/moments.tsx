"use client"

import * as React from "react"
import { NotebookPen, Search } from "lucide-react"
import { useLife } from "../store"
import { MOOD_EMOJI, type Mood, type Moment } from "@/lib/life/types"
import { formatDayShort, monthKey, todayISO, parseISO } from "@/lib/life/dates"
import { AddButton, Card, Empty, Field, PageHeader, Segmented, TextArea, TextInput, Sheet, haptic } from "../ui"
import { RowActions } from "./shared"

function MomentSheet({ open, onOpenChange, moment }: { open: boolean; onOpenChange: (o: boolean) => void; moment: Moment | null }) {
  const { add, patch } = useLife()
  const [title, setTitle] = React.useState("")
  const [text, setText] = React.useState("")
  const [date, setDate] = React.useState(todayISO())
  const [mood, setMood] = React.useState<Mood | undefined>(undefined)
  const [tags, setTags] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setTitle(moment?.title ?? "")
    setText(moment?.text ?? "")
    setDate(moment?.date ?? todayISO())
    setMood(moment?.mood)
    setTags(moment?.tags.join(", ") ?? "")
  }, [open, moment])

  const valid = text.trim().length > 0

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    const payload = {
      title: title.trim(),
      text: text.trim(),
      date,
      mood,
      tags: tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 8),
    }
    if (moment) patch("moments", moment.id, payload)
    else add("moments", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={moment ? "Editar momento" : "Guardar momento"}
      description="Coisas bonitas, viagens, conquistas, dias difíceis que você quer lembrar."
      size="lg"
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Guardar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Título" className="sm:col-span-2">
            <TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: primeiro dia no Epcot" maxLength={120} />
          </Field>
          <Field label="Data">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Como foi?">
          <TextArea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[160px]" placeholder="Escreva como se fosse para você daqui a 10 anos." />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Humor (opcional)">
            <div className="flex gap-1">
              {([1, 2, 3, 4, 5] as Mood[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-label={`Humor ${m}`}
                  aria-pressed={mood === m}
                  onClick={() => setMood(mood === m ? undefined : m)}
                  className="l-focus flex h-11 flex-1 items-center justify-center rounded-xl border text-xl"
                  style={{ borderColor: mood === m ? "var(--l-plum)" : "var(--l-border)", background: mood === m ? "var(--l-plum-soft)" : "transparent" }}
                >
                  {MOOD_EMOJI[m]}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Tags" hint="Separe por vírgula">
            <TextInput value={tags} onChange={(e) => setTags(e.target.value)} placeholder="disney, gatos, família" />
          </Field>
        </div>
      </form>
    </Sheet>
  )
}

export function MomentsView() {
  const { data, remove } = useLife()
  const [query, setQuery] = React.useState("")
  const [scope, setScope] = React.useState<"todos" | "mes">("todos")
  const [sheet, setSheet] = React.useState<{ open: boolean; moment: Moment | null }>({ open: false, moment: null })
  const today = todayISO()

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...data.moments]
      .filter((m) => (scope === "mes" ? monthKey(m.date) === monthKey(today) : true))
      .filter((m) => !q || `${m.title} ${m.text} ${m.tags.join(" ")}`.toLowerCase().includes(q))
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [data.moments, query, scope, today])

  const groups = React.useMemo(() => {
    const map = new Map<string, Moment[]>()
    for (const m of filtered) {
      const key = monthKey(m.date)
      map.set(key, [...(map.get(key) ?? []), m])
    }
    return [...map.entries()]
  }, [filtered])

  return (
    <div>
      <PageHeader
        eyebrow="Pessoas & mente"
        title="Momentos"
        description={`${data.moments.length} momento${data.moments.length === 1 ? "" : "s"} guardados`}
        action={<AddButton label="Guardar momento" onClick={() => setSheet({ open: true, moment: null })} />}
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-80">
          <Search className="l-muted pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" aria-hidden />
          <TextInput className="pl-11" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar momentos ou tags…" aria-label="Buscar momentos" />
        </div>
        <Segmented<"todos" | "mes">
          label="Período"
          value={scope}
          onChange={setScope}
          options={[
            { value: "todos", label: "Tudo" },
            { value: "mes", label: "Este mês" },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <Empty
            icon={NotebookPen}
            title={data.moments.length ? "Nada encontrado" : "Seu diário de momentos"}
            text={data.moments.length ? "Tente outra busca." : "Guarde o que vale a pena lembrar: uma viagem, um presente, um gato fazendo algo engraçado."}
            action={!data.moments.length ? <AddButton label="Guardar o primeiro" onClick={() => setSheet({ open: true, moment: null })} /> : undefined}
          />
        </Card>
      ) : (
        <div className="space-y-8">
          {groups.map(([month, items]) => (
            <section key={month} aria-label={month}>
              <h2 className="l-eyebrow mb-3">{parseISO(`${month}-01`).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</h2>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((m) => (
                  <li key={m.id}>
                    <Card className="flex h-full flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="l-eyebrow">{formatDayShort(m.date)}{m.mood ? ` · ${MOOD_EMOJI[m.mood]}` : ""}</p>
                          {m.title && <h3 className="l-display mt-1 text-[19px] leading-snug">{m.title}</h3>}
                        </div>
                        <RowActions label={m.title || "momento"} onEdit={() => setSheet({ open: true, moment: m })} onDelete={() => remove("moments", m.id)} />
                      </div>
                      <p className="l-ink-2 whitespace-pre-line text-[14.5px] leading-relaxed">{m.text}</p>
                      {m.tags.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                          {m.tags.map((t) => (
                            <span key={t} className="l-chip" style={{ background: "var(--l-bg-2)", color: "var(--l-ink-2)" }}>#{t}</span>
                          ))}
                        </div>
                      )}
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <MomentSheet open={sheet.open} onOpenChange={(open) => setSheet((s) => ({ ...s, open }))} moment={sheet.moment} />
    </div>
  )
}
