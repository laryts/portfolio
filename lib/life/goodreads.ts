// Importador do CSV exportado pelo Goodreads (My Books → Import and export → Export Library).
// Tudo roda no navegador; o arquivo nunca sai do aparelho.
import type { AreaId, Book, BookStatus, Mood } from "./types"

export type ImportedBook = Omit<Book, "id" | "createdAt" | "updatedAt">

export interface GoodreadsPreview {
  books: ImportedBook[]
  duplicates: number
  invalid: number
  counts: Record<BookStatus, number>
}

/** Parser CSV (RFC 4180): aspas, vírgulas e quebras de linha dentro de campos. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ",") {
      row.push(field)
      field = ""
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++
      row.push(field)
      rows.push(row)
      row = []
      field = ""
    } else {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""))
}

/** "2024/03/15" → "2024-03-15". Retorna undefined se não parecer uma data. */
export function goodreadsDate(value: string | undefined): string | undefined {
  const m = value?.trim().match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/)
  if (!m) return undefined
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`
}

const STATUS_BY_SHELF: Record<string, BookStatus> = {
  "to-read": "fila",
  "currently-reading": "lendo",
  read: "lido",
}

const AREA_SHELVES: AreaId[] = ["pixie", "niido", "trabalho"]

function areaFromShelves(shelves: string): AreaId {
  const list = shelves.toLowerCase().split(",").map((s) => s.trim())
  return AREA_SHELVES.find((a) => list.includes(a)) ?? "pessoal"
}

function keyOf(title: string, author: string | undefined) {
  return `${title.trim().toLowerCase()}|${(author ?? "").trim().toLowerCase()}`
}

/**
 * Lê o CSV e devolve os livros prontos para importar, já sem os que existem.
 * `existing` evita duplicar por id do Goodreads ou por título + autor.
 */
export function previewGoodreadsCsv(text: string, existing: Book[]): GoodreadsPreview {
  const rows = parseCsv(text.replace(/^﻿/, ""))
  const empty: GoodreadsPreview = {
    books: [],
    duplicates: 0,
    invalid: 0,
    counts: { fila: 0, lendo: 0, lido: 0, abandonado: 0 },
  }
  if (rows.length < 2) return empty

  const header = rows[0].map((h) => h.trim())
  const col = (name: string) => header.indexOf(name)
  const iId = col("Book Id")
  const iTitle = col("Title")
  const iAuthor = col("Author")
  const iRating = col("My Rating")
  const iPages = col("Number of Pages")
  const iDateRead = col("Date Read")
  const iDateAdded = col("Date Added")
  const iShelf = col("Exclusive Shelf")
  const iShelves = col("Bookshelves")
  const iNotes = col("Private Notes")
  if (iTitle < 0 || iShelf < 0) return { ...empty, invalid: rows.length - 1 }

  const seenIds = new Set(existing.map((b) => b.goodreadsId).filter(Boolean) as string[])
  const seenKeys = new Set(existing.map((b) => keyOf(b.title, b.author)))
  const result: GoodreadsPreview = { ...empty, counts: { ...empty.counts } }

  for (const cells of rows.slice(1)) {
    const get = (i: number) => (i >= 0 ? (cells[i] ?? "").trim() : "")
    const title = get(iTitle)
    const status = STATUS_BY_SHELF[get(iShelf)]
    if (!title || !status) {
      result.invalid++
      continue
    }
    const author = get(iAuthor) || undefined
    const goodreadsId = get(iId) || undefined
    const key = keyOf(title, author)
    if ((goodreadsId && seenIds.has(goodreadsId)) || seenKeys.has(key)) {
      result.duplicates++
      continue
    }
    seenKeys.add(key)
    if (goodreadsId) seenIds.add(goodreadsId)

    const rating = Number.parseInt(get(iRating), 10)
    const pages = Number.parseInt(get(iPages), 10)
    const dateRead = goodreadsDate(get(iDateRead))
    const dateAdded = goodreadsDate(get(iDateAdded))
    const finishedAt = status === "lido" ? dateRead : undefined
    const startedAt = status === "lendo" ? dateAdded : undefined

    result.books.push({
      title,
      author,
      status,
      area: areaFromShelves(get(iShelves)),
      pages: Number.isFinite(pages) && pages > 0 ? pages : undefined,
      rating: rating >= 1 && rating <= 5 ? (rating as Mood) : undefined,
      startedAt,
      finishedAt,
      notes: get(iNotes) || undefined,
      goodreadsId,
    })
    result.counts[status]++
  }
  return result
}
