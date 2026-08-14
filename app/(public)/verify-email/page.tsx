'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, XCircle, Loader2, RefreshCw } from 'lucide-react'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const tokenFromUrl = searchParams.get('token')
  const emailFromUrl = searchParams.get('email')

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl)
    }
    
    // Auto-verify if query params contain both email and token (like legacy click links)
    if (tokenFromUrl && emailFromUrl) {
      const autoVerify = async () => {
        setStatus('loading')
        setMessage('Verifying your email address...')
        try {
          const res = await fetch(`/api/auth/verify-email?token=${tokenFromUrl}&email=${encodeURIComponent(emailFromUrl)}`)
          const data = await res.json()

          if (res.ok && data.success) {
            setStatus('success')
            setMessage(data.message || 'Your email has been successfully verified!')
          } else {
            setStatus('error')
            setMessage(data.error || 'Failed to verify email. The link might be expired or invalid.')
          }
        } catch (err) {
          console.error(err)
          setStatus('error')
          setMessage('A network error occurred. Please try again.')
        }
      }
      autoVerify()
    }
  }, [tokenFromUrl, emailFromUrl])

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return
    const interval = setInterval(() => {
      setResendCooldown(prev => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [resendCooldown])

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || otp.length !== 6 || !/^\d+$/.test(otp)) {
      setStatus('error')
      setMessage('Please enter a valid 6-digit OTP verification code.')
      return
    }

    setStatus('loading')
    setMessage('Validating security code...')

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setMessage('Your email has been successfully verified! Welcome aboard.')
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to verify OTP. Please check the code and try again.')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setMessage('A network error occurred. Please check your connection.')
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      setStatus('error')
      setMessage('Please enter your email address to request a new OTP.')
      return
    }

    setStatus('loading')
    setMessage('Sending verification code...')

    try {
      const res = await fetch('/api/auth/verify-email/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('idle')
        setMessage('A new 6-digit OTP has been sent to your email address!')
        setResendCooldown(60) // 60 seconds cooldown
      } else {
        setStatus('error')
        setMessage(data.error || 'Failed to resend verification code. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setMessage('A network error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background blur effects */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glow Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500" />

        <div className="space-y-6">
          <div className="flex justify-center">
            {status === 'loading' && (
              <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
            )}
            {status === 'error' && (
              <XCircle className="w-16 h-16 text-rose-400 animate-pulse" />
            )}
            {status === 'idle' && (
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700/50">
                <span className="text-3xl">🔑</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {status === 'loading' && 'Verifying Email'}
            {status === 'success' && 'Verification Complete'}
            {status === 'error' && 'Verification Failed'}
            {status === 'idle' && 'Verify Your Email'}
          </h2>

          {message && (
            <p className={`text-sm font-medium leading-relaxed px-4 ${
              status === 'success' ? 'text-emerald-400' : status === 'error' ? 'text-rose-400' : 'text-slate-300'
            }`}>
              {message}
            </p>
          )}

          {status !== 'success' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!emailFromUrl || status === 'loading'}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-850 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white font-semibold text-sm transition-all"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">6-Digit OTP Code</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 text-center rounded-2xl bg-slate-950/80 border border-slate-850 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white font-extrabold text-lg tracking-[8px] transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || otp.length !== 6}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-90 active:scale-95 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition-all text-sm disabled:opacity-50"
              >
                {status === 'loading' ? 'Verifying...' : 'Verify OTP Code'}
              </button>
            </form>
          )}

          {status === 'success' && (
            <Link
              href="/login"
              className="inline-block w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
            >
              Sign In to Dashboard
            </Link>
          )}

          {status !== 'success' && (
            <div className="pt-4 border-t border-slate-800/50 flex flex-col items-center gap-3">
              <button
                onClick={handleResendOtp}
                type="button"
                disabled={status === 'loading' || resendCooldown > 0}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 active:scale-95 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${status === 'loading' ? 'animate-spin' : ''}`} />
                {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Verification Code'}
              </button>
              <div className="text-xs text-slate-500 font-semibold">
                Need help? <Link href="/contact" className="text-slate-400 hover:underline">Contact Support</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
