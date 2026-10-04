'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function RedirectToVerifiedSuccess() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const query = params.toString()
    router.replace(query ? `/payment/success?${query}` : '/payment/failed?reason=failed')
  }, [params, router])

  return (
    <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center text-sm font-bold text-slate-400">
      Confirming payment...
    </div>
  )
}

export default function PaymentSuccessRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center text-sm font-bold text-slate-400">
        Confirming payment...
      </div>
    }>
      <RedirectToVerifiedSuccess />
    </Suspense>
  )
}
