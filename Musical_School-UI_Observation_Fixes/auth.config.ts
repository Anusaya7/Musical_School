import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

const googleId = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET

const isGoogleConfigured = 
  googleId && 
  googleSecret && 
  googleId !== "your_google_client_id" && 
  googleSecret !== "your_google_client_secret"

const providers = []

if (isGoogleConfigured) {
  providers.push(
    Google({
      clientId: googleId,
      clientSecret: googleSecret,
    })
  )
  console.log("[AUTH] Google authentication provider is enabled.")
} else {
  console.warn("[AUTH] Google authentication credentials missing. Google provider disabled.")
}

export default {
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "STUDENT"
        token.id = user.id
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
        if (token.name) {
          session.user.name = token.name as string
        }
        console.log(`[AUTH] Session created for user: ${session.user.email}, name: ${session.user.name}, role: ${(session.user as any).role}`)
      }
      return session
    }
  }
} as NextAuthConfig
