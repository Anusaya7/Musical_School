'use client'

import { useEffect } from 'react'

export default function StudentRootPage() {
  useEffect(() => {
    window.location.replace('/student/dashboard')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFF]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#5EA8FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">Loading Student Dashboard...</p>
      </div>
    </div>
  )
}
