import './globals.css'
import { Inter } from 'next/font/google'
import { CartProvider } from '@/contexts/CartContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Toast from '@/components/Toast'
import FooterPremium from '@/components/FooterPremium'
import WhatsAppChat from '@/components/WhatsAppChat'
import AIChatbot from '@/components/AIChatbot'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

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
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                {children}
                <FooterPremium />
              </div>
              <Toast />
              <WhatsAppChat />
              <AIChatbot />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
