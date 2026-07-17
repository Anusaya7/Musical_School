'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Home, LayoutDashboard } from 'lucide-react'
import { Suspense } from 'react'

function UnauthorizedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const errorMessage = searchParams.get('error') || 'You do not have permission to access this page.'

  const handleGoToDashboard = () => {
    const savedUserStr = localStorage.getItem('user')
    if (savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr)
        const role = user.role?.toUpperCase()
        if (role === 'SUPER_ADMIN') {
          router.push('/admin')
          return
        } else if (role === 'INSTRUCTOR') {
          router.push('/instructor')
          return
        }
      } catch (e) {
        // ignore
      }
    }
    router.push('/student/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-[0_10px_50px_rgba(94,168,255,0.08)] border border-[#DCEEFF] text-center flex flex-col items-center relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#5EA8FF] to-[#DCEEFF] opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#FF6FAF] to-[#FFD6E8] opacity-25 blur-3xl pointer-events-none"></div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-[#FFD6E8]/40 flex items-center justify-center mb-6 border-2 border-white shadow-[0_8px_30px_rgba(255,111,175,0.1)] text-4xl select-none">
          🔒
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-[#0F1E4A] mb-3 tracking-tight">
          Access Restricted
        </h1>

        {/* Subtitle */}
        <p className="text-[#0F1E4A]/60 text-base mb-8 leading-relaxed">
          {errorMessage}
        </p>

        {/* Button container */}
        <div className="w-full flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/')}
            className="flex-1 px-6 py-3.5 bg-white border-2 border-[#DCEEFF] text-[#0F1E4A] font-semibold rounded-2xl hover:bg-[#FAFBFF] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-500" />
            Return Home
          </button>
          
          <button
            onClick={handleGoToDashboard}
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white font-semibold rounded-2xl hover:opacity-95 shadow-[0_8px_25px_rgba(94,168,255,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go To My Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center font-bold text-sm text-slate-400">
        Loading restriction details...
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  )
}
