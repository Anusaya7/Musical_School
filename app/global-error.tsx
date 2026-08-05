'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0F1E4A] flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-lg w-full text-center space-y-6 bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
          <div className="w-20 h-20 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle size={40} />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white">
            Critical System Error
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed">
            A system-level error occurred in the root layout. Click below to recover the application.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
