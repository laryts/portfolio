// Modelo de dados do "Lari's life". Um único documento JSON, versionado.
// Datas são strings "YYYY-MM-DD" (horário local). Dinheiro é sempre em centavos (inteiro).

export const AREAS = {
  trabalho: { label: "Trabalho", color: "teal" },
  niido: { label: "Niido", color: "plum" },
  pixie: { label: "Pixie", color: "coral" },
  viagens: { label: "Viagens", color: "sky" },
  casa: { label: "Casa", color: "mint" },
  gatos: { label: "Gatos", color: "mustard" },
  financas: { label: "Finanças", color: "emerald" },
  saude: { label: "Saúde & mente", color: "lilac" },
  amizades: { label: "Amizades", color: "pink" },
  lazer: { label: "Lazer & hobbies", color: "rose" },
  pessoal: { label: "Pessoal", color: "ink" },
} as const

export type AreaId = keyof typeof AREAS
export const AREA_IDS = Object.keys(AREAS) as AreaId[]

export type Priority = 1 | 2 | 3 // 1 = alta, 2 = média, 3 = baixa
export const PRIORITY_LABEL: Record<Priority, string> = { 1: "Alta", 2: "Média", 3: "Baixa" }

export interface Task {
  id: string
  title: string
  area: AreaId
  priority: Priority
  due?: string
  done: boolean
  doneAt?: string
  projectId?: string
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  area: AreaId
  unit: string // ex.: "R$", "livros", "km", "%"
  current: number
  target: number
  deadline?: string
  createdAt: string
}

export interface Habit {
  id: string
  name: string
  area: AreaId
  doneDates: string[]
  createdAt: string
}

export type TxType = "in" | "out"

export const INCOME_CATEGORIES = ["Salário", "Niido", "Pixie", "Freelas", "Outras receitas"] as const
export const EXPENSE_CATEGORIES = [
  "Casa",
  "Mercado",
  "Gatos",
  "Transporte",
  "Saúde",
  "Lazer",
  "Viagens",
  "Assinaturas",
  "Roupas",
  "Negócios",
  "Outros",
] as const

export interface Transaction {
  id: string
  type: TxType
  amountCents: number
  category: string
  description: string
  date: string
  createdAt: string
}

export interface Investment {
  id: string
  name: string
  kind: string // Renda fixa, Ações, FIIs, Cripto, Previdência...
  investedCents: number
  currentCents: number
  updatedAt: string
}

export type WishStatus = "quero" | "pesquisando" | "comprado" | "desisti"
export const WISH_STATUS_LABEL: Record<WishStatus, string> = {
  quero: "Quero",
  pesquisando: "Pesquisando",
  comprado: "Comprado",
  desisti: "Desisti",
}

export interface WishItem {
  id: string
  name: string
  priceCents: number
  priority: Priority
  status: WishStatus
  link?: string
  notes?: string
  createdAt: string
}

export type ProjectStatus = "ideia" | "andamento" | "pausado" | "concluido"
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  ideia: "Ideia",
  andamento: "Em andamento",
  pausado: "Pausado",
  concluido: "Concluído",
}

export interface Project {
  id: string
  name: string
  area: AreaId
  status: ProjectStatus
  progress: number // 0–100
  nextStep?: string
  link?: string
  notes?: string
  updatedAt: string
}

export interface CalEvent {
  id: string
  title: string
  date: string
  time?: string // "HH:mm"
  area: AreaId
  notes?: string
}

export interface Moment {
  id: string
  date: string
  title: string
  text: string
  mood?: Mood
  tags: string[]
  createdAt: string
}

export type Mood = 1 | 2 | 3 | 4 | 5
export const MOOD_EMOJI: Record<Mood, string> = { 1: "😣", 2: "😕", 3: "😐", 4: "🙂", 5: "😄" }

export interface Checkin {
  date: string
  mood: Mood
  energy: Mood
  sleepHours?: number
  gratitude?: string
  note?: string
}

export interface Cat {
  id: string
  name: string
  birthday?: string
  food?: string
  foodRunsOut?: string // data estimada em que a ração acaba
  notes?: string
}

export interface Reminder {
  id: string
  label: string
  area: AreaId
  date: string // próxima data
  everyDays?: number // se repete, ao concluir avança este número de dias
  catId?: string
  createdAt: string
}

export type GroceryCategory = "Hortifruti" | "Mercearia" | "Açougue/Frios" | "Limpeza" | "Higiene" | "Pet" | "Outros"
export const GROCERY_CATEGORIES: GroceryCategory[] = [
  "Hortifruti",
  "Mercearia",
  "Açougue/Frios",
  "Limpeza",
  "Higiene",
  "Pet",
  "Outros",
]

export interface GroceryItem {
  id: string
  name: string
  qty?: string
  category: GroceryCategory
  done: boolean
  createdAt: string
}

export interface TripChecklistItem {
  id: string
  text: string
  done: boolean
}

export interface Trip {
  id: string
  destination: string
  start?: string
  end?: string
  budgetCents?: number
  notes?: string
  checklist: TripChecklistItem[]
  createdAt: string
}

export interface Friend {
  id: string
  name: string
  everyDays: number // frequência desejada de contato
  lastContact?: string
  birthday?: string
  notes?: string
  createdAt: string
}

export type BookStatus = "fila" | "lendo" | "lido" | "abandonado"
export const BOOK_STATUS_LABEL: Record<BookStatus, string> = {
  fila: "Na fila",
  lendo: "Lendo",
  lido: "Lido",
  abandonado: "Abandonado",
}

export interface Book {
  id: string
  title: string
  author?: string
  status: BookStatus
  area: AreaId // ex.: "pixie" para leituras de trabalho
  pages?: number
  currentPage?: number
  rating?: Mood
  startedAt?: string
  finishedAt?: string
  notes?: string
  goodreadsId?: string // id do livro no export do Goodreads, evita duplicar na reimportação
  createdAt: string
  updatedAt: string
}

export interface LifeData {
  version: 1
  updatedAt: string
  tasks: Task[]
  goals: Goal[]
  habits: Habit[]
  transactions: Transaction[]
  budgets: Partial<Record<string, number>> // categoria de despesa -> limite mensal em centavos
  investments: Investment[]
  wishlist: WishItem[]
  projects: Project[]
  events: CalEvent[]
  moments: Moment[]
  checkins: Checkin[]
  cats: Cat[]
  reminders: Reminder[]
  groceries: GroceryItem[]
  trips: Trip[]
  friends: Friend[]
  books: Book[]
  readingGoal?: number // livros lidos por ano
}

export type ListKey =
  | "tasks"
  | "goals"
  | "habits"
  | "transactions"
  | "investments"
  | "wishlist"
  | "projects"
  | "events"
  | "moments"
  | "checkins"
  | "cats"
  | "reminders"
  | "groceries"
  | "trips"
  | "friends"
  | "books"
