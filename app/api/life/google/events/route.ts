import { NextResponse, type NextRequest } from "next/server"
import { isAuthenticated } from "@/lib/life/server/auth"
import { listEvents } from "@/lib/life/server/google"

export const dynamic = "force-dynamic"
const noStore = { "Cache-Control": "no-store" }
const DATE = /^\d{4}-\d{2}-\d{2}$/
const MAX_DAYS = 62

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401, headers: noStore })
  const from = request.nextUrl.searchParams.get("from") ?? ""
  const to = request.nextUrl.searchParams.get("to") ?? ""
  if (!DATE.test(from) || !DATE.test(to) || to <= from) {
    return NextResponse.json({ error: "Período inválido" }, { status: 400, headers: noStore })
  }
  const days = (Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000
  if (days > MAX_DAYS) return NextResponse.json({ error: "Período longo demais" }, { status: 400, headers: noStore })

  try {
    const events = await listEvents(from, to)
    return NextResponse.json({ events }, { headers: noStore })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro"
    if (message === "NOT_CONNECTED") return NextResponse.json({ error: "NOT_CONNECTED" }, { status: 409, headers: noStore })
    console.error("[life] google events", error)
    return NextResponse.json({ error: "Não consegui ler o Google Calendar agora." }, { status: 502, headers: noStore })
  }
}
