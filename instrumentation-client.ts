import posthog from "posthog-js"

// A área privada /life não envia analytics: mantém o painel fora de qualquer rastreamento.
const isPrivateArea = typeof window !== "undefined" && window.location.pathname.startsWith("/life")

if (!isPrivateArea) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
    defaults: "2025-11-30",
    capture_exceptions: false,
    debug: false,
    autocapture: false,
  })
}
