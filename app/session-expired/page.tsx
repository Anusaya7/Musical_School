'use client'

import Link from 'next/link'
import { Clock, LogIn, Home } from 'lucide-react'

export default function SessionExpiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1E4A] via-[#1a2d61] to-[#0A1435] flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-white/10 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="w-20 h-20 bg-amber-500/20 border border-amber-500/40 rounded-3xl flex items-center justify-center mx-auto text-amber-400 shadow-lg">
          <Clock size={40} />
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white">
          Session Expired
        </h1>

        <p className="text-gray-300 text-sm leading-relaxed">
          Your security session has timed out due to inactivity. Please log in again to continue accessing your dashboard.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/login"
            className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Log In Now
          </Link>
          <Link
            href="/"
            className="flex-1 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
