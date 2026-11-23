"use client"

import * as React from "react"
import { ShoppingBasket, Trash2 } from "lucide-react"
import { useLife } from "../store"
import { GROCERY_CATEGORIES, type GroceryCategory, type GroceryItem } from "@/lib/life/types"
import { Card, Check, Empty, PageHeader, Select, TextInput, haptic } from "../ui"
import { cn } from "@/lib/utils"

export function GroceriesView() {
  const { data, add, patch, remove, update } = useLife()
  const [name, setName] = React.useState("")
  const [qty, setQty] = React.useState("")
  const [category, setCategory] = React.useState<GroceryCategory>("Mercearia")

  const open = data.groceries.filter((g) => !g.done).length
  const doneCount = data.groceries.length - open

  const grouped = React.useMemo(() => {
    const map = new Map<GroceryCategory, GroceryItem[]>()
    for (const cat of GROCERY_CATEGORIES) map.set(cat, [])
    for (const g of data.groceries) map.get(g.category)?.push(g)
    return GROCERY_CATEGORIES.map((c) => ({
      category: c,
      items: (map.get(c) ?? []).sort((a, b) => Number(a.done) - Number(b.done) || a.name.localeCompare(b.name)),
    })).filter((g) => g.items.length > 0)
  }, [data.groceries])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    add("groceries", { name: n, qty: qty.trim() || undefined, category, done: false })
    setName("")
    setQty("")
    haptic(8)
  }

  const clearDone = () => {
    update((prev) => ({ ...prev, groceries: prev.groceries.filter((g) => !g.done) }))
    haptic([10, 30, 10])
  }

  return (
    <div>
      <PageHeader
        eyebrow="Vida & casa"
        title="Mercado"
        description={open ? `${open} item${open === 1 ? "" : "ns"} para pegar` : "Lista em dia. Nada faltando por enquanto."}
        action={
          doneCount > 0 ? (
            <button type="button" className="l-btn l-btn-ghost l-focus" onClick={clearDone}>
              Limpar comprados ({doneCount})
            </button>
          ) : undefined
        }
      />

      <form onSubmit={submit} className="l-card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center" aria-label="Adicionar item ao mercado">
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="O que falta? Ex.: ração úmida, leite, detergente"
          aria-label="Nome do item"
          maxLength={100}
          className="sm:flex-[2]"
        />
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2 sm:flex sm:flex-1">
          <TextInput value={qty} onChange={(e) => setQty(e.target.value)} placeholder="Qtd." aria-label="Quantidade" maxLength={20} className="min-w-0" />
          <Select value={category} onChange={(e) => setCategory(e.target.value as GroceryCategory)} aria-label="Categoria" className="min-w-0">
            {GROCERY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <button type="submit" className="l-btn l-btn-plum l-focus h-11 px-4" disabled={!name.trim()}>Adicionar</button>
        </div>
      </form>

      {grouped.length === 0 ? (
        <Card>
          <Empty icon={ShoppingBasket} title="Lista vazia" text="Anote conforme acabar — é mais fácil do que lembrar no mercado." />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {grouped.map((g) => (
            <section key={g.category} className="l-card p-4 md:p-5" aria-labelledby={`g-${g.category}`}>
              <h2 id={`g-${g.category}`} className="l-eyebrow mb-2 flex items-center justify-between">
                {g.category}
                <span className="l-muted">{g.items.filter((i) => !i.done).length} de {g.items.length}</span>
              </h2>
              <ul>
                {g.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-2 py-1">
                    <Check label={`Pegou ${item.name}`} checked={item.done} onChange={(done) => patch("groceries", item.id, { done })} />
                    <span className={cn("min-w-0 flex-1 truncate text-[15px]", item.done && "l-muted line-through")}>
                      {item.name}
                      {item.qty && <span className="l-muted"> · {item.qty}</span>}
                    </span>
                    <button type="button" className="l-btn-icon l-focus" aria-label={`Remover ${item.name}`} onClick={() => remove("groceries", item.id)}>
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
