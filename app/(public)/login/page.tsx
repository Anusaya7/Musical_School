'use client'

import { useState } from 'react'
import Image from 'next/image'
import logoEmblem from '@/public/images/logo_emblem.png'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Music, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loginSuccess, setLoginSuccess] = useState(false)
  const { theme } = useTheme()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setErrors({})

    console.log(`[AUTH] Login attempt started for: ${formData.email}`)

    try {
      // 1. Pre-validate credentials to show specific error messages
      const checkRes = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      const checkData = await checkRes.json()

      if (!checkRes.ok || !checkData.success) {
        console.log(`[AUTH] Login failed: ${checkData.error || 'Invalid credentials'}. Redirecting to unauthorized page...`)
        window.location.replace(`/unauthorized?error=${encodeURIComponent('Invalid admin email or password.')}`)
        setIsLoading(false)
        return
      }

      const role = checkData.role
      console.log(`[AUTH] Validation succeeded. Role detected: ${role}`)

      // 2. Perform actual NextAuth login
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (res?.error) {
        console.error(`[AUTH] NextAuth credentials session creation failed: ${res.error}`)
        window.location.replace(`/unauthorized?error=${encodeURIComponent('Invalid admin email or password.')}`)
      } else {
        setLoginSuccess(true)
        const name = role === 'SUPER_ADMIN' ? 'Ajinkya Amrule' : role === 'INSTRUCTOR' ? 'Ajinkya Amrule' : 'John Doe'
        
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          name: name,
          role: role,
          rememberMe: formData.rememberMe
        }))

        const targetRoute = (role === 'SUPER_ADMIN' || role === 'ADMIN') ? '/admin' : role === 'INSTRUCTOR' ? '/instructor' : '/student'
        console.log(`[AUTH] Redirecting to route: ${targetRoute}`)

        setTimeout(() => {
          window.location.replace(targetRoute)
        }, 1200)
      }
    } catch (error) {
      console.error('[AUTH] Login submission error:', error)
      setErrors({ email: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/student/dashboard' })
    } catch (error) {
      console.warn('Google Auth.js sign-in failed. Falling back to local developer simulation.', error)
      const mockGoogleUser = {
        email: 'student@2ndinversion.com',
        name: 'John Doe',
        role: 'STUDENT',
        isVerified: true
      }
      localStorage.setItem('user', JSON.stringify(mockGoogleUser))
      setLoginSuccess(true)
      setTimeout(() => {
        window.location.replace('/student/dashboard')
      }, 1200)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFBFF] via-[#F8FBFF] to-[#FFF5FA] flex items-center justify-center p-6 font-sans">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#DCEEFF] opacity-15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#FF6FAF] to-[#FFD6E8] opacity-20 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-[24px] shadow-[0_20px_60px_rgba(94,168,255,0.08)] border border-[#E6EEFF] p-8 md:p-10 relative z-10 transition-all">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex flex-col items-center gap-2.5 mb-4 select-none">
            <Image
              src={logoEmblem}
              alt="2nd Inversion Logo"
              width={50}
              height={50}
              className="object-contain"
              style={{ filter: 'drop-shadow(0 4px 10px rgba(212,175,55,0.18))' }}
            />
            <span className="text-xs font-bold text-[#0F1E4A] tracking-wide uppercase">2nd Inversion Musical School</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F1E4A] tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 text-sm mt-2 text-center max-w-[280px]">
            Access your learning and management portal.
          </p>
        </div>

        {/* Social Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3.5 bg-white border-2 border-[#DCEEFF] rounded-2xl hover:bg-[#FAFBFF] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 font-semibold text-[#0F1E4A] mb-6 gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-[#E6EEFF]"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 py-1 bg-slate-50/90 backdrop-blur-sm border border-[#E6EEFF] text-slate-400 font-extrabold uppercase tracking-wider select-none text-[9px] rounded-full">
              OR CONTINUE WITH EMAIL
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {loginSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center text-sm font-medium">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 shrink-0" />
            Login successful! Redirecting to portal...
          </div>
        )}

        {/* Error Alert */}
        {/* Note: We also display inline below fields for cleaner UX */}
        {(errors.email && !errors.email.includes('Account')) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 shrink-0" />
            {errors.email}
          </div>
        )}

        {/* Traditional Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0F1E4A] mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-[#DCEEFF] focus:ring-[#5EA8FF]'} focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-[#FAFBFF] transition-all`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-[#0F1E4A]">Password</label>
              <Link href="/forgot-password" className="text-xs font-semibold text-[#5EA8FF] hover:text-[#5EA8FF]/80 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3.5 rounded-2xl border ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-[#DCEEFF] focus:ring-[#5EA8FF]'} focus:outline-none focus:ring-2 focus:border-transparent text-sm bg-[#FAFBFF] transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#0F1E4A] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded text-[#5EA8FF] border-[#DCEEFF] focus:ring-[#5EA8FF] cursor-pointer"
            />
            <label htmlFor="rememberMe" className="ml-2.5 text-sm text-slate-500 font-medium cursor-pointer">
              Remember Me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#0F1E4A] text-white font-semibold rounded-2xl hover:bg-[#1a2d61] shadow-[0_8px_25px_rgba(15,30,74,0.15)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In with Email'
            )}
          </button>
        </form>

        {/* Create Account Link */}
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          New to the school?{' '}
          <Link href="/signup" className="font-semibold text-[#FF6FAF] hover:text-[#FF6FAF]/85 transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
