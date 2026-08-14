'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

interface MusicalNote {
  id: number
  left: number
  top: number
  animationDuration: number
  animationDelay: number
  fontSize: number
  symbol: string
}

interface FloatingElement {
  id: number
  left: number
  top: number
  animationDuration: number
  animationDelay: number
  fontSize: number
  symbol: string
}

export default function Hero() {
  const router = useRouter()
  const { settings } = useSiteSettings()
  const heroSettings = settings.homepage_hero || {}
  const [mounted, setMounted] = useState(false)
  const [musicalNotes, setMusicalNotes] = useState<MusicalNote[]>([])
  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    setMounted(true)

    // Generate musical notes with deterministic values
    const newMusicalNotes: MusicalNote[] = Array.from({ length: 7 }, (_, i) => ({
      id: i,
      left: 10 + i * 13,
      top: 15 + (Math.sin(i) * 25),
      animationDuration: 4 + i * 0.5,
      animationDelay: i * 0.2,
      fontSize: 20 + (i % 12),
      symbol: ['\u266a', '\u266b', '\u266c', '\u2669', '\u266d', '\u266e', '\u266f'][i]
    }))
    setMusicalNotes(newMusicalNotes)

    // Generate floating elements with deterministic values
    const newFloatingElements: FloatingElement[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 5 + i * 12,
      top: 10 + (Math.cos(i) * 20),
      animationDuration: 5 + i * 0.6,
      animationDelay: i * 0.3,
      fontSize: 14 + (i % 8),
      symbol: ['♪', '♫', '♬', '♭', '♮', '♯'][i % 6]
    }))
    setFloatingElements(newFloatingElements)
  }, [])

  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchTerm.trim().toLowerCase())}`)
    } else {
      router.push('/courses')
    }
  }

  const handleExploreCourses = () => {
    router.push(heroSettings.primaryButtonUrl || '/courses')
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-[#0F1E4A] via-[#1E293B] to-[#3B0764] text-white py-28 md:py-36 overflow-hidden">
        {/* Soft Decorative Glows */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20 pointer-events-none" />

        {/* Animated Particles background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {mounted && musicalNotes.map((note) => (
            <div
              key={note.id}
              className="absolute text-purple-300/20 select-none"
              style={{
                left: `${note.left}%`,
                top: `${note.top}%`,
                animation: `float ${note.animationDuration}s ease-in-out ${note.animationDelay}s infinite`,
                fontSize: `${note.fontSize}px`,
              }}
            >
              {note.symbol}
            </div>
          ))}

          {mounted && floatingElements.map((element) => (
            <div
              key={`float-${element.id}`}
              className="absolute text-blue-300/25 select-none"
              style={{
                left: `${element.left}%`,
                top: `${element.top}%`,
                animation: `float ${element.animationDuration}s ease-in-out ${element.animationDelay}s infinite`,
                fontSize: `${element.fontSize}px`,
              }}
            >
              {element.symbol}
            </div>
          ))}
        </div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Side: Content & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-white text-xs md:text-sm font-semibold shadow-inner select-none">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                <span>{heroSettings.banner || "Premium Music Education in Pune"}</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Start Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#C084FC]">
                  Musical Journey
                </span>{' '}
                with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F472B6] to-[#FB7185]">
                  Confidence
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base md:text-lg text-slate-300 max-w-2xl leading-relaxed font-medium">
                {heroSettings.description || "Learn piano, guitar, vocals, drums and more with expert instructors. Whether you're a beginner or advancing your skills, build real confidence with structured lessons and practical guidance."}
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={heroSettings.searchPlaceholder || "Search courses, instruments, or instructors..."}
                      className="w-full h-14 pl-6 pr-32 rounded-full bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-semibold transition-all duration-300"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1.5 h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 rounded-full font-bold text-xs shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.97] hover:brightness-110 flex items-center justify-center"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {/* Action Button */}
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={handleExploreCourses}
                  className="btn-premium-base btn-premium-gradient px-8 py-4 text-base font-bold shadow-xl hover:shadow-2xl"
                >
                  <span className="relative z-10">
                    {heroSettings.primaryButtonText || "Explore Courses"}
                  </span>
                </button>
                <button
                  onClick={() => router.push('/contact')}
                  className="btn-premium-base btn-premium-secondary px-8 py-4 text-base font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50"
                >
                  Book Free Demo
                </button>
              </div>

            </div>

            {/* Right Side: Elegant Floating Card Graphics */}
            <div className="lg:col-span-5 relative w-full h-[400px] flex items-center justify-center select-none pointer-events-none mt-8 lg:mt-0">
              {/* Central Glowing Orb */}
              <div className="absolute w-60 h-60 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-2xl animate-pulse" />

              {/* Instrument Card 1: Piano (Top-Left) */}
              <div 
                className="absolute top-4 left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl flex items-center gap-4 w-[220px]"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                <div className="w-12 h-12 bg-pink-500/20 text-pink-300 rounded-xl flex items-center justify-center text-2xl font-bold">🎹</div>
                <div>
                  <h4 className="font-bold text-sm text-white">Piano Classes</h4>
                  <p className="text-[10px] text-pink-200 font-semibold">Trinity & ABRSM Prep</p>
                </div>
              </div>

              {/* Instrument Card 2: Guitar (Bottom-Right) */}
              <div 
                className="absolute bottom-8 right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl flex items-center gap-4 w-[220px]"
                style={{ animation: 'float 5s ease-in-out 1s infinite' }}
              >
                <div className="w-12 h-12 bg-blue-500/20 text-blue-300 rounded-xl flex items-center justify-center text-2xl font-bold">🎸</div>
                <div>
                  <h4 className="font-bold text-sm text-white">Guitar Classes</h4>
                  <p className="text-[10px] text-blue-200 font-semibold">Acoustic & Electric</p>
                </div>
              </div>

              {/* Instrument Card 3: Vocals (Center-Right) */}
              <div 
                className="absolute top-1/3 right-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl flex items-center gap-4 w-[200px]"
                style={{ animation: 'float 7s ease-in-out 0.5s infinite' }}
              >
                <div className="w-12 h-12 bg-purple-500/20 text-purple-300 rounded-xl flex items-center justify-center text-2xl font-bold">🎤</div>
                <div>
                  <h4 className="font-bold text-sm text-white">Vocals Training</h4>
                  <p className="text-[10px] text-purple-200 font-semibold">Classical & Western</p>
                </div>
              </div>

              {/* Instrument Card 4: Drums (Bottom-Left) */}
              <div 
                className="absolute bottom-16 left-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-2xl flex items-center gap-4 w-[200px]"
                style={{ animation: 'float 8s ease-in-out 1.5s infinite' }}
              >
                <div className="w-12 h-12 bg-cyan-500/20 text-cyan-300 rounded-xl flex items-center justify-center text-2xl font-bold">🥁</div>
                <div>
                  <h4 className="font-bold text-sm text-white">Drums Beats</h4>
                  <p className="text-[10px] text-cyan-200 font-semibold">Rhythm & Rudiments</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-12px) rotate(2deg);
          }
          75% {
            transform: translateY(8px) rotate(-2deg);
          }
        }
      `}</style>
    </>
  )
}
