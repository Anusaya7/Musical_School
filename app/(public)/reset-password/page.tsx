'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, CheckCircle, Loader2, Music, Mail, Hash } from 'lucide-react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailParam)
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [emailParam])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !otp || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (otp.length !== 6 || /\D/.test(otp)) {
      setError('Verification code must be exactly 6 digits')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp, password })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setIsSuccess(true)
      } else {
        setError(data.error || 'Failed to reset password. Code might be invalid or expired.')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to update password. Try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[24px] p-8 md:p-10 shadow-[0_10px_50px_rgba(94,168,255,0.06)] border border-[#DCEEFF] relative overflow-hidden">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#5EA8FF] to-[#FF6FAF] rounded-2xl flex items-center justify-center mb-3 shadow-md">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F1E4A] tracking-tight">Reset Password</h2>
          <p className="text-slate-500 text-sm mt-1 text-center font-medium">
            Enter your verification code and configure your new password below
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center py-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-[#0F1E4A] mb-2">Password Updated!</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed text-center font-medium">
              Your password has been successfully updated. You can now log in using your new credentials.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3.5 bg-[#0F1E4A] text-white font-bold rounded-2xl hover:bg-[#1a2d61] shadow-[0_8px_25px_rgba(15,30,74,0.15)] active:scale-[0.98] transition-all text-sm"
            >
              Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent text-sm font-bold bg-[#FAFBFF] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0F1E4A] mb-2">6-Digit Reset Code</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent text-sm font-black tracking-[4px] bg-[#FAFBFF] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0F1E4A] mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent text-sm font-bold bg-[#FAFBFF] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#0F1E4A]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0F1E4A] mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent text-sm font-bold bg-[#FAFBFF] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#0F1E4A]"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white font-bold rounded-2xl hover:opacity-95 shadow-[0_8px_25px_rgba(94,168,255,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Save Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center p-6">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
