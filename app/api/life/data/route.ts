import { NextResponse, type NextRequest } from "next/server"
import { AuthNotConfiguredError, isAuthenticated } from "@/lib/life/server/auth"
import { loadLifeData, saveLifeData, StorageNotConfiguredError } from "@/lib/life/server/store"
import { normalizeLifeData } from "@/lib/life/empty"

export const dynamic = "force-dynamic"

const noStore = { "Cache-Control": "no-store" }
const MAX_BODY_BYTES = 2 * 1024 * 1024

function errorResponse(error: unknown) {
  if (error instanceof AuthNotConfiguredError) {
    return NextResponse.json({ error: "Acesso não configurado no servidor." }, { status: 503, headers: noStore })
  }
  if (error instanceof StorageNotConfiguredError) {
    return NextResponse.json(
      { error: "Armazenamento não configurado. Conecte o Upstash/KV ao projeto." },
      { status: 503, headers: noStore }
    )
  }
  console.error("[life] data error", error)
  return NextResponse.json({ error: "Falha ao acessar seus dados." }, { status: 500, headers: noStore })
}

async function requireAuth() {
  return isAuthenticated()
}

export async function GET() {
  try {
    if (!(await requireAuth())) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401, headers: noStore })
    }
    const data = await loadLifeData()
    return NextResponse.json({ data }, { headers: noStore })
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await requireAuth())) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401, headers: noStore })
    }

    const text = await request.text()
    if (text.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Dados grandes demais" }, { status: 413, headers: noStore })
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: "JSON inválido" }, { status: 400, headers: noStore })
    }

    const data = normalizeLifeData(parsed)
    if (!data) {
      return NextResponse.json({ error: "Formato de dados inválido" }, { status: 400, headers: noStore })
    }

    data.updatedAt = new Date().toISOString()
    await saveLifeData(data)
    return NextResponse.json({ ok: true, updatedAt: data.updatedAt }, { headers: noStore })
  } catch (error) {
    return errorResponse(error)
  }
}
