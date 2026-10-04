import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { safeRelativeCallback } from "@/lib/safe-callback"

const googleId = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET

const isGoogleConfigured = 
  googleId && 
  googleSecret && 
  googleId !== "your_google_client_id" && 
  googleSecret !== "your_google_client_secret"

const providers: any[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize() {
      return null
    }
  })
]

if (isGoogleConfigured) {
  providers.push(
    Google({
      clientId: googleId,
      clientSecret: googleSecret,
    })
  )
  console.log("[AUTH] Google authentication provider is enabled in config.")
} else {
  console.warn("[AUTH] Google authentication credentials missing. Google provider disabled in config.")
}

const useSecureCookies = process.env.NODE_ENV === "production" && 
  Boolean(process.env.NEXTAUTH_URL?.startsWith("https://") && !process.env.NEXTAUTH_URL?.includes("localhost"))

export default {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "UY2xST5ck1IteInTQe/30uqeeGPrNIPx/dNYR0ZM2Ds=",
  trustHost: true,
  useSecureCookies,
  providers,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      const path = safeRelativeCallback(url) ?? "/"
      try {
        return `${new URL(baseUrl).origin}${path}`
      } catch {
        return `https://2ndinversion.com${path}`
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "STUDENT"
        token.id = user.id
        token.name = user.name
        token.isVerified = (user as any).isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
        (session.user as any).isVerified = token.isVerified as boolean;
        if (token.name) {
          session.user.name = token.name as string
        }
        console.log(`[AUTH] Session created for user: ${session.user.email}, name: ${session.user.name}, role: ${(session.user as any).role}, isVerified: ${(session.user as any).isVerified}`)
      }
      return session
    }
  }
} as NextAuthConfig
