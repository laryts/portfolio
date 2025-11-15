import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a URL string to ensure it has a protocol.
 * If the URL doesn't start with http:// or https://, it adds https://
 */
export function normalizeUrl(url: string | undefined, fallback: string = "https://larissasoares.dev"): string {
  const urlToNormalize = url || fallback
  if (!urlToNormalize.startsWith("http://") && !urlToNormalize.startsWith("https://")) {
    return `https://${urlToNormalize.replace(/^\/+/, "")}`
  }
  return urlToNormalize
}
