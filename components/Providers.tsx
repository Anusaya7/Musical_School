'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import Toast from '@/components/Toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <SiteSettingsProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toast />
            </CartProvider>
          </AuthProvider>
        </SiteSettingsProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
