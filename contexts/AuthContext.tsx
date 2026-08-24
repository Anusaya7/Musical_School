'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

export interface User {
  email: string
  name: string
  role: 'SUPER_ADMIN' | 'INSTRUCTOR' | 'STUDENT'
  firstName?: string
  lastName?: string
  phone?: string
  instrument?: string
  experience?: string
  rememberMe?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync NextAuth session with local context state
  useEffect(() => {
    if (!mounted) return
    if (status === 'authenticated' && session?.user) {
      const dbUser: User = {
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user as any).role || 'STUDENT'
      }
      setUser(dbUser)
      localStorage.setItem('user', JSON.stringify(dbUser))
    } else if (status === 'unauthenticated') {
      const savedUser = localStorage.getItem('user')
      if (!savedUser) {
        setUser(null)
      }
    }
  }, [session, status, mounted])

  // Load user from localStorage on mount
  useEffect(() => {
    if (!mounted) return
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Failed to load user from localStorage:', error)
        localStorage.removeItem('user')
      }
    }
  }, [mounted])

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          // Check credentials
          if (email === 'admin@2ndinversion.com' && password === 'Admin@123') {
            const adminUser: User = {
              email,
              name: 'Ajinkya Amrule',
              role: 'SUPER_ADMIN',
              rememberMe
            }
            localStorage.setItem('user', JSON.stringify(adminUser))
            setUser(adminUser)
            resolve(true)
          } else if (email === 'instructor@2ndinversion.com' && password === 'Instructor@123') {
            const instructorUser: User = {
              email,
              name: 'Ajinkya Amrule',
              role: 'INSTRUCTOR',
              rememberMe
            }
            localStorage.setItem('user', JSON.stringify(instructorUser))
            setUser(instructorUser)
            resolve(true)
          } else if (email === 'student@2ndinversion.com' && password === 'Student@123') {
            const studentUser: User = {
              email,
              name: 'Anil Misal',
              role: 'STUDENT',
              rememberMe
            }
            localStorage.setItem('user', JSON.stringify(studentUser))
            setUser(studentUser)
            resolve(true)
          } else if (email && password.length >= 6) {
            // General fallback student sign-in/up
            const studentUser: User = {
              email,
              name: email.split('@')[0],
              role: 'STUDENT',
              rememberMe
            }
            localStorage.setItem('user', JSON.stringify(studentUser))
            setUser(studentUser)
            resolve(true)
          } else {
            resolve(false)
          }
        }, 1000)
      })
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    signOut({ callbackUrl: '/login' })
  }

  const isAuthenticated = !!user

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
