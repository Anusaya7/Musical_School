'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import BookingSystem from '@/components/BookingSystem'
import MusicSparkle from '@/components/MusicSparkle'
import MusicBackground from '@/components/MusicBackground'
import { useTheme } from '@/contexts/ThemeContext'

function BookingContent() {
  const searchParams = useSearchParams()
  const classParam = searchParams.get('class')
  const [selectedClass] = useState<string | null>(classParam)
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <MusicBackground />
      <MusicSparkle />
      <Header />
      <div className="pt-24 pb-16">
        <BookingSystem selectedClass={selectedClass} />
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm font-semibold text-slate-600">Loading booking portal...</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  )
}
