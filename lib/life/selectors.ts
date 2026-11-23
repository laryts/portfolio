// Cálculos puros sobre o LifeData. Sem React — fáceis de testar e reutilizar.
import { addDays, diffDays, monthKey, startOfWeek, todayISO, weekDays } from "./dates"
import type { Habit, LifeData, Reminder, Transaction, Friend, Cat, Task } from "./types"

export function isOverdue(due: string | undefined, today = todayISO()): boolean {
  return !!due && due < today
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.due && b.due && a.due !== b.due) return a.due < b.due ? -1 : 1
    if (a.due && !b.due) return -1
    if (!a.due && b.due) return 1
    return a.priority - b.priority
  })
}

export function habitDone(habit: Habit, date: string): boolean {
  return habit.doneDates.includes(date)
}

/** Sequência atual de dias consecutivos (conta até hoje; se hoje ainda não foi feito, não quebra). */
export function habitStreak(habit: Habit, today = todayISO()): number {
  const set = new Set(habit.doneDates)
  let cursor = set.has(today) ? today : addDays(today, -1)
  let streak = 0
  while (set.has(cursor)) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

/** Percentual de conclusão nos últimos `days` dias (inclui hoje). */
export function habitRate(habit: Habit, days: number, today = todayISO()): number {
  let done = 0
  for (let i = 0; i < days; i++) {
    if (habitDone(habit, addDays(today, -i))) done += 1
  }
  return Math.round((done / days) * 100)
}

export function monthTotals(transactions: Transaction[], month: string) {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (monthKey(t.date) !== month) continue
    if (t.type === "in") income += t.amountCents
    else expense += t.amountCents
  }
  return { income, expense, balance: income - expense }
}

export function expenseByCategory(transactions: Transaction[], month: string): Array<{ category: string; cents: number }> {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== "out" || monthKey(t.date) !== month) continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amountCents)
  }
  return [...map.entries()].map(([category, cents]) => ({ category, cents })).sort((a, b) => b.cents - a.cents)
}

export function lastMonths(month: string, count: number): string[] {
  const [y, m] = month.split("-").map(Number)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(y, m - 1 - (count - 1 - i), 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
  })
}

export function friendDueInDays(friend: Friend, today = todayISO()): number | null {
  if (!friend.lastContact) return null
  const nextContact = addDays(friend.lastContact, friend.everyDays)
  return diffDays(today, nextContact)
}

/** Amigos que pedem contato: nunca falados ou com prazo vencido/próximo (<= 3 dias). */
export function friendsToContact(friends: Friend[], today = todayISO()): Friend[] {
  return friends
    .filter((f) => {
      const due = friendDueInDays(f, today)
      return due === null || due <= 3
    })
    .sort((a, b) => {
      const da = friendDueInDays(a, today) ?? -9999
      const db = friendDueInDays(b, today) ?? -9999
      return da - db
    })
}

export function foodDaysLeft(cat: Cat, today = todayISO()): number | null {
  if (!cat.foodRunsOut) return null
  return diffDays(today, cat.foodRunsOut)
}

export function upcomingReminders(reminders: Reminder[], days: number, today = todayISO()): Reminder[] {
  const limit = addDays(today, days)
  return reminders.filter((r) => r.date <= limit).sort((a, b) => (a.date < b.date ? -1 : 1))
}

export function weekSummary(data: LifeData, today = todayISO()) {
  const days = weekDays(today)
  const start = startOfWeek(today)
  const end = days[6]
  const inWeek = (iso: string | undefined) => !!iso && iso >= start && iso <= end

  const tasksDone = data.tasks.filter((t) => t.done && inWeek(t.doneAt?.slice(0, 10))).length
  const tasksOpen = data.tasks.filter((t) => !t.done).length

  let habitChecks = 0
  const possible = data.habits.length * Math.min(7, diffDays(start, today) + 1)
  for (const h of data.habits) {
    for (const d of h.doneDates) if (inWeek(d) && d <= today) habitChecks += 1
  }
  const habitRatePct = possible > 0 ? Math.round((habitChecks / possible) * 100) : 0

  const spent = data.transactions
    .filter((t) => t.type === "out" && inWeek(t.date))
    .reduce((sum, t) => sum + t.amountCents, 0)

  const moments = data.moments.filter((m) => inWeek(m.date)).length
  const events = data.events.filter((e) => inWeek(e.date)).length

  return {
    days,
    tasksDone,
    tasksOpen,
    habitRatePct,
    spent,
    moments,
    events,
  }
}

export function tasksDueOn(tasks: Task[], date: string): Task[] {
  return tasks.filter((t) => t.due === date)
}
