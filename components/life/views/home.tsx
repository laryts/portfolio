"use client"

import * as React from "react"
import { ArrowUpRight, Plane, Plus, Sparkles, Flame, Cat, Users, ShoppingBasket, Gift, Smile } from "lucide-react"
import { useLife } from "../store"
import { Card, Check, Empty, ProgressBar, Stat, TextInput, haptic } from "../ui"
import { AREAS, MOOD_EMOJI, PRIORITY_LABEL, WISH_STATUS_LABEL, type Mood } from "@/lib/life/types"
import { addDays, diffDays, formatDateLong, formatDayShort, parseISO, relativeDay, todayISO, monthKey } from "@/lib/life/dates"
import { formatBRL } from "@/lib/life/format"
import {
  expenseByCategory,
  foodDaysLeft,
  friendDueInDays,
  friendsToContact,
  habitDone,
  habitStreak,
  isOverdue,
  monthTotals,
  sortTasks,
  upcomingReminders,
  weekSummary,
} from "@/lib/life/selectors"
import { cn } from "@/lib/utils"
import { ProgressRing } from "./shared"

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`
}

function greeting(hour: number) {
  if (hour < 5) return "Boa madrugada"
  if (hour < 12) return "Bom dia"
  if (hour < 18) return "Boa tarde"
  return "Boa noite"
}

// Links de âncora (#modulo) são nativos: disparam hashchange e o shell troca a tela.
function WidgetLink({ to, label }: { to: string; label: string }) {
  return (
    <a
      href={`#${to}`}
      className="l-focus l-muted inline-flex min-h-[44px] items-center gap-1 rounded-full px-2 text-[12.5px] font-semibold hover:text-[var(--l-ink)]"
    >
      {label}
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
    </a>
  )
}

function WidgetHead({ eyebrow, title, to, action }: { eyebrow: string; title: string; to?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="l-eyebrow">{eyebrow}</p>
        <h2 className="l-display mt-1 text-[20px] leading-tight">{title}</h2>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {action}
        {to && <WidgetLink to={to} label="Abrir" />}
      </div>
    </div>
  )
}

export function HomeView() {
  const { data, add, patch, update } = useLife()
  const today = todayISO()
  const [quick, setQuick] = React.useState("")
  const [hour] = React.useState(() => new Date().getHours())
  const month = monthKey(today)

  const week = React.useMemo(() => weekSummary(data, today), [data, today])
  const openToday = React.useMemo(() => {
    const open = data.tasks.filter((t) => !t.done && (!t.due || t.due <= today))
    return sortTasks(open).slice(0, 7)
  }, [data.tasks, today])
  const overdueCount = data.tasks.filter((t) => !t.done && isOverdue(t.due, today)).length

  const totals = React.useMemo(() => monthTotals(data.transactions, month), [data.transactions, month])
  const categories = React.useMemo(() => expenseByCategory(data.transactions, month), [data.transactions, month])
  const budgetRows = Object.entries(data.budgets)
    .filter(([, v]) => typeof v === "number" && v > 0)
    .map(([cat, limit]) => {
      const spent = categories.find((c) => c.category === cat)?.cents ?? 0
      return { cat, limit: limit as number, spent }
    })
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
    .slice(0, 3)

  const events = data.events
    .filter((e) => e.date >= today && e.date <= addDays(today, 7))
    .sort((a, b) => (a.date === b.date ? (a.time ?? "").localeCompare(b.time ?? "") : a.date < b.date ? -1 : 1))
    .slice(0, 5)

  const alerts = React.useMemo(() => {
    const out: { id: string; text: string; tone: "warn" | "info"; to: string }[] = []
    if (overdueCount) out.push({ id: "overdue", text: `${overdueCount} tarefa${overdueCount > 1 ? "s" : ""} atrasada${overdueCount > 1 ? "s" : ""}`, tone: "warn", to: "tarefas" })
    for (const r of upcomingReminders(data.reminders, 7, today).slice(0, 3)) {
      const cat = r.catId ? data.cats.find((c) => c.id === r.catId) : undefined
      out.push({
        id: `rem-${r.id}`,
        text: `${cat ? cat.name + ": " : ""}${r.label} · ${relativeDay(r.date, today)}`,
        tone: r.date <= today ? "warn" : "info",
        to: "lar",
      })
    }
    for (const c of data.cats) {
      const left = foodDaysLeft(c, today)
      if (left !== null && left <= 10) {
        out.push({
          id: `food-${c.id}`,
          text: left <= 0 ? `Ração de ${c.name} acabou` : `Ração de ${c.name} acaba em ${left} dia${left === 1 ? "" : "s"}`,
          tone: left <= 3 ? "warn" : "info",
          to: "lar",
        })
      }
    }
    return out.slice(0, 5)
  }, [overdueCount, data.reminders, data.cats, today])

  const friendsDue = friendsToContact(data.friends, today).slice(0, 3)
  const checkinToday = data.checkins.find((c) => c.date === today)
  const nextTrip = [...data.trips]
    .filter((t) => t.start && t.start >= today)
    .sort((a, b) => ((a.start ?? "") < (b.start ?? "") ? -1 : 1))[0]
  const wishTop = data.wishlist
    .filter((w) => w.status === "quero")
    .sort((a, b) => a.priority - b.priority || a.priceCents - b.priceCents)
    .slice(0, 3)
  const topGoals = data.goals.slice(0, 3)
  const groceriesOpen = data.groceries.filter((g) => !g.done).length

  const submitQuick = (e: React.FormEvent) => {
    e.preventDefault()
    const title = quick.trim()
    if (!title) return
    add("tasks", { title, area: "pessoal", priority: 2, due: today, done: false })
    setQuick("")
    haptic(8)
  }

  const toggleHabit = (id: string) => {
    const h = data.habits.find((x) => x.id === id)
    if (!h) return
    const done = habitDone(h, today)
    patch("habits", id, {
      doneDates: done ? h.doneDates.filter((d) => d !== today) : [...h.doneDates, today],
    })
    haptic(done ? 4 : [10, 30, 10])
  }

  const quickMood = (mood: Mood) => {
    const existing = data.checkins.find((c) => c.date === today)
    const next = existing
      ? data.checkins.map((c) => (c.date === today ? { ...c, mood } : c))
      : [...data.checkins, { date: today, mood, energy: 3 as Mood }]
    update((prev) => ({ ...prev, checkins: next }))
    haptic(6)
  }

  const hasAnything = data.tasks.length + data.habits.length + data.goals.length + data.transactions.length > 0

  return (
    <div className="space-y-6">
      {/* Cabeçalho + captura rápida */}
      <header className="flex flex-col gap-5 pb-1 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="l-eyebrow">{formatDateLong(today)}</p>
          <h1 className="l-display mt-2 text-[34px] leading-[1.05] md:text-[44px]">
            {greeting(hour)}, Lari <span aria-hidden>☕</span>
          </h1>
          <p className="l-ink-2 mt-2 text-[15px]">
            {plural(week.tasksOpen, "tarefa aberta", "tarefas abertas")} · {plural(data.habits.length, "hábito", "hábitos")} ·{" "}
            {plural(groceriesOpen, "item", "itens")} no mercado
          </p>
        </div>
        <form onSubmit={submitQuick} className="flex w-full gap-2 md:max-w-md" role="search" aria-label="Captura rápida">
          <TextInput
            value={quick}
            onChange={(e) => setQuick(e.target.value)}
            placeholder="Anote algo para hoje…"
            aria-label="Nova tarefa para hoje"
            enterKeyHint="done"
          />
          <button type="submit" className="l-btn l-btn-plum l-focus h-11 shrink-0 px-4" aria-label="Adicionar tarefa de hoje">
            <Plus className="h-5 w-5" aria-hidden />
          </button>
        </form>
      </header>

      {!hasAnything && (
        <Card tint className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--l-plum)" }} aria-hidden />
            <div>
              <p className="font-semibold">Seu painel está vazio — e tudo bem.</p>
              <p className="l-muted mt-1 text-sm leading-relaxed">
                Comece por uma meta, uma tarefa de hoje ou um hábito. Cada módulo tem o próprio botão de adicionar.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#metas" className="l-btn l-btn-ghost l-focus">Criar meta</a>
            <a href="#habitos" className="l-btn l-btn-ghost l-focus">Criar hábito</a>
          </div>
        </Card>
      )}

      {/* Resumo da semana */}
      <Card tint>
        <WidgetHead eyebrow="Sua semana" title="Resumo da semana" />
        <div className="mb-5 grid grid-cols-7 gap-1.5 md:gap-3">
          {week.days.map((d) => {
            const isToday = d === today
            const dayHabits = data.habits.filter((h) => habitDone(h, d)).length
            const dayTasks = data.tasks.filter((t) => t.due === d && !t.done).length
            const dayEvents = data.events.filter((e) => e.date === d).length
            const weekday = parseISO(d).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").slice(0, 3)
            return (
              <div
                key={d}
                className={cn(
                  "flex min-h-[92px] flex-col items-center gap-1.5 rounded-2xl border px-1 py-2.5 md:min-h-[104px]",
                  isToday ? "border-transparent bg-[var(--l-plum)] text-white" : "bg-[var(--l-surface)]"
                )}
                style={!isToday ? { borderColor: "var(--l-border)" } : undefined}
                aria-label={`${weekday} ${parseISO(d).getDate()}: ${dayTasks} tarefas, ${dayHabits} hábitos, ${dayEvents} compromissos`}
              >
                <span className={cn("text-[11px] font-semibold uppercase tracking-wide", !isToday && "l-muted")}>{weekday}</span>
                <span className="l-display text-[18px] leading-none">{parseISO(d).getDate()}</span>
                <div className="mt-auto flex flex-wrap items-center justify-center gap-1">
                  {dayTasks > 0 && <span className="h-1.5 w-1.5 rounded-full" style={{ background: isToday ? "#fff" : "var(--l-coral)" }} />}
                  {dayHabits > 0 && <span className="h-1.5 w-1.5 rounded-full" style={{ background: isToday ? "#fff" : "var(--l-teal)" }} />}
                  {dayEvents > 0 && <span className="h-1.5 w-1.5 rounded-full" style={{ background: isToday ? "#fff" : "var(--l-sky)" }} />}
                </div>
              </div>
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          <Stat label="Tarefas feitas" value={week.tasksDone} hint={`${week.tasksOpen} abertas`} />
          <Stat label="Hábitos" value={`${week.habitRatePct}%`} hint="taxa da semana" tone={week.habitRatePct >= 70 ? "good" : "default"} />
          <Stat label="Gasto" value={formatBRL(week.spent)} hint="nesta semana" />
          <Stat label="Momentos" value={week.moments} hint={`${week.events} compromissos`} />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Tarefas de hoje */}
        <Card className="xl:col-span-2">
          <WidgetHead
            eyebrow="Hoje"
            title="Para fazer"
            to="tarefas"
          />
          {openToday.length === 0 ? (
            <Empty title="Nada urgente por agora" text="Quando algo entrar na lista, ele aparece aqui." />
          ) : (
            <ul className="-mx-1 divide-y" style={{ borderColor: "var(--l-border)" }}>
              {openToday.map((t) => (
                <li key={t.id} className="flex items-center gap-2 py-1">
                  <Check
                    label={`Concluir ${t.title}`}
                    checked={t.done}
                    onChange={(done) => patch("tasks", t.id, { done, doneAt: done ? new Date().toISOString() : undefined })}
                  />
                  <div className="min-w-0 flex-1 py-2">
                    <p className="truncate text-[15px] font-medium">{t.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                      <span className={cn(isOverdue(t.due, today) ? "font-semibold" : "l-muted")} style={isOverdue(t.due, today) ? { color: "var(--l-danger)" } : undefined}>
                        {t.due ? (t.due < today ? `atrasada · ${formatDayShort(t.due)}` : "hoje") : "sem prazo"}
                      </span>
                      <span className={cn("l-chip py-0 text-[11px]", `area-${AREAS[t.area].color}`)}>{AREAS[t.area].label}</span>
                      {t.priority === 1 && <span className="font-semibold" style={{ color: "var(--l-coral)" }}>{PRIORITY_LABEL[t.priority]}</span>}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Hábitos de hoje */}
        <Card>
          <WidgetHead eyebrow="Hábitos" title="Hoje" to="habitos" />
          {data.habits.length === 0 ? (
            <Empty title="Sem hábitos ainda" text="Um hábito pequeno por dia já muda a semana." />
          ) : (
            <ul className="space-y-2">
              {data.habits.map((h) => {
                const done = habitDone(h, today)
                const streak = habitStreak(h, today)
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => toggleHabit(h.id)}
                      aria-pressed={done}
                      className={cn(
                        "l-focus flex min-h-[52px] w-full items-center justify-between gap-3 rounded-2xl border px-4 text-left transition-colors",
                      )}
                      style={{
                        borderColor: done ? "var(--l-teal)" : "var(--l-border)",
                        background: done ? "var(--l-teal-soft)" : "var(--l-surface-2)",
                      }}
                    >
                      <span className="min-w-0 truncate text-[15px] font-medium">{h.name}</span>
                      <span className="flex shrink-0 items-center gap-2 text-xs font-semibold">
                        {streak > 0 && (
                          <span className="flex items-center gap-1" style={{ color: "var(--l-coral)" }}>
                            <Flame className="h-3.5 w-3.5" aria-hidden />
                            {streak}
                          </span>
                        )}
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full border-2"
                          style={{ borderColor: done ? "var(--l-teal)" : "var(--l-border-strong)", background: done ? "var(--l-teal)" : "transparent" }}
                        >
                          {done && (
                            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                              <path d="M2 6.5 4.8 9 10 3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        {/* Check-in de bem-estar */}
        <Card>
          <WidgetHead eyebrow="Bem-estar" title="Como você está?" to="bemestar" />
          {checkinToday ? (
            <div className="flex items-center gap-4">
              <span className="text-4xl" aria-hidden>{MOOD_EMOJI[checkinToday.mood]}</span>
              <div>
                <p className="font-semibold">Check-in de hoje feito</p>
                <p className="l-muted mt-1 text-sm">
                  {checkinToday.gratitude ? `Grata por: ${checkinToday.gratitude}` : "Você pode ajustar no módulo Bem-estar."}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="l-muted mb-3 text-sm">Um toque para registrar seu humor do dia.</p>
              <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Humor de hoje">
                {([1, 2, 3, 4, 5] as Mood[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={false}
                    aria-label={`Humor ${m} de 5`}
                    onClick={() => quickMood(m)}
                    className="l-focus flex min-h-[52px] items-center justify-center rounded-2xl border text-2xl transition-transform active:scale-95"
                    style={{ borderColor: "var(--l-border)", background: "var(--l-surface-2)" }}
                  >
                    {MOOD_EMOJI[m]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Metas */}
        <Card>
          <WidgetHead eyebrow="Metas" title="Em andamento" to="metas" />
          {topGoals.length === 0 ? (
            <Empty title="Nenhuma meta criada" text="Defina um alvo com número para acompanhar." />
          ) : (
            <ul className="space-y-4">
              {topGoals.map((g) => {
                const pct = g.target > 0 ? (g.current / g.target) * 100 : 0
                const color = AREAS[g.area].color
                return (
                  <li key={g.id}>
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <p className="truncate text-[14px] font-semibold">{g.title}</p>
                      <p className="l-muted shrink-0 text-xs font-semibold">{Math.round(pct)}%</p>
                    </div>
                    <ProgressBar value={pct} color={color as "teal"} label={g.title} />
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        {/* Leitura */}
        <Card>
          <WidgetHead eyebrow="Leitura" title={data.books.filter((b) => b.status === "lendo").length ? "Lendo agora" : "Nenhum livro em curso"} to="leitura" />
          {(() => {
            const reading = data.books.filter((b) => b.status === "lendo")[0]
            const year = today.slice(0, 4)
            const doneYear = data.books.filter((b) => b.status === "lido" && b.finishedAt?.startsWith(year)).length
            return (
              <div className="space-y-4">
                {reading ? (
                  <div>
                    <p className="truncate text-[14.5px] font-semibold">{reading.title}</p>
                    {reading.pages ? (
                      <>
                        <div className="l-muted my-2 text-xs">Página {reading.currentPage ?? 0} de {reading.pages}</div>
                        <ProgressBar value={((reading.currentPage ?? 0) / reading.pages) * 100} color={AREAS[reading.area].color as "teal"} label={`Progresso de ${reading.title}`} />
                      </>
                    ) : (
                      <p className="l-muted mt-1 text-xs">Cadastre o total de páginas para ver o progresso.</p>
                    )}
                  </div>
                ) : (
                  <Empty title="Sem leitura em andamento" text="Escolha o próximo livro da fila." />
                )}
                <p className="l-muted text-xs">
                  {data.readingGoal ? `${doneYear} de ${data.readingGoal} livros em ${year}` : `${doneYear} livro${doneYear === 1 ? "" : "s"} terminado${doneYear === 1 ? "" : "s"} em ${year}`}
                </p>
              </div>
            )
          })()}
        </Card>

        {/* Finanças do mês */}
        <Card>
          <WidgetHead eyebrow="Finanças" title="Neste mês" to="financas" />
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Entrou" value={formatBRL(totals.income)} tone="good" />
            <Stat label="Saiu" value={formatBRL(totals.expense)} tone={totals.expense > totals.income && totals.income > 0 ? "bad" : "default"} />
            <Stat label="Sobrou" value={formatBRL(totals.balance)} tone={totals.balance < 0 ? "bad" : "default"} />
          </div>
          {budgetRows.length > 0 && (
            <div className="mt-5 space-y-3">
              {budgetRows.map((b) => {
                const pct = (b.spent / b.limit) * 100
                return (
                  <div key={b.cat}>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="font-semibold">{b.cat}</span>
                      <span className="l-muted">
                        {formatBRL(b.spent)} de {formatBRL(b.limit)}
                      </span>
                    </div>
                    <ProgressBar value={pct} color={pct > 100 ? "coral" : pct > 80 ? "mustard" : "teal"} label={`Orçamento de ${b.cat}`} />
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        {/* Agenda */}
        <Card>
          <WidgetHead eyebrow="Próximos 7 dias" title="Agenda" to="calendario" />
          {events.length === 0 ? (
            <Empty icon={undefined} title="Agenda livre" text="Nenhum compromisso nos próximos dias." />
          ) : (
            <ul className="space-y-2.5">
              {events.map((e) => (
                <li key={e.id} className="flex items-center gap-3">
                  <div className={cn("flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl text-center", `area-${AREAS[e.area].color}`)}>
                    <span className="text-[10px] font-bold uppercase leading-none">{parseISO(e.date).toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "").slice(0, 3)}</span>
                    <span className="l-display text-[17px] leading-none">{parseISO(e.date).getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-semibold">{e.title}</p>
                    <p className="l-muted text-xs">
                      {e.time ? `${e.time} · ` : ""}
                      {relativeDay(e.date, today)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Atenção */}
        <Card>
          <WidgetHead eyebrow="Atenção" title="Pede um olhar" />
          {alerts.length === 0 && friendsDue.length === 0 ? (
            <Empty title="Tudo em dia" text="Nenhum lembrete pendente. Respira." />
          ) : (
            <ul className="space-y-2">
              {alerts.map((a) => (
                <li key={a.id}>
                  <a
                    href={`#${a.to}`}
                    className="l-focus flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-[14px] hover:bg-[var(--l-surface-2)]"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: a.tone === "warn" ? "var(--l-warn)" : "var(--l-sky)" }} aria-hidden />
                    <span className="min-w-0 truncate">{a.text}</span>
                  </a>
                </li>
              ))}
              {friendsDue.map((f) => {
                const due = friendDueInDays(f, today)
                return (
                  <li key={f.id}>
                    <a
                      href="#pessoas"
                      className="l-focus flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2 text-[14px] hover:bg-[var(--l-surface-2)]"
                    >
                      <Users className="h-4 w-4 shrink-0" style={{ color: "var(--l-pink)" }} aria-hidden />
                      <span className="min-w-0 truncate">
                        Falar com {f.name} {due === null ? "(ainda não registrado)" : due < 0 ? `· ${Math.abs(due)}d atrasado` : ""}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        {/* Viagem */}
        <Card tint>
          <WidgetHead eyebrow="Próxima viagem" title={nextTrip ? nextTrip.destination : "Nenhuma no radar"} to="viagens" />
          {nextTrip ? (
            <div className="flex items-center gap-4">
              <div className="l-display flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-3xl text-center" style={{ background: "var(--l-sky-soft)", color: "var(--l-sky)" }}>
                <span className="text-[28px] leading-none">{Math.max(0, diffDays(today, nextTrip.start!))}</span>
                <span className="text-[11px] font-semibold uppercase tracking-wide">dias</span>
              </div>
              <div className="min-w-0">
                <p className="l-muted text-sm">{formatDayShort(nextTrip.start!)}{nextTrip.end ? ` → ${formatDayShort(nextTrip.end)}` : ""}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <Plane className="h-4 w-4" aria-hidden /> {nextTrip.checklist.filter((c) => c.done).length}/{nextTrip.checklist.length} itens prontos
                </p>
              </div>
            </div>
          ) : (
            <p className="l-muted text-sm">Quando planejar a próxima, ela aparece aqui com contagem regressiva.</p>
          )}
        </Card>

        {/* Desejos */}
        <Card>
          <WidgetHead eyebrow="Wishlist" title="Próximos desejos" to="desejos" />
          {wishTop.length === 0 ? (
            <Empty icon={Gift} title="Lista vazia" text="Guarde o que quer com preço e prioridade." />
          ) : (
            <ul className="space-y-2">
              {wishTop.map((w) => (
                <li key={w.id} className="flex items-center justify-between gap-3 rounded-xl px-1 py-1.5">
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-semibold">{w.name}</p>
                    <p className="l-muted text-xs">{WISH_STATUS_LABEL[w.status]} · prioridade {PRIORITY_LABEL[w.priority].toLowerCase()}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">{formatBRL(w.priceCents)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Gatos & casa */}
        <Card>
          <WidgetHead eyebrow="Lar & gatos" title={data.cats.length ? data.cats.map((c) => c.name).join(" e ") : "Sua família de pets"} to="lar" />
          {data.cats.length === 0 ? (
            <Empty icon={Cat} title="Cadastre os gatos" text="Ração, vacinas e vermífugo com lembretes automáticos." />
          ) : (
            <ul className="space-y-2">
              {data.cats.map((c) => {
                const left = foodDaysLeft(c, today)
                return (
                  <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl px-1 py-1.5">
                    <span className="flex items-center gap-2 text-[14.5px] font-semibold">
                      <span className="area-mustard flex h-8 w-8 items-center justify-center rounded-full"><Cat className="h-4 w-4" aria-hidden /></span>
                      {c.name}
                    </span>
                    <span className="l-muted text-xs">
                      {left === null ? "ração sem data" : left <= 0 ? "ração acabou" : `ração: ${left} dias`}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        {/* Mercado */}
        <Card>
          <WidgetHead eyebrow="Mercado" title={groceriesOpen ? `${groceriesOpen} itens na lista` : "Lista em dia"} to="mercado" />
          <div className="flex items-center gap-4">
            <ProgressRing value={data.groceries.length ? ((data.groceries.length - groceriesOpen) / data.groceries.length) * 100 : 0} />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-semibold"><ShoppingBasket className="h-4 w-4" aria-hidden /> {data.groceries.length - groceriesOpen} no carrinho</p>
              <p className="l-muted mt-1 text-xs">Marque conforme pega no mercado.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Rodapé de contexto */}
      <p className="l-muted flex items-center justify-center gap-2 pt-2 text-xs">
        <Smile className="h-3.5 w-3.5" aria-hidden /> Seus dados ficam salvos e aparecem em todos os seus aparelhos.
      </p>
    </div>
  )
}

