'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle, Loader2, Music } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Email is required')
      return
    }
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setIsSent(true)
        setTimeout(() => {
          router.push(`/reset-password?email=${encodeURIComponent(email)}`)
        }, 2500)
      } else {
        setError(data.error || 'Failed to send reset code.')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to send reset code. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[24px] p-8 md:p-10 shadow-[0_10px_50px_rgba(94,168,255,0.06)] border border-[#DCEEFF] relative overflow-hidden font-sans">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#5EA8FF] to-[#DCEEFF] opacity-20 blur-3xl pointer-events-none"></div>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#5EA8FF] to-[#FF6FAF] rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F1E4A] tracking-tight">Forgot Password</h2>
          <p className="text-slate-500 text-sm mt-1 text-center font-medium">
            Enter your email address to receive a 6-digit password reset code
          </p>
        </div>

        {isSent ? (
          <div className="text-center py-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0F1E4A] mb-2">Check Your Email</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-sm font-medium">
              We have sent a 6-digit password reset code to <span className="font-bold text-slate-800">{email}</span>. Redirecting you to verify...
            </p>
            <button
              onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
              className="w-full py-3.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white font-semibold rounded-2xl hover:opacity-95 shadow-[0_8px_25px_rgba(94,168,255,0.2)] active:scale-[0.98] transition-all text-sm font-bold"
            >
              Verify Code Now
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#0F1E4A] mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="name@domain.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent text-sm font-bold bg-[#FAFBFF] transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#0F1E4A] text-white font-bold text-sm rounded-2xl hover:bg-[#1a2d61] shadow-[0_8px_25px_rgba(15,30,74,0.15)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Code...
                </>
              ) : (
                'Send Reset Code'
              )}
            </button>

            <div className="text-center">
              <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5EA8FF] hover:text-[#5EA8FF]/80 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
