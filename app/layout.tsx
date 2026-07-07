import './globals.css'
// import { Inter } from 'next/font/google'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Toast from '@/components/Toast'
import Script from 'next/script'
import { SessionProvider } from 'next-auth/react'

const inter = { className: 'antialiased font-sans' }

export const metadata = {
  title: '2nd Inversion Musical School',
  description: 'AI-powered music school platform with smart booking and practice system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <Toast />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
