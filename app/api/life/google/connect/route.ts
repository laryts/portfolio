import { NextResponse, type NextRequest } from "next/server"
import { isAuthenticated } from "@/lib/life/server/auth"
import { buildAuthUrl, GoogleNotConfiguredError, isGoogleConfigured, newOAuthState } from "@/lib/life/server/google"
import { STATE_COOKIE } from "../state"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const back = (flag: string) => NextResponse.redirect(new URL(`/life?google=${flag}#calendario`, request.url))
  if (!(await isAuthenticated())) return back("login")
  if (!isGoogleConfigured()) return back("config")
  try {
    const state = newOAuthState()
    const response = NextResponse.redirect(buildAuthUrl(state))
    // Cookie curto e ligado a esta tentativa: o callback só aceita o state que está aqui.
    response.cookies.set(STATE_COOKIE, state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/api/life/google", maxAge: 600 })
    return response
  } catch (error) {
    if (error instanceof GoogleNotConfiguredError) return back("config")
    throw error
  }
}
