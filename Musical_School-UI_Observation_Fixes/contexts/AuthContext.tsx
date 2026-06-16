'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface User {
  email: string
  name: string
  role: 'admin' | 'instructor' | 'student'
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

  // Load user from localStorage on mount
  useEffect(() => {
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
  }, [])

  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          // Check credentials
          if (email === 'admin@2ndinversion.com' && password === 'admin123') {
            const adminUser: User = {
              email,
              name: 'Admin User',
              role: 'admin',
              rememberMe
            }
            localStorage.setItem('user', JSON.stringify(adminUser))
            setUser(adminUser)
            resolve(true)
          } else if (email === 'ajinkya@2ndinversionmusic.com' && password === 'instructor123') {
            const instructorUser: User = {
              email,
              name: 'Ajinkya Amrule',
              role: 'instructor',
              rememberMe
            }
            localStorage.setItem('user', JSON.stringify(instructorUser))
            setUser(instructorUser)
            resolve(true)
          } else if (email && password.length >= 6) {
            const studentUser: User = {
              email,
              name: email.split('@')[0],
              role: 'student',
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
