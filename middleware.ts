import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"

// List of supported locales
export const locales = ["en", "pt"]
export const defaultLocale = "en"

// Security: Blocked paths (common attack vectors)
const BLOCKED_PATHS = [
  // WordPress paths
  '/wp-admin',
  '/wp-content',
  '/wp-includes',
  '/wp-login.php',
  '/wp-config.php',
  '/xmlrpc.php',
  '/wordpress',
  // PHP paths
  '/phpmyadmin',
  '/phpMyAdmin',
  '/pma',
  '/admin',
  '/administrator',
  // Common exploit paths
  '/.env',
  '/.git',
  '/config.php',
  '/database.php',
  '/backup',
  '/backups',
  '/shell.php',
  '/cpanel',
  '/webmail',
  // Scanner paths
  '/.well-known',
  '/.htaccess',
  '/.htpasswd',
]

// Security: Suspicious user agents (bots/scanners)
// Note: Be careful not to block legitimate bots like Googlebot, Bingbot, etc.
const SUSPICIOUS_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'nmap',
  'masscan',
  'zmap',
  'scanner',
  'harvest',
  'extract',
  'grab',
  'libwww',
  // Only block curl/wget if they're clearly malicious (not all curl/wget are bad)
  // Consider adding more specific patterns if needed
]

// Rate limiting: Simple in-memory store (for production, consider Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30 // max requests per window

// Clean up old rate limit entries (called during rate limit check)
function cleanupRateLimit() {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
  
  // Prevent memory leak: if map gets too large, clear old entries more aggressively
  if (rateLimitMap.size > 1000) {
    const entries = Array.from(rateLimitMap.entries())
    entries.sort((a, b) => a[1].resetTime - b[1].resetTime)
    // Remove oldest 50% of entries
    const toRemove = entries.slice(0, Math.floor(entries.length / 2))
    toRemove.forEach(([key]) => rateLimitMap.delete(key))
  }
}

// Security: Check if path should be blocked
function isBlockedPath(pathname: string): boolean {
  const normalizedPath = pathname.toLowerCase()
  return BLOCKED_PATHS.some(blockedPath => 
    normalizedPath.includes(blockedPath.toLowerCase())
  )
}

// Security: Check if user agent is suspicious
function isSuspiciousUserAgent(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  
  // Check against known malicious patterns
  const isMalicious = SUSPICIOUS_USER_AGENTS.some(suspicious => ua.includes(suspicious.toLowerCase()))
  
  // Also block common attack tools
  const attackPatterns = [
    /^curl\/[\d.]+$/i,  // curl without browser-like user agent
    /^wget\/[\d.]+$/i,  // wget without browser-like user agent
    /^python-requests\/[\d.]+$/i,
    /^go-http-client/i,
    /^java\/[\d.]+$/i,
    /^perl/i,
    /^ruby/i,
  ]
  
  const matchesAttackPattern = attackPatterns.some(pattern => pattern.test(ua))
  
  return isMalicious || matchesAttackPattern
}

// Security: Rate limiting check
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  // Clean up expired entries periodically
  cleanupRateLimit()
  
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || record.resetTime < now) {
    // New or expired entry
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  // Increment count
  record.count++
  rateLimitMap.set(ip, record)
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count }
}

// Security: Get client IP address
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP (in case of proxies/CDN)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback (may not be available in serverless environments)
  return 'unknown'
}

// Security: Add security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Enable XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Content Security Policy (adjust based on your needs)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  )

  return response
}

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

    // ===== SECURITY CHECKS =====
    
    // 1. Block suspicious paths
    if (isBlockedPath(pathname)) {
      console.warn(`[SECURITY] Blocked suspicious path: ${pathname} from IP: ${getClientIP(request)}`)
      return new NextResponse('Not Found', { status: 404 })
    }

    // 2. Block suspicious user agents
    const userAgent = request.headers.get('user-agent')
    // Block if user agent matches suspicious patterns
    // Also block requests without user agent if they're accessing suspicious paths
    if (userAgent && isSuspiciousUserAgent(userAgent)) {
      console.warn(`[SECURITY] Blocked suspicious user agent: ${userAgent} from IP: ${getClientIP(request)}`)
      return new NextResponse('Forbidden', { status: 403 })
    }
    
    // Block requests without user agent if accessing suspicious paths
    if (!userAgent && isBlockedPath(pathname)) {
      console.warn(`[SECURITY] Blocked request without user agent accessing suspicious path: ${pathname} from IP: ${getClientIP(request)}`)
      return new NextResponse('Forbidden', { status: 403 })
    }

    // 3. Rate limiting (skip for static assets and API routes)
    if (!pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
      const ip = getClientIP(request)
      const rateLimit = checkRateLimit(ip)
      
      if (!rateLimit.allowed) {
        console.warn(`[SECURITY] Rate limit exceeded for IP: ${ip}`)
        return new NextResponse('Too Many Requests', { 
          status: 429,
          headers: {
            'Retry-After': '60'
          }
        })
      }
    }

    // ===== LOCALE HANDLING =====
    
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
        const redirectResponse = NextResponse.redirect(newUrl)
        return addSecurityHeaders(redirectResponse)
      } catch (urlError) {
        // If URL construction fails, redirect to default locale root
        console.error('Error constructing redirect URL:', urlError)
        const fallbackUrl = new URL(`/${defaultLocale}`, request.url)
        const fallbackResponse = NextResponse.redirect(fallbackUrl)
        return addSecurityHeaders(fallbackResponse)
      }
    }

    // If pathname already has a locale, allow the request to continue
    const response = NextResponse.next()
    
    // Add security headers to all responses
    return addSecurityHeaders(response)
  } catch (error) {
    // Catch any unexpected errors and log them
    console.error('Middleware error:', error)
    // Return a response to prevent 5xx errors
    // Try to redirect to default locale, or allow request to continue
    try {
      const fallbackUrl = new URL(`/${defaultLocale}`, request.url)
      const fallbackResponse = NextResponse.redirect(fallbackUrl)
      return addSecurityHeaders(fallbackResponse)
    } catch {
      // If even fallback fails, allow request to continue
      const response = NextResponse.next()
      return addSecurityHeaders(response)
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
