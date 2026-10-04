const CANONICAL_ORIGIN = "https://2ndinversion.com"

const ALLOWED_APP_HOSTS = new Set([
  '2ndinversion.com',
  'www.2ndinversion.com',
  'localhost',
  '127.0.0.1',
  'musical-school-nine.vercel.app',
  'musical-school-anusayashinde339-9750s-projects.vercel.app',
])

function isSafeAppPath(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) return false
  if (path.includes('\\') || path.includes('://') || path.includes('\0')) return false
  try {
    const decoded = decodeURIComponent(path)
    if (decoded.startsWith('//') || decoded.includes('\\') || decoded.includes('://')) return false
  } catch {
    return false
  }
  return true
}

/**
 * Accept only same-app destinations and return a relative path.
 * A relative Location stays on the host that handled the request, so
 * authentication never jumps between 2ndinversion.com and a Vercel URL.
 */
export function safeRelativeCallback(url: string | null | undefined): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed || trimmed.length > 2000) return null

  if (trimmed.startsWith('/')) {
    return isSafeAppPath(trimmed) ? trimmed : null
  }

  try {
    const target = new URL(trimmed)
    if (!ALLOWED_APP_HOSTS.has(target.hostname.toLowerCase())) return null
    const path = `${target.pathname}${target.search}${target.hash}`
    return isSafeAppPath(path) ? path : null
  } catch {
    return null
  }
}

function allowedHost(value: string | null | undefined) {
  if (!value) return null
  const host = value.trim().toLowerCase().replace(/\/$/, "")
  const hostname = host.split(":")[0]
  if (!ALLOWED_APP_HOSTS.has(hostname)) return null
  return host
}

/**
 * The browser must stay on the host it called. Unique deployment hosts and
 * any other origin fall back to the canonical production site.
 */
export function safeRequestOrigin(request: { url?: string; headers: Headers }) {
  const forwarded = allowedHost(request.headers.get("x-forwarded-host")?.split(",")[0])
  const hostHeader = allowedHost(request.headers.get("host"))
  let urlHost: string | null = null
  if (request.url) {
    try {
      urlHost = allowedHost(new URL(request.url).host)
    } catch {
      urlHost = null
    }
  }

  const canonical = [hostHeader, forwarded, urlHost].find((host) => {
    const hostname = host?.split(":")[0]
    return hostname === "2ndinversion.com" || hostname === "www.2ndinversion.com"
  })
  const chosen = canonical || forwarded || hostHeader || urlHost
  if (!chosen) return CANONICAL_ORIGIN

  const hostname = chosen.split(":")[0]
  const proto = hostname === "localhost" || hostname === "127.0.0.1" ? "http" : "https"
  return `${proto}://${chosen}`
}
