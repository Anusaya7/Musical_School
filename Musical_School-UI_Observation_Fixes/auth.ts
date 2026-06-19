import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail, createUser, DbUser } from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const email = (credentials.email as string).toLowerCase()
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
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
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
})
