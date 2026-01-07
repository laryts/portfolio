import posthog from "posthog-js"

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "/ingest",
  defaults: "2025-11-30",
  capture_exceptions: false,
  debug: false,
  autocapture: false,
})
