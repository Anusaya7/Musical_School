import Link from 'next/link'
import { Music, ArrowLeft, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F1E4A] via-[#1a2d61] to-[#0A1435] flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-lg w-full text-center space-y-6 bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/20 shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
          <Music size={40} className="text-white" />
        </div>

        <h1 className="text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Lost in Harmonies?</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The page or musical score you are looking for has been moved or does not exist in our portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            href="/courses"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Explore Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
