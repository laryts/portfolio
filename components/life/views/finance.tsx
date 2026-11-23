"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChevronLeft, ChevronRight, PiggyBank, Plus, TrendingUp, Wallet } from "lucide-react"
import { useLife } from "../store"
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  type Investment,
  type TxType,
  type Transaction,
} from "@/lib/life/types"
import { formatDayShort, formatMonthTitle, monthKey, shiftMonth, todayISO } from "@/lib/life/dates"
import { formatBRL, parseBRLToCents, centsToInput } from "@/lib/life/format"
import { expenseByCategory, lastMonths, monthTotals } from "@/lib/life/selectors"
import { AddButton, Card, Empty, Field, PageHeader, ProgressBar, Segmented, Select, Sheet, Stat, TextInput, haptic } from "../ui"
import { ActionRow, RowActions, emptyToUndef, useChartPalette } from "./shared"
import { cn } from "@/lib/utils"

function TxSheet({ open, onOpenChange, tx, defaultType }: { open: boolean; onOpenChange: (o: boolean) => void; tx: Transaction | null; defaultType: TxType }) {
  const { add, patch } = useLife()
  const [type, setType] = React.useState<TxType>(defaultType)
  const [amount, setAmount] = React.useState("")
  const [category, setCategory] = React.useState<string>(EXPENSE_CATEGORIES[0])
  const [description, setDescription] = React.useState("")
  const [date, setDate] = React.useState(todayISO())

  React.useEffect(() => {
    if (!open) return
    const t = tx?.type ?? defaultType
    setType(t)
    setAmount(centsToInput(tx?.amountCents))
    setCategory(tx?.category ?? (t === "in" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]))
    setDescription(tx?.description ?? "")
    setDate(tx?.date ?? todayISO())
  }, [open, tx, defaultType])

  const cats: readonly string[] = type === "in" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const cents = parseBRLToCents(amount)
  const valid = cents !== null && cents > 0 && !!date

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid || cents === null) return
    const payload = {
      type,
      amountCents: cents,
      category: cats.includes(category) ? category : cats[0],
      description: description.trim() || (type === "in" ? "Entrada" : "Gasto"),
      date,
    }
    if (tx) patch("transactions", tx.id, payload)
    else add("transactions", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={tx ? "Editar lançamento" : "Novo lançamento"}
      description="Valor em reais. Tudo fica registrado no mês."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Segmented<TxType>
          label="Tipo de lançamento"
          value={type}
          onChange={(t) => {
            setType(t)
            setCategory(t === "in" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0])
          }}
          options={[
            { value: "out", label: "Gasto" },
            { value: "in", label: "Entrada" },
          ]}
        />
        <Field label="Valor">
          <div className="relative">
            <span className="l-muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold">R$</span>
            <TextInput
              autoFocus
              inputMode="decimal"
              className="pl-12 text-[20px] font-semibold"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              aria-invalid={amount.length > 0 && !valid}
            />
          </div>
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Categoria">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {cats.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Data">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>
        <Field label="Descrição" hint="Opcional">
          <TextInput value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex.: mercado da semana" maxLength={120} />
        </Field>
      </form>
    </Sheet>
  )
}

function BudgetSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { data, update } = useLife()
  const [values, setValues] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    if (!open) return
    const next: Record<string, string> = {}
    for (const c of EXPENSE_CATEGORIES) next[c] = centsToInput(data.budgets[c])
    setValues(next)
  }, [open, data.budgets])

  const save = () => {
    const budgets: Record<string, number> = {}
    for (const c of EXPENSE_CATEGORIES) {
      const cents = parseBRLToCents(values[c] ?? "")
      if (cents && cents > 0) budgets[c] = cents
    }
    update((prev) => ({ ...prev, budgets }))
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Orçamento mensal"
      description="Deixe em branco o que não quer limitar."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" onClick={save}>Salvar limites</button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2">
        {EXPENSE_CATEGORIES.map((c) => (
          <Field key={c} label={c}>
            <div className="relative">
              <span className="l-muted pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm">R$</span>
              <TextInput
                inputMode="decimal"
                className="pl-11"
                value={values[c] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [c]: e.target.value }))}
                placeholder="—"
              />
            </div>
          </Field>
        ))}
      </div>
    </Sheet>
  )
}

function InvestmentSheet({ open, onOpenChange, inv }: { open: boolean; onOpenChange: (o: boolean) => void; inv: Investment | null }) {
  const { add, patch } = useLife()
  const [name, setName] = React.useState("")
  const [kind, setKind] = React.useState("Renda fixa")
  const [invested, setInvested] = React.useState("")
  const [current, setCurrent] = React.useState("")

  React.useEffect(() => {
    if (!open) return
    setName(inv?.name ?? "")
    setKind(inv?.kind ?? "Renda fixa")
    setInvested(centsToInput(inv?.investedCents))
    setCurrent(centsToInput(inv?.currentCents))
  }, [open, inv])

  const investedC = parseBRLToCents(invested)
  const currentC = parseBRLToCents(current)
  const valid = name.trim().length > 0 && investedC !== null && currentC !== null

  const save = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!valid || investedC === null || currentC === null) return
    const payload = { name: name.trim(), kind: kind.trim() || "Outros", investedCents: investedC, currentCents: currentC }
    if (inv) patch("investments", inv.id, payload)
    else add("investments", payload)
    haptic(8)
    onOpenChange(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={inv ? "Editar investimento" : "Novo investimento"}
      description="Atualize o valor atual quando quiser ver o retorno."
      footer={
        <>
          <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => onOpenChange(false)}>Cancelar</button>
          <button type="button" className="l-btn l-btn-plum l-focus" disabled={!valid} onClick={() => save()}>Salvar</button>
        </>
      }
    >
      <form onSubmit={save} className="space-y-5 pb-4">
        <Field label="Nome">
          <TextInput autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Tesouro IPCA+ 2035" maxLength={100} />
        </Field>
        <Field label="Tipo">
          <TextInput list="inv-kinds" value={kind} onChange={(e) => setKind(e.target.value)} maxLength={40} />
          <datalist id="inv-kinds">
            {["Renda fixa", "Ações", "FIIs", "Previdência", "Cripto", "Reserva de emergência", "Outros"].map((k) => <option key={k} value={k} />)}
          </datalist>
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Total investido">
            <TextInput inputMode="decimal" value={invested} onChange={(e) => setInvested(e.target.value)} placeholder="0,00" />
          </Field>
          <Field label="Valor atual">
            <TextInput inputMode="decimal" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0,00" />
          </Field>
        </div>
      </form>
    </Sheet>
  )
}

export function FinanceView() {
  const { data, remove } = useLife()
  const palette = useChartPalette()
  const today = todayISO()
  const [month, setMonth] = React.useState(monthKey(today))
  const [txSheet, setTxSheet] = React.useState<{ open: boolean; tx: Transaction | null; type: TxType }>({ open: false, tx: null, type: "out" })
  const [invSheet, setInvSheet] = React.useState<{ open: boolean; inv: Investment | null }>({ open: false, inv: null })
  const [budgetOpen, setBudgetOpen] = React.useState(false)

  const totals = React.useMemo(() => monthTotals(data.transactions, month), [data.transactions, month])
  const byCat = React.useMemo(() => expenseByCategory(data.transactions, month), [data.transactions, month])
  const trend = React.useMemo(
    () =>
      lastMonths(month, 6).map((m) => {
        const t = monthTotals(data.transactions, m)
        return {
          key: m,
          label: new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)) - 1, 1).toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
          entrou: t.income / 100,
          saiu: t.expense / 100,
        }
      }),
    [data.transactions, month]
  )
  const monthTx = React.useMemo(
    () => data.transactions.filter((t) => monthKey(t.date) === month).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [data.transactions, month]
  )
  const savingsRate = totals.income > 0 ? Math.round(((totals.income - totals.expense) / totals.income) * 100) : null

  const invTotals = data.investments.reduce(
    (acc, i) => ({ invested: acc.invested + i.investedCents, current: acc.current + i.currentCents }),
    { invested: 0, current: 0 }
  )
  const invReturn = invTotals.invested > 0 ? ((invTotals.current - invTotals.invested) / invTotals.invested) * 100 : 0

  const pieColors = [palette.teal, palette.coral, palette.mustard, palette.sky, palette.mint, palette.plum, palette.lilac, palette.pink, palette.rose, palette.emerald, palette.ink]

  const isCurrentMonth = month === monthKey(today)

  return (
    <div>
      <PageHeader
        eyebrow="Dinheiro"
        title="Finanças"
        description="Entradas, gastos, orçamento e investimentos em um só lugar."
        action={
          <>
            <button type="button" className="l-btn l-btn-ghost l-focus" onClick={() => setBudgetOpen(true)}>Orçamentos</button>
            <AddButton label="Lançar" onClick={() => setTxSheet({ open: true, tx: null, type: "out" })} />
          </>
        }
      />

      {/* Navegador de mês */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <button type="button" className="l-btn-icon l-focus" onClick={() => setMonth((m) => shiftMonth(m, -1))} aria-label="Mês anterior">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <p className="l-display min-w-[180px] text-center text-[20px]">{formatMonthTitle(month)}</p>
          <button type="button" className="l-btn-icon l-focus" onClick={() => setMonth((m) => shiftMonth(m, 1))} aria-label="Próximo mês">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
        {!isCurrentMonth && (
          <button type="button" className="l-btn l-btn-ghost l-focus h-11 px-4" onClick={() => setMonth(monthKey(today))}>
            Este mês
          </button>
        )}
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="col-span-1">
          <Stat label="Entrou" value={formatBRL(totals.income)} tone="good" />
        </Card>
        <Card className="col-span-1">
          <Stat label="Saiu" value={formatBRL(totals.expense)} />
        </Card>
        <Card className="col-span-1">
          <Stat label="Sobrou" value={formatBRL(totals.balance)} tone={totals.balance < 0 ? "bad" : "default"} />
        </Card>
        <Card className="col-span-1">
          <Stat label="Taxa de poupança" value={savingsRate === null ? "—" : `${savingsRate}%`} hint={savingsRate !== null && savingsRate >= 20 ? "Ótimo ritmo" : "Meta sugerida: 20%"} />
        </Card>
      </div>

      {/* Gráficos */}
      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="l-display text-[19px]">Últimos 6 meses</h2>
            <div className="l-muted flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: palette.teal }} />Entrou</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: palette.coral }} />Saiu</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            {trend.every((t) => t.entrou === 0 && t.saiu === 0) ? (
              <Empty title="Sem lançamentos ainda" text="Quando você registrar entradas e gastos, o gráfico aparece aqui." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
                  <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: palette.muted, fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: palette.muted, fontSize: 11 }} tickFormatter={(v) => `${Math.round(Number(v)).toLocaleString("pt-BR")}`} width={64} />
                  <Tooltip
                    cursor={{ fill: palette.grid, opacity: 0.4 }}
                    formatter={(value) => formatBRL(Math.round(Number(value) * 100))}
                    contentStyle={{ background: palette.surface, border: `1px solid ${palette.grid}`, borderRadius: 12, fontSize: 13 }}
                  />
                  <Bar dataKey="entrou" name="Entrou" fill={palette.teal} radius={[8, 8, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="saiu" name="Saiu" fill={palette.coral} radius={[8, 8, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="l-display mb-4 text-[19px]">Onde foi o dinheiro</h2>
          {byCat.length === 0 ? (
            <Empty title="Sem gastos neste mês" text="As categorias aparecem conforme você lança." />
          ) : (
            <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
              <div className="relative h-[170px] w-[170px] shrink-0">
                <PieChart width={170} height={170}>
                  <Pie data={byCat} dataKey="cents" nameKey="category" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none" isAnimationActive>
                    {byCat.map((entry, i) => (
                      <Cell key={entry.category} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatBRL(Number(value))} contentStyle={{ background: palette.surface, border: `1px solid ${palette.grid}`, borderRadius: 12, fontSize: 13 }} />
                </PieChart>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="l-muted text-[11px] font-semibold uppercase tracking-wide">Total</span>
                  <span className="l-display text-[16px]">{formatBRL(totals.expense)}</span>
                </div>
              </div>
              <ul className="w-full min-w-0 flex-1 space-y-2">
                {byCat.slice(0, 6).map((c, i) => {
                  const pct = totals.expense ? Math.round((c.cents / totals.expense) * 100) : 0
                  const limit = data.budgets[c.category]
                  return (
                    <li key={c.category} className="text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                          <span className="truncate">{c.category}</span>
                        </span>
                        <span className="l-muted shrink-0 text-xs font-semibold">{pct}%</span>
                      </div>
                      {limit ? (
                        <p className="l-muted mt-0.5 pl-[18px] text-xs">
                          {formatBRL(c.cents)} de {formatBRL(limit)}
                        </p>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </Card>
      </div>

      {/* Orçamentos ativos */}
      {Object.values(data.budgets).some((v) => v && v > 0) && (
        <Card className="mt-4">
          <h2 className="l-display mb-4 text-[19px]">Orçamentos do mês</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {EXPENSE_CATEGORIES.filter((c) => (data.budgets[c] ?? 0) > 0).map((c) => {
              const spent = byCat.find((x) => x.category === c)?.cents ?? 0
              const limit = data.budgets[c] as number
              const pct = (spent / limit) * 100
              return (
                <div key={c}>
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <p className="font-semibold">{c}</p>
                    <p className={cn("text-xs font-semibold", pct > 100 ? "" : "l-muted")} style={pct > 100 ? { color: "var(--l-danger)" } : undefined}>
                      {pct > 100 ? `estourou ${formatBRL(spent - limit)}` : `restam ${formatBRL(limit - spent)}`}
                    </p>
                  </div>
                  <ProgressBar value={pct} color={pct > 100 ? "coral" : pct > 80 ? "mustard" : "teal"} label={`Orçamento de ${c}`} />
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Lançamentos do mês */}
      <section className="mt-8" aria-labelledby="tx-title">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="tx-title" className="l-display text-[19px]">Lançamentos</h2>
          <span className="l-muted text-xs font-semibold">{monthTx.length} no mês</span>
        </div>
        <div className="l-card px-4 md:px-5">
          {monthTx.length === 0 ? (
            <Empty icon={Wallet} title="Nenhum lançamento neste mês" text="Anote entradas e gastos assim que acontecerem." />
          ) : (
            <ul>
              {monthTx.map((t) => (
                <ActionRow key={t.id}>
                  <span
                    className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold", t.type === "in" ? "area-teal" : "area-coral")}
                    aria-hidden
                  >
                    {t.type === "in" ? "+" : "−"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-medium">{t.description}</p>
                    <p className="l-muted text-xs">{t.category} · {formatDayShort(t.date)}</p>
                  </div>
                  <p className="shrink-0 text-[15px] font-semibold" style={{ color: t.type === "in" ? "var(--l-ok)" : undefined }}>
                    {t.type === "in" ? "+" : "−"} {formatBRL(t.amountCents)}
                  </p>
                  <RowActions
                    label={t.description}
                    onEdit={() => setTxSheet({ open: true, tx: t, type: t.type })}
                    onDelete={() => remove("transactions", t.id)}
                  />
                </ActionRow>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Investimentos */}
      <section className="mt-8" aria-labelledby="inv-title">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 id="inv-title" className="l-display text-[19px]">Investimentos</h2>
          <button type="button" className="l-btn l-btn-ghost l-focus h-11" onClick={() => setInvSheet({ open: true, inv: null })}>
            <Plus className="h-4 w-4" aria-hidden /> Adicionar
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <Card tint className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5" style={{ color: "var(--l-teal)" }} aria-hidden />
              <p className="l-eyebrow">Patrimônio investido</p>
            </div>
            <p className="l-display mt-3 text-[34px] leading-none">{formatBRL(invTotals.current)}</p>
            <p className="l-muted mt-2 text-sm">
              Aportado {formatBRL(invTotals.invested)} ·{" "}
              <span style={{ color: invReturn >= 0 ? "var(--l-ok)" : "var(--l-danger)" }} className="font-semibold">
                {invReturn >= 0 ? "+" : ""}
                {invReturn.toFixed(1).replace(".", ",")}%
              </span>
            </p>
            {data.investments.length > 0 && (
              <div className="mt-5 space-y-2">
                {Object.entries(
                  data.investments.reduce<Record<string, number>>((acc, i) => {
                    acc[i.kind] = (acc[i.kind] ?? 0) + i.currentCents
                    return acc
                  }, {})
                ).map(([kind, cents], i) => {
                  const pct = invTotals.current ? (cents / invTotals.current) * 100 : 0
                  return (
                    <div key={kind}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-semibold">{kind}</span>
                        <span className="l-muted">{Math.round(pct)}%</span>
                      </div>
                      <div className="l-track h-2">
                        <div className="l-fill" style={{ width: `${pct}%`, background: pieColors[i % pieColors.length] }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
          <Card className="lg:col-span-2">
            {data.investments.length === 0 ? (
              <Empty icon={TrendingUp} title="Nenhum investimento cadastrado" text="Registre o que tem para acompanhar o patrimônio ao longo do tempo." />
            ) : (
              <ul>
                {data.investments.map((i) => {
                  const r = i.investedCents > 0 ? ((i.currentCents - i.investedCents) / i.investedCents) * 100 : 0
                  return (
                    <ActionRow key={i.id}>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{i.name}</p>
                        <p className="l-muted text-xs">{i.kind} · atualizado {formatDayShort(i.updatedAt.slice(0, 10))}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatBRL(i.currentCents)}</p>
                        <p className="text-xs font-semibold" style={{ color: r >= 0 ? "var(--l-ok)" : "var(--l-danger)" }}>
                          {r >= 0 ? "+" : ""}{r.toFixed(1).replace(".", ",")}%
                        </p>
                      </div>
                      <RowActions
                        label={i.name}
                        onEdit={() => setInvSheet({ open: true, inv: i })}
                        onDelete={() => remove("investments", i.id)}
                      />
                    </ActionRow>
                  )
                })}
              </ul>
            )}
          </Card>
        </div>
      </section>

      <TxSheet open={txSheet.open} onOpenChange={(open) => setTxSheet((s) => ({ ...s, open }))} tx={txSheet.tx} defaultType={txSheet.type} />
      <InvestmentSheet open={invSheet.open} onOpenChange={(open) => setInvSheet((s) => ({ ...s, open }))} inv={invSheet.inv} />
      <BudgetSheet open={budgetOpen} onOpenChange={setBudgetOpen} />
    </div>
  )
}
