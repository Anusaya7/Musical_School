'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Suspense } from 'react'

function PaymentFailedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const errorMessage = searchParams.get('error') || 'The transaction was cancelled or failed to verify.'

  return (
    <div className="min-h-screen bg-[#FAFBFF] font-sans">
      <Header />

      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-[#FFD6E8] rounded-[32px] p-8 shadow-[0_15px_50px_rgba(255,111,175,0.04)] text-center space-y-8 animate-scaleUp">
          
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-inner">
              <AlertCircle className="w-10 h-10 text-red-500 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#0F1E4A] tracking-tight">Payment Failed</h1>
            <p className="text-xs font-semibold text-slate-400">Something went wrong during checkout.</p>
          </div>

          <div className="bg-red-50/50 border border-[#FFD6E8] rounded-[24px] p-5 text-left text-xs space-y-2">
            <span className="font-bold text-red-500 uppercase tracking-wider block">Error Details</span>
            <p className="font-medium text-slate-600 leading-relaxed">{errorMessage}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full h-12 bg-gradient-to-r from-[#FF6FAF] to-[#FF8EBF] hover:shadow-md text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" /> Retry Payment
            </button>

            <Link
              href="/courses"
              className="w-full h-12 bg-white border border-[#E6EEFF] hover:border-[#5EA8FF] hover:bg-[#FAFBFF] text-[#0F1E4A] rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Courses
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}

export default function PaymentFailed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center font-bold text-sm text-slate-400">
        Loading failure details...
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  )
}
