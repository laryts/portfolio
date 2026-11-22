import { NextResponse, type NextRequest } from "next/server"
import { completeAuthorization } from "@/lib/life/server/google"
import { STATE_COOKIE } from "../state"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const back = (flag: string) => NextResponse.redirect(new URL(`/life?google=${flag}#calendario`, request.url))
  const params = request.nextUrl.searchParams
  const expected = request.cookies.get(STATE_COOKIE)?.value
  const state = params.get("state")

  // Sem o cookie de estado (gerado pelo botão "Conectar") ou com state diferente: recusa.
  if (!expected || !state || expected !== state) return back("state")
  if (params.get("error")) return back("denied")
  const code = params.get("code")
  if (!code) return back("error")

  try {
    await completeAuthorization(code)
  } catch (error) {
    console.error("[life] google callback", error)
    return back("error")
  }
  const response = back("ok")
  response.cookies.set(STATE_COOKIE, "", { path: "/api/life/google", maxAge: 0 })
  return response
}
