import NextAuth from "next-auth"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail, createUser, DbUser } from "@/lib/db"
import { safeRelativeCallback, safeRequestOrigin } from "@/lib/safe-callback"
import bcrypt from "bcryptjs"

import Google from "next-auth/providers/google"

const googleId = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET

const isGoogleConfigured = 
  googleId && 
  googleSecret && 
  googleId !== "your_google_client_id" && 
  googleSecret !== "your_google_client_secret"

const serverProviders: any[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      try {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const email = (credentials.email as string).trim().toLowerCase()
        console.log(`[AUTH] Login attempt for email: ${email}`)

        const user = await getUserByEmail(email)
        if (!user) {
          console.log(`[AUTH] Account not found in database for email: ${email}`)
          return null
        }
        if (!user.passwordHash) {
          console.log(`[AUTH] User record has no password hash for email: ${email}`)
          return null
        }
        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!isValid) {
          console.log(`[AUTH] Incorrect password validation for email: ${email}`)
          return null
        }
        console.log(`[AUTH] Login successful for email: ${email}. Role detected: ${user.role}`)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        }
      } catch (error) {
        console.error("AUTH ERROR", error)
        return null
      }
    }
  })
]

if (isGoogleConfigured) {
  serverProviders.push(
    Google({
      clientId: googleId,
      clientSecret: googleSecret,
    })
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth((req) => {
  const origin = req ? safeRequestOrigin(req) : "https://2ndinversion.com"
  return {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "UY2xST5ck1IteInTQe/30uqeeGPrNIPx/dNYR0ZM2Ds=",
  ...authConfig,
  providers: serverProviders,
  callbacks: {
    ...authConfig.callbacks,
    async redirect({ url }) {
      const path = safeRelativeCallback(url) ?? "/"
      return `${origin}${path}`
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase()
        if (email === "admin@2ndinversion.com" || email === "instructor@2ndinversion.com") {
          return false // Deny Google sign-in for admin and instructor
        }
        const existingUser = await getUserByEmail(user.email as string)
        if (!existingUser) {
          const newDbUser: DbUser = {
            id: user.id || Math.random().toString(36).substring(2, 9),
            name: user.name || user.email?.split("@")[0] || "Google Student",
            email: user.email as string,
            role: "STUDENT",
            createdAt: new Date().toISOString(),
            googleId: profile?.sub || "",
            isVerified: true
          }
          await createUser(newDbUser)
        }
      }
      return true
    }
  }
  }
})

