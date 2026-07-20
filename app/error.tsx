'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Runtime Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1E4A] via-[#1a2d61] to-[#0A1435] flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-lg w-full text-center space-y-6 bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
        <div className="w-20 h-20 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle size={40} />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white">
          Something went wrong!
        </h1>

        <p className="text-gray-300 text-sm leading-relaxed">
          An unexpected glitch occurred while loading this page. Our technical team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
