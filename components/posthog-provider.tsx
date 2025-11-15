"use client"

import { useEffect, Suspense } from "react"
import posthog from "posthog-js"
import { usePathname, useSearchParams } from "next/navigation"

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track pageviews
  useEffect(() => {
    if (pathname && posthog.__loaded) {
      try {
        let url = window.origin + pathname
        if (searchParams && searchParams.toString()) {
          url = url + `?${searchParams.toString()}`
        }
        posthog.capture("$pageview", {
          $current_url: url,
        })
      } catch (error) {
        // Silently handle pageview tracking errors
        if (process.env.NODE_ENV === "development") {
          console.error("PostHog pageview error:", error)
        }
      }
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog if we have an API key
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      return
    }

    // Check if PostHog is already initialized
    if (posthog.__loaded) {
      return
    }

    try {
      // Initialize PostHog
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: "/ingest",
        ui_host: "https://us.posthog.com",
        defaults: '2025-05-24',
        // Disable exception autocapture to prevent script loading errors
        capture_exceptions: false,
        debug: process.env.NODE_ENV === "development",
        autocapture: false,
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") {
            console.log("PostHog loaded")
          }
        },
      })
    } catch (error) {
      // Silently handle initialization errors
      if (process.env.NODE_ENV === "development") {
        console.error("PostHog initialization error:", error)
      }
    }
  }, [])

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
    </>
  )
}

