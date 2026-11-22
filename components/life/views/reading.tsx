"use client"

import * as React from "react"
import { BookOpen, Plus, Star } from "lucide-react"
import { useLife } from "../store"
import { AREAS, AREA_IDS, BOOK_STATUS_LABEL, type AreaId, type Book, type BookStatus, type Mood } from "@/lib/life/types"
import { formatDayShort, todayISO } from "@/lib/life/dates"
import { AddButton, AreaBadge, Card, Empty, Field, PageHeader, ProgressBar, Segmented, Select, Sheet, TextArea, TextInput, haptic } from "../ui"
import { ProgressRing, RowActions, emptyToUndef, parseIntSafe } from "./shared"
import { cn } from "@/lib/utils"

function BookSheet({ open, onOpenChange, book, defaultStatus }: { open: boolean; onOpenChange: (o: boolean) => void; book: Book | null; defaultStatus: BookStatus }) {
  const { add, patch } = useLife()
  const [title, setTitle] = React.useState("")
  const [author, setAuthor] = React.useState("")
  const [status, setStatus] = React.useState<BookStatus>(defaultStatus)
  const [area, setArea] = React.useState<AreaId>("pixie")
  const [pages, setPages] = React.useState("")
  const [current, setCurrent] = React.useState("")
  const [rating, setRating] = React.useState<Mood | undefined>(undefined)
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setTitle(book?.title ?? "")
    setAuthor(book?.author ?? "")
    setStatus(book?.status ?? defaultStatus)
    setArea(book?.area ?? "pixie")
    setPages(book?.pages ? String(book.pages) : "")
    setCurrent(book?.currentPage ? String(book.currentPage) : "")
    setRating(book?.rating)
    setNotes(book?.notes ?? "")
  }, [open, book, defaultStatus])

  const totalPages = parseIntSafe(pages, 0)
  const currentPage = Math.min(parseIntSafe(current, 0), totalPages || Infinity)
  const valid = title.trim().length > 0

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid) return
    const today = todayISO()
    const payload = {
      title: title.trim(),
      author: emptyToUndef(author),
      status,
      area,
      pages: totalPages > 0 ? totalPages : undefined,
      currentPage: status === "lendo" && currentPage > 0 ? currentPage : undefined,
      rating: status === "lido" ? rating : undefined,
      startedAt: book?.startedAt ?? (status === "lendo" ? today : undefined),
      finishedAt: status === "lido" ? book?.finishedAt ?? today : undefined,
      notes: emptyToUndef(notes),
      updatedAt: new Date().toISOString(),
    }
    if (book) patch("books", book.id, payload)
    else add("books", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={book ? "Editar livro" : "Novo livro"}
      description="Título e status bastam. O resto ajuda a acompanhar."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="Título">
          <TextInput autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Design de produto" maxLength={160} />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Autor(a)" hint="Opcional">
            <TextInput value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={120} />
          </Field>
          <Field label="Área">
            <Select value={area} onChange={(e) => setArea(e.target.value as AreaId)}>
              {AREA_IDS.map((a) => <option key={a} value={a}>{AREAS[a].label}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Status">
          <Select value={status} onChange={(e) => setStatus(e.target.value as BookStatus)}>
            {(Object.keys(BOOK_STATUS_LABEL) as BookStatus[]).map((s) => <option key={s} value={s}>{BOOK_STATUS_LABEL[s]}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Total de páginas" hint="Opcional">
            <TextInput inputMode="numeric" value={pages} onChange={(e) => setPages(e.target.value)} />
          </Field>
          {status === "lendo" && (
            <Field label="Página atual">
              <TextInput inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value)} />
            </Field>
          )}
        </div>
        {status === "lido" && (
          <Field label="Sua nota">
            <div className="flex gap-1" role="radiogroup" aria-label="Nota">
              {([1, 2, 3, 4, 5] as Mood[]).map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`Nota ${n} de 5`}
                  onClick={() => setRating(rating === n ? undefined : n)}
                  className="l-focus flex h-11 w-11 items-center justify-center rounded-xl"
                >
                  <Star className="h-6 w-6" style={{ color: rating && n <= rating ? "var(--l-mustard)" : "var(--l-border-strong)", fill: rating && n <= rating ? "var(--l-mustard)" : "transparent" }} aria-hidden />
                </button>
              ))}
            </div>
          </Field>
        )}
        <Field label="Anotações" hint="Citações, ideias para aplicar, o que ficou">
          <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </form>
    </Sheet>
  )
}

function GoalSheet({ open, onOpenChange, goal }: { open: boolean; onOpenChange: (o: boolean) => void; goal?: number }) {
  const { update } = useLife()
  const [value, setValue] = React.useState("")
  React.useEffect(() => {
    if (open) setValue(goal ? String(goal) : "")
  }, [open, goal])
  const n = parseIntSafe(value, 0)
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Meta de leitura"
      description="Quantos livros você quer terminar neste ano?"
      size="sm"
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button
            type="button"
            className="l-btn l-btn-plum l-focus"
            disabled={n <= 0}
            onClick={() => {
              update((prev) => ({ ...prev, readingGoal: n }))
              haptic(8)
              onOpenChange(false)
            }}
          >
            Salvar meta
          </button>
        </>
      }
    >
      <div className="pb-4">
        <Field label="Livros no ano">
          <TextInput inputMode="numeric" autoFocus value={value} onChange={(e) => setValue(e.target.value)} placeholder="12" />
        </Field>
      </div>
    </Sheet>
  )
}

function Stars({ value }: { value?: Mood }) {
  if (!value) return null
  return (
    <span className="flex items-center gap-0.5" aria-label={`Nota ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className="h-3.5 w-3.5" style={{ color: n <= value ? "var(--l-mustard)" : "var(--l-border-strong)", fill: n <= value ? "var(--l-mustard)" : "transparent" }} aria-hidden />
      ))}
    </span>
  )
}

export function ReadingView() {
  const { data, patch, remove, update } = useLife()
  const today = todayISO()
  const year = today.slice(0, 4)
  const [tab, setTab] = React.useState<BookStatus>("lendo")
  const [sheet, setSheet] = React.useState<{ open: boolean; book: Book | null; status: BookStatus }>({ open: false, book: null, status: "fila" })
  const [goalOpen, setGoalOpen] = React.useState(false)

  const finishedThisYear = data.books.filter((b) => b.status === "lido" && b.finishedAt?.startsWith(year)).length
  const goal = data.readingGoal
  const goalPct = goal ? Math.min(100, (finishedThisYear / goal) * 100) : 0
  const pagesThisYear = data.books
    .filter((b) => b.status === "lido" && b.finishedAt?.startsWith(year))
    .reduce((s, b) => s + (b.pages ?? 0), 0)

  const counts: Record<BookStatus, number> = {
    lendo: data.books.filter((b) => b.status === "lendo").length,
    fila: data.books.filter((b) => b.status === "fila").length,
    lido: data.books.filter((b) => b.status === "lido").length,
    abandonado: data.books.filter((b) => b.status === "abandonado").length,
  }

  const list = data.books
    .filter((b) => b.status === tab)
    .sort((a, b) => (tab === "lido" ? ((b.finishedAt ?? "") > (a.finishedAt ?? "") ? 1 : -1) : a.createdAt < b.createdAt ? 1 : -1))

  const advance = (b: Book, pages: number) => {
    const total = b.pages ?? 0
    const next = total ? Math.min(total, (b.currentPage ?? 0) + pages) : (b.currentPage ?? 0) + pages
    if (total && next >= total) {
      update((prev) => ({
        ...prev,
        books: prev.books.map((x) => (x.id === b.id ? { ...x, status: "lido", currentPage: undefined, finishedAt: today, updatedAt: new Date().toISOString() } : x)),
      }))
      haptic([10, 40, 10, 40, 10])
      return
    }
    patch("books", b.id, { currentPage: next, updatedAt: new Date().toISOString() })
    haptic(6)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Crescer"
        title="Leitura"
        description={`${finishedThisYear} livro${finishedThisYear === 1 ? "" : "s"} terminado${finishedThisYear === 1 ? "" : "s"} em ${year}${pagesThisYear ? ` · ${pagesThisYear} páginas` : ""}`}
        action={<AddButton label="Novo livro" onClick={() => setSheet({ open: true, book: null, status: tab })} />}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card tint className="flex items-center gap-5 md:col-span-1">
          <ProgressRing value={goal ? goalPct : 0} size={76} />
          <div className="min-w-0">
            <p className="l-eyebrow">Meta de {year}</p>
            <p className="l-display mt-1 text-[22px] leading-tight">{goal ? `${finishedThisYear} de ${goal}` : "Sem meta ainda"}</p>
            <button type="button" className="l-focus l-muted mt-1 text-xs font-semibold underline-offset-4 hover:underline" onClick={() => setGoalOpen(true)}>
              {goal ? "Ajustar meta" : "Definir meta"}
            </button>
          </div>
        </Card>
        <Card className="md:col-span-2">
          <div className="flex h-full flex-col justify-center gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Lendo agora</span>
              <span className="l-muted">{counts.lendo} livro{counts.lendo === 1 ? "" : "s"}</span>
            </div>
            {data.books.some((b) => b.status === "lendo" && b.pages) ? (
              data.books
                .filter((b) => b.status === "lendo" && b.pages)
                .slice(0, 2)
                .map((b) => {
                  const pct = ((b.currentPage ?? 0) / (b.pages ?? 1)) * 100
                  return (
                    <div key={b.id}>
                      <div className="mb-1.5 flex justify-between gap-2 text-xs">
                        <span className="truncate font-semibold">{b.title}</span>
                        <span className="l-muted shrink-0">{b.currentPage ?? 0}/{b.pages} p.</span>
                      </div>
                      <ProgressBar value={pct} color={AREAS[b.area].color as "teal"} label={`Progresso de ${b.title}`} />
                    </div>
                  )
                })
            ) : (
              <p className="l-muted text-sm">Coloque a página atual de um livro para acompanhar o progresso aqui.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="l-scroll-x -mx-4 mb-5 px-4 md:mx-0 md:px-0">
        <Segmented<BookStatus>
          label="Status dos livros"
          value={tab}
          onChange={setTab}
          options={(Object.keys(BOOK_STATUS_LABEL) as BookStatus[]).map((s) => ({ value: s, label: `${BOOK_STATUS_LABEL[s]} · ${counts[s]}` }))}
        />
      </div>

      {list.length === 0 ? (
        <Card>
          <Empty
            icon={BookOpen}
            title={tab === "lendo" ? "Nenhum livro em andamento" : `Nada em "${BOOK_STATUS_LABEL[tab]}"`}
            text="Guarde o que quer ler, o que está lendo e o que já terminou."
            action={<AddButton label="Adicionar livro" onClick={() => setSheet({ open: true, book: null, status: tab })} />}
          />
        </Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((b) => {
            const pct = b.pages && b.currentPage ? (b.currentPage / b.pages) * 100 : 0
            return (
              <li key={b.id}>
                <Card className="flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <AreaBadge area={b.area} />
                        {b.status === "lido" && <Stars value={b.rating} />}
                      </div>
                      <h2 className="l-display text-[20px] leading-snug">{b.title}</h2>
                      {b.author && <p className="l-muted text-sm">{b.author}</p>}
                    </div>
                    <RowActions label={b.title} onEdit={() => setSheet({ open: true, book: b, status: b.status })} onDelete={() => remove("books", b.id)} />
                  </div>

                  {b.status === "lendo" && (
                    <div>
                      {b.pages ? (
                        <>
                          <div className="mb-2 flex justify-between text-xs">
                            <span className="l-muted font-semibold">Página {b.currentPage ?? 0} de {b.pages}</span>
                            <span className="font-semibold">{Math.round(pct)}%</span>
                          </div>
                          <ProgressBar value={pct} color={AREAS[b.area].color as "teal"} label={`Progresso de ${b.title}`} />
                        </>
                      ) : (
                        <p className="l-muted text-xs">Sem total de páginas cadastrado.</p>
                      )}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button type="button" className="l-btn l-btn-ghost l-focus h-11 px-4" onClick={() => advance(b, 10)} aria-label={`Avançar 10 páginas em ${b.title}`}>
                          <Plus className="h-4 w-4" aria-hidden /> 10 páginas
                        </button>
                        <button type="button" className="l-btn l-btn-ghost l-focus h-11 px-4" onClick={() => advance(b, 30)} aria-label={`Avançar 30 páginas em ${b.title}`}>
                          <Plus className="h-4 w-4" aria-hidden /> 30 páginas
                        </button>
                      </div>
                    </div>
                  )}

                  {b.status === "lido" && b.finishedAt && (
                    <p className="l-muted text-xs">Terminado em {formatDayShort(b.finishedAt)}{b.pages ? ` · ${b.pages} páginas` : ""}</p>
                  )}

                  {b.notes && <p className="l-ink-2 line-clamp-4 whitespace-pre-line text-sm leading-relaxed">{b.notes}</p>}

                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    {b.status !== "lendo" && b.status !== "lido" && (
                      <button type="button" className="l-btn l-btn-ghost l-focus h-11 px-4" onClick={() => patch("books", b.id, { status: "lendo", startedAt: b.startedAt ?? today, updatedAt: new Date().toISOString() })}>
                        Começar
                      </button>
                    )}
                    {b.status !== "lido" && (
                      <button type="button" className="l-btn l-btn-ghost l-focus h-11 px-4" onClick={() => patch("books", b.id, { status: "lido", finishedAt: today, currentPage: undefined, updatedAt: new Date().toISOString() })}>
                        Marcar como lido
                      </button>
                    )}
                  </div>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <BookSheet open={sheet.open} onOpenChange={(open) => setSheet((s) => ({ ...s, open }))} book={sheet.book} defaultStatus={sheet.status} />
      <GoalSheet open={goalOpen} onOpenChange={setGoalOpen} goal={goal} />
    </div>
  )
}
