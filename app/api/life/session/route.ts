import { NextResponse, type NextRequest } from "next/server"
import {
  AuthNotConfiguredError,
  checkPasscode,
  clearFailures,
  createSession,
  destroySession,
  isAuthenticated,
  loginIsLocked,
  registerFailure,
} from "@/lib/life/server/auth"

export const dynamic = "force-dynamic"

const noStore = { "Cache-Control": "no-store" }

function clientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
}

export async function GET() {
  try {
    const authenticated = await isAuthenticated()
    return NextResponse.json({ authenticated, configured: true }, { headers: noStore })
  } catch (error) {
    if (error instanceof AuthNotConfiguredError) {
      return NextResponse.json({ authenticated: false, configured: false }, { status: 503, headers: noStore })
    }
    throw error
  }
}

export async function POST(request: NextRequest) {
  const key = clientKey(request)
  if (loginIsLocked(key)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente de novo em alguns minutos." },
      { status: 429, headers: noStore }
    )
  }

  let passcode = ""
  try {
    const body = (await request.json()) as { passcode?: unknown }
    passcode = typeof body.passcode === "string" ? body.passcode : ""
  } catch {
    return NextResponse.json({ error: "Requisição inválida" }, { status: 400, headers: noStore })
  }

  try {
    if (!passcode || !checkPasscode(passcode)) {
      registerFailure(key)
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401, headers: noStore })
    }
  } catch (error) {
    if (error instanceof AuthNotConfiguredError) {
      return NextResponse.json({ error: "LIFE_PASSCODE não está configurada no servidor." }, { status: 503, headers: noStore })
    }
    throw error
  }

  clearFailures(key)
  await createSession()
  return NextResponse.json({ authenticated: true }, { headers: noStore })
}

export async function DELETE() {
  await destroySession()
  return NextResponse.json({ authenticated: false }, { headers: noStore })
}
