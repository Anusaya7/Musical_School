'use client'

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'
import logoEmblem from '@/public/images/logo_emblem.png'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { safeRelativeCallback } from '@/lib/safe-callback'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'

const POST_LOGIN_KEY = 'postLoginRedirect'

function defaultRouteForRole(role: string) {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return '/admin'
  if (role === 'INSTRUCTOR') return '/instructor'
  return '/student/dashboard'
}

function resolvePostLoginTarget(role: string, callbackFromUrl: string | null) {
  const fromQuery = safeRelativeCallback(callbackFromUrl)
  const fromStorage = safeRelativeCallback(sessionStorage.getItem(POST_LOGIN_KEY))
  sessionStorage.removeItem(POST_LOGIN_KEY)
  return fromQuery || fromStorage || defaultRouteForRole(role)
}

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackParam = searchParams.get('callbackUrl')
  const signupHref = callbackParam
    ? `/signup?callbackUrl=${encodeURIComponent(callbackParam)}`
    : '/signup'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loginSuccess, setLoginSuccess] = useState(false)

  useEffect(() => {
    const safe = safeRelativeCallback(callbackParam)
    if (safe) sessionStorage.setItem(POST_LOGIN_KEY, safe)
  }, [callbackParam])

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

    try {
      const checkRes = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      const checkData = await checkRes.json()

      if (!checkRes.ok || !checkData.success) {
        const errorMsg = checkRes.status === 500
          ? 'Unable to sign in right now. Please try again.'
          : (checkData.error || 'Invalid email or password.')
        setErrors({ email: errorMsg })
        setIsLoading(false)
        return
      }

      const role = checkData.role
      const targetRoute = resolvePostLoginTarget(role, callbackParam)

      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl: targetRoute,
      })

      if (res?.error) {
        setErrors({ email: 'Invalid email or password.' })
      } else {
        setLoginSuccess(true)
        const name = checkData.name || (role === 'SUPER_ADMIN' ? 'Ajinkya Amrule' : role === 'INSTRUCTOR' ? 'Ajinkya Amrule' : 'Verified User')
        
        const userPayload = {
          email: formData.email,
          name: name,
          role: role,
          rememberMe: formData.rememberMe
        }
        localStorage.setItem('user', JSON.stringify(userPayload))
        window.dispatchEvent(new Event('user-login-changed'))

        setTimeout(() => {
          window.location.replace(targetRoute)
        }, 800)
      }
    } catch (error) {
      console.error('[AUTH] Login submission error:', error)
      setErrors({ email: 'Login failed. Please try again.' })
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#DCEEFF] opacity-15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-[#FF6FAF] to-[#FFD6E8] opacity-20 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/70 backdrop-blur-md rounded-[24px] shadow-[0_20px_60px_rgba(94,168,255,0.08)] border border-[#E6EEFF] p-8 md:p-10 relative z-10 transition-all">
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
            Sign in to continue purchase or open your portal.
          </p>
        </div>

        {loginSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center text-sm font-medium">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 shrink-0" />
            Login successful! Redirecting...
          </div>
        )}

        {(errors.email && !errors.email.includes('Account')) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 shrink-0" />
            {errors.email}
          </div>
        )}

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

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          New to the school?{' '}
          <Link href={signupHref} className="font-semibold text-[#FF6FAF] hover:text-[#FF6FAF]/85 transition-colors">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
