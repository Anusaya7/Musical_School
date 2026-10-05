const PRODUCTION_ORIGIN = 'https://2ndinversion.com'

function isLocalhostUrl(value: string | undefined) {
  if (!value) return false
  return /localhost|127\.0\.0\.1/i.test(value)
}

/**
 * Auth.js reads AUTH_URL / NEXTAUTH_URL from process.env before handlers run.
 * If Vercel still has localhost values, rewrite them to the live domain so
 * login never redirects to http://localhost:3000/api/auth/error.
 */
export function ensureProductionAuthUrls() {
  const onVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV)
  if (!onVercel) return

  const preferred =
    (!isLocalhostUrl(process.env.AUTH_URL) && process.env.AUTH_URL?.replace(/\/$/, '')) ||
    (!isLocalhostUrl(process.env.NEXTAUTH_URL) && process.env.NEXTAUTH_URL?.replace(/\/$/, '')) ||
    (!isLocalhostUrl(process.env.NEXT_PUBLIC_APP_URL) && process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '')) ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//, '')}`
      : PRODUCTION_ORIGIN)

  if (isLocalhostUrl(process.env.AUTH_URL) || !process.env.AUTH_URL) {
    process.env.AUTH_URL = preferred
  }
  if (isLocalhostUrl(process.env.NEXTAUTH_URL) || !process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = preferred
  }
}

export function getGoogleCredentials() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || '').trim()
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || '').trim()
  const placeholders = ['your_google_client_id', 'your_google_client_secret', '']
  if (!clientId || !clientSecret) return null
  if (placeholders.some(p => p && (clientId.includes(p) || clientSecret.includes(p)))) return null
  return { clientId, clientSecret }
}
