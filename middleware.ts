import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

// List of supported locales
export const locales = ["en", "pt"]
export const defaultLocale = "en"

// Get the preferred locale from the request
function getLocale(request: NextRequest): string {
  try {
    // Negotiator expects a plain object so we need to transform headers
    const negotiatorHeaders: Record<string, string> = {}
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

    // Use negotiator and intl-localematcher to get the best locale
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages()

    // If no languages are provided, use the default locale
    if (!languages || languages.length === 0) {
      return defaultLocale
    }

    return match(languages, locales, defaultLocale)
  } catch (error) {
    // If there's any error in locale detection, fall back to default locale
    console.error('Error detecting locale:', error)
    return defaultLocale
  }
}

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    // Check if the pathname already includes a locale
    const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

    // If it doesn't have a locale, redirect to the preferred locale
    if (!pathnameHasLocale) {
      const locale = getLocale(request)

      // Ensure pathname is properly formatted
      const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`
      
      // Construct the new URL safely
      try {
        const newUrl = new URL(`/${locale}${normalizedPathname}`, request.url)
        return NextResponse.redirect(newUrl)
      } catch (urlError) {
        // If URL construction fails, redirect to default locale root
        console.error('Error constructing redirect URL:', urlError)
        const fallbackUrl = new URL(`/${defaultLocale}`, request.url)
        return NextResponse.redirect(fallbackUrl)
      }
    }

    // If pathname already has a locale, allow the request to continue
    return NextResponse.next()
  } catch (error) {
    // Catch any unexpected errors and log them
    console.error('Middleware error:', error)
    // Return a response to prevent 5xx errors
    // Try to redirect to default locale, or allow request to continue
    try {
      const fallbackUrl = new URL(`/${defaultLocale}`, request.url)
      return NextResponse.redirect(fallbackUrl)
    } catch {
      // If even fallback fails, allow request to continue
      return NextResponse.next()
    }
  }
}

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - public files (e.g. robots.txt)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.svg).*)"],
}
