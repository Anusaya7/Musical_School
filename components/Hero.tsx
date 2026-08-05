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
      animationDuration: 3 + i * 0.3,
      animationDelay: i * 0.2,
      fontSize: 24 + (i % 16),
      symbol: ['\u266a', '\u266b', '\u266c', '\u2669', '\u266d', '\u266e', '\u266f'][i]
    }))
    setMusicalNotes(newMusicalNotes)
    
    // Generate floating elements with deterministic values
    const newFloatingElements: FloatingElement[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 5 + i * 8,
      top: 10 + (Math.cos(i) * 30),
      animationDuration: 4 + i * 0.4,
      animationDelay: i * 0.3,
      fontSize: 16 + (i % 12),
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
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-32 overflow-hidden">
        {/* Yellow Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-br-full opacity-80 z-10"></div>
        <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-bl-full opacity-80 z-10"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 bg-yellow-400 rounded-tr-full opacity-80 z-10"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-tl-full opacity-80 z-10"></div>
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-10 animate-pulse" />
          <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full opacity-5 animate-pulse" />
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full opacity-10 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full opacity-15 animate-pulse" />
          
          {/* Additional Sparkle Elements */}
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-yellow-300 rounded-full opacity-20 animate-ping" />
          <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-pink-300 rounded-full opacity-30 animate-ping" />
          <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-blue-300 rounded-full opacity-25 animate-ping" />
          <div className="absolute top-2/3 right-1/4 w-10 h-10 bg-purple-300 rounded-full opacity-35 animate-ping" />
          
          {/* Floating Music Symbols */}
          <div className="absolute top-20 left-20 text-6xl text-white/20 animate-spin" style={{ animationDuration: '10s' }}>♪</div>
          <div className="absolute top-40 right-32 text-5xl text-white/15 animate-bounce" style={{ animationDelay: '1s' }}>♫</div>
          <div className="absolute bottom-32 left-40 text-4xl text-white/25 animate-pulse" style={{ animationDelay: '2s' }}>♬</div>
          <div className="absolute top-60 right-20 text-5xl text-white/20 animate-spin" style={{ animationDuration: '8s', animationDelay: '0.5s' }}>♭</div>
        </div>

        {/* Musical Notes Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {mounted && musicalNotes.map((note) => (
            <div
              key={note.id}
              className="absolute text-white opacity-30 animate-bounce"
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
          
          {/* Additional Floating Music Elements */}
          {mounted && floatingElements.map((element) => (
            <div
              key={`float-${element.id}`}
              className="absolute text-yellow-200 opacity-40 animate-pulse"
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

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Trust Badge */}
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 text-white text-sm font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              {heroSettings.banner || "Empowering 10,000+ aspiring musicians across India"}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            {heroSettings.tagline || "Start Your Musical Journey"}
            <span className="block text-4xl md:text-5xl bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              {heroSettings.subtitle || "with Confidence"}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl mb-12 text-purple-100 max-w-4xl mx-auto leading-relaxed">
            {heroSettings.description || "Learn piano, guitar, vocals, drums and more with expert instructors. Whether you're a beginner or advancing your skills, build real confidence with structured lessons and practical guidance."}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={heroSettings.searchPlaceholder || "Search courses, instruments, or instructors..."}
                className="w-full px-6 py-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-indigo-700 px-6 py-2 rounded-full font-semibold hover:bg-yellow-100 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Primary CTA */}
          <div className="flex justify-center">
            <button 
              onClick={handleExploreCourses}
              className="relative group bg-white text-indigo-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-100 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] shadow-xl hover:shadow-2xl"
            >
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                {heroSettings.primaryButtonText || "Explore Courses"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
            </button>
          </div>

          {/* Floating Music Elements */}
          <div className="absolute top-10 left-10 text-4xl animate-spin" style={{ animationDuration: '8s' }}>?</div>
          <div className="absolute top-20 right-20 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>?</div>
          <div className="absolute bottom-20 left-20 text-3xl animate-pulse" style={{ animationDelay: '2s' }}>?</div>
          <div className="absolute bottom-10 right-10 text-4xl animate-spin" style={{ animationDuration: '10s', animationDelay: '0.5s' }}>?</div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(5deg);
          }
          75% {
            transform: translateY(5px) rotate(-5deg);
          }
        }
      `}</style>
    </>
  )
}
