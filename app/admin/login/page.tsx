'use client'

import { useState } from 'react'
import Image from 'next/image'
import logoEmblem from '@/public/images/logo_emblem.png'
import { signIn } from 'next-auth/react'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Loader2
} from 'lucide-react'

export default function AdminLoginPage() {
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

    console.log(`[ADMIN-AUTH] Login attempt started for: ${formData.email}`)

    try {
      // 1. Pre-validate credentials to show specific error messages
      const checkRes = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      const checkData = await checkRes.json()

      if (!checkRes.ok || !checkData.success) {
        console.log(`[ADMIN-AUTH] Login failed: ${checkData.error || 'Invalid credentials'}.`)
        const errorMsg = checkRes.status === 500
          ? 'Unable to sign in right now. Please try again.'
          : (checkData.error || 'Invalid email or password.')
        setErrors({ email: errorMsg })
        setIsLoading(false)
        return
      }

      const role = checkData.role
      console.log(`[ADMIN-AUTH] Validation succeeded. Role detected: ${role}`)

      if (role !== 'SUPER_ADMIN' && role !== 'ADMIN') {
        console.log(`[ADMIN-AUTH] Login rejected: role ${role} not authorized for admin portal.`)
        setErrors({ email: 'Unauthorized account. Admin credentials required.' })
        setIsLoading(false)
        return
      }

      // 2. Perform actual NextAuth login
      const res = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      if (res?.error) {
        console.error(`[ADMIN-AUTH] NextAuth credentials session creation failed: ${res.error}`)
        setErrors({ email: 'Invalid email or password.' })
      } else {
        setLoginSuccess(true)
        const name = checkData.name || 'Ajinkya Amrule'
        
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          name: name,
          role: role,
          rememberMe: formData.rememberMe
        }))

        // Dispatch storage update event to refresh navbar
        window.dispatchEvent(new Event('user-login-changed'))

        console.log(`[ADMIN-AUTH] Redirecting to route: /admin`)

        setTimeout(() => {
          window.location.replace('/admin')
        }, 1000)
      }
    } catch (error) {
      console.error('[ADMIN-AUTH] Login submission error:', error)
      setErrors({ email: 'Unable to sign in right now. Please try again.' })
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
          <h1 className="text-3xl font-extrabold text-[#0F1E4A] tracking-tight">Admin Login</h1>
          <p className="text-slate-500 text-sm mt-2 text-center max-w-[280px]">
            Access the music school administration portal.
          </p>
        </div>

        {loginSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4 border border-green-100 shadow-sm animate-bounce">
              ✓
            </div>
            <h3 className="text-lg font-bold text-[#0F1E4A]">Login Successful</h3>
            <p className="text-slate-500 text-sm mt-1">Redirecting you to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#0F1E4A] mb-1.5 pl-1">
                Admin Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your admin email"
                  className={`w-full pl-11 pr-4 py-3 bg-white/80 border-2 rounded-2xl outline-none transition-all text-sm font-medium ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500 text-red-900 placeholder-red-300' 
                      : 'border-[#DCEEFF] focus:border-[#5EA8FF] text-[#0F1E4A]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-500 pl-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 pl-1 pr-1">
                <label htmlFor="password" className="text-sm font-semibold text-[#0F1E4A]">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-11 py-3 bg-white/80 border-2 rounded-2xl outline-none transition-all text-sm font-medium ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 text-red-900 placeholder-red-300' 
                      : 'border-[#DCEEFF] focus:border-[#5EA8FF] text-[#0F1E4A]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500 pl-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between pl-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-medium">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white rounded-2xl hover:opacity-95 shadow-[0_8px_25px_rgba(94,168,255,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 font-bold text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In as Admin'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
