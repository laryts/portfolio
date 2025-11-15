import { redirect } from "next/navigation"
import { defaultLocale } from "@/proxy"

export default function Home() {
  redirect(`/${defaultLocale}`)
}
