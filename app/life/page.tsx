import type { Metadata } from "next"
import { LifeApp } from "@/components/life/app"

export const metadata: Metadata = {
  title: "Lari's life",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function LifePage() {
  return <LifeApp />
}
