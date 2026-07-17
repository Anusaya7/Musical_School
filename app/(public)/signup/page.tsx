'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  CheckCircle,
  AlertCircle,
  Loader2,
  Music,
  ShieldCheck,
  X
} from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState('')
  const [verifiedSuccess, setVerifiedSuccess] = useState(false)
  
  const { theme } = useTheme()
  const router = useRouter()

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'No password', color: 'w-0 bg-slate-200' }
    let score = 0
    if (pass.length >= 6) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score <= 1) return { score, label: 'Weak ⚠️', color: 'w-1/3 bg-red-400' }
    if (score === 2 || score === 3) return { score, label: 'Medium ⚡', color: 'w-2/3 bg-amber-400' }
    return { score, label: 'Strong ✨', color: 'w-full bg-green-400' }
  }

  const strength = getPasswordStrength(formData.password)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name) newErrors.name = 'Full name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setErrors({})

    try {
      // Simulate account registration
      setTimeout(() => {
        setIsLoading(false)
        setShowVerificationModal(true)
      }, 1500)
    } catch (err) {
      setErrors({ email: 'Registration failed. Try again.' })
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode || verificationCode.length < 4) {
      setVerificationError('Enter a valid verification code')
      return
    }
    setIsVerifying(true)
    setVerificationError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      if (!res.ok) {
        const data = await res.json()
        setVerificationError(data.error || 'Registration failed')
        setIsVerifying(false)
        return
      }

      setIsVerifying(false)
      setVerifiedSuccess(true)
      
      // Log user in locally
      const newUser = {
        email: formData.email,
        name: formData.name,
        role: 'STUDENT',
        isVerified: true
      }
      localStorage.setItem('user', JSON.stringify(newUser))

      setTimeout(() => {
        setShowVerificationModal(false)
        window.location.replace('/student/dashboard')
      }, 1500)
    } catch (err) {
      setVerificationError('Verification failed. Invalid code.')
      setIsVerifying(false)
    }
  }

  const handleResendCode = () => {
    alert('A new 6-digit verification code has been sent to ' + formData.email)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[24px] shadow-[0_10px_50px_rgba(94,168,255,0.06)] border border-[#DCEEFF] p-8 md:p-10 relative z-10 transition-all">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#5EA8FF] to-[#FF6FAF] rounded-2xl flex items-center justify-center mb-3 shadow-[0_8px_20px_rgba(94,168,255,0.15)]">
            <Music className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F1E4A] tracking-tight">Create Student Account</h1>
          <p className="text-slate-500 text-sm mt-1 text-center">
            Sign up to unlock your musical potential
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.email && !formData.email && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Please check the missing fields.
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-[#0F1E4A] mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent text-sm bg-[#FAFBFF]"
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#0F1E4A] mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent text-sm bg-[#FAFBFF]"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-[#0F1E4A] mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full pl-12 pr-12 py-3 rounded-2xl border border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent text-sm bg-[#FAFBFF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#0F1E4A]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>}

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="mt-2.5">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1">
                  <span>Password strength</span>
                  <span className="font-bold">{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`}></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-[#0F1E4A] mb-1.5">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="w-full pl-12 pr-12 py-3 rounded-2xl border border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent text-sm bg-[#FAFBFF]"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword}</p>}
          </div>

          {/* Terms & Conditions */}
          <div className="pt-2">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded text-[#FF6FAF] border-[#DCEEFF] focus:ring-[#FF6FAF] cursor-pointer"
              />
              <span className="ml-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                I agree to the <span className="font-semibold text-[#FF6FAF] hover:underline">Terms & Conditions</span> and <span className="font-semibold text-[#5EA8FF] hover:underline">Privacy Policy</span>.
              </span>
            </label>
            {errors.agreeTerms && <p className="text-xs text-red-500 mt-1 font-medium">{errors.agreeTerms}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white font-semibold rounded-2xl hover:opacity-95 shadow-[0_8px_25px_rgba(255,111,175,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 pt-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-[#5EA8FF] hover:text-[#5EA8FF]/85 transition-colors">
            Sign In
          </Link>
        </div>
      </div>

      {/* EMAIL VERIFICATION MODAL OVERLAY */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-[#0F1E4A]/40 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-[24px] max-w-md w-full p-8 shadow-[0_20px_60px_rgba(15,30,74,0.15)] border border-[#DCEEFF] relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowVerificationModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-[#FAFBFF] rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-[#5EA8FF] to-[#FF6FAF] rounded-2xl flex items-center justify-center mb-4 shadow-md text-white">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0F1E4A] tracking-tight">Verify Your Email</h3>
              <p className="text-slate-500 text-sm mt-2 px-4 leading-relaxed">
                We have sent a verification code to <span className="font-semibold text-slate-800">{formData.email}</span>. Please enter it below.
              </p>

              {verifiedSuccess ? (
                <div className="mt-6 w-full p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center text-sm font-semibold justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 shrink-0 animate-bounce" />
                  Email Verified! Redirecting...
                </div>
              ) : (
                <form onSubmit={handleVerifyCode} className="w-full mt-6 space-y-4">
                  {verificationError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold">
                      {verificationError}
                    </div>
                  )}

                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value.replace(/\D/g, ''))
                      if (verificationError) setVerificationError('')
                    }}
                    placeholder="Enter 6-Digit Code"
                    className="w-full tracking-[8px] text-center text-lg font-bold py-3.5 rounded-2xl border-2 border-[#DCEEFF] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] focus:border-transparent bg-[#FAFBFF] transition-all"
                  />

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3.5 bg-[#0F1E4A] text-white font-semibold rounded-2xl hover:bg-[#1a2d61] shadow-[0_8px_25px_rgba(15,30,74,0.15)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Code'
                    )}
                  </button>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-xs font-semibold text-[#5EA8FF] hover:text-[#5EA8FF]/80 transition-colors"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
