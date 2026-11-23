import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/life/server/auth"
import { disconnect, isConnected, isGoogleConfigured } from "@/lib/life/server/google"

export const dynamic = "force-dynamic"
const noStore = { "Cache-Control": "no-store" }

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401, headers: noStore })
  return NextResponse.json(
    { configured: isGoogleConfigured(), connected: isGoogleConfigured() && (await isConnected()) },
    { headers: noStore }
  )
}

export async function DELETE() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401, headers: noStore })
  await disconnect()
  return NextResponse.json({ connected: false }, { headers: noStore })
}
