'use client'

import { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

interface MusicalNote {
  id: number
  left: number
  top: number
  animationDuration: number
  animationDelay: number
  fontSize: number
  symbol: string
}

interface ColorNote {
  id: number
  left: number
  top: number
  animationDuration: number
  fontSize: number
  color: string
  symbol: string
}

export default function MusicSparkle() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [mounted, setMounted] = useState(false)
  const [musicalNotes, setMusicalNotes] = useState<MusicalNote[]>([])
  const [colorNotes, setColorNotes] = useState<ColorNote[]>([])

  useEffect(() => {
    setMounted(true)
    
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = []
      for (let i = 0; i < 25; i++) {
        newSparkles.push({
          id: i,
          x: (i * 4) % 100,
          y: (i * 4) % 100,
          size: 2 + (i % 5),
          duration: 2 + (i % 3),
          delay: (i % 3)
        })
      }
      setSparkles(newSparkles)
    }

    // Generate musical notes with deterministic values
    const newMusicalNotes: MusicalNote[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: 5 + i * 6,
      top: 15 + (Math.sin(i) * 35),
      animationDuration: 3 + i * 0.4,
      animationDelay: i * 0.2,
      fontSize: 18 + (i % 14),
      symbol: ['\u266a', '\u266b', '\u266c', '\u2669', '\u266d', '\u266e', '\u266f', '♪', '♫', '♬'][i % 10]
    }))
    setMusicalNotes(newMusicalNotes)
    
    // Generate color notes with deterministic values
    const newColorNotes: ColorNote[] = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      left: 8 + i * 9,
      top: 25 + (Math.cos(i) * 25),
      animationDuration: 5 + i * 0.6,
      fontSize: 16 + (i % 12),
      color: ['#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fde047', '#fb923c'][i % 8],
      symbol: ['♪', '♫', '♬', '♭', '♮', '♯'][i % 6]
    }))
    setColorNotes(newColorNotes)

    generateSparkles()
    const interval = setInterval(generateSparkles, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {mounted && sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-pulse"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animation: `sparkle ${sparkle.duration}s ease-in-out ${sparkle.delay}s infinite`,
          }}
        >
          <div
            className="relative"
            style={{
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
            }}
          >
            <div className="absolute inset-0 bg-indigo-400 rounded-full opacity-60 blur-sm" />
            <div className="absolute inset-0 bg-purple-400 rounded-full opacity-40 blur-md" />
            <div className="absolute inset-0 bg-white rounded-full opacity-80" />
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
              <div className="w-full h-full relative">
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-b from-white to-transparent transform -translate-x-1/2" />
                <div className="absolute top-1/2 right-0 w-1/2 h-0.5 bg-gradient-to-l from-white to-transparent transform -translate-y-1/2" />
                <div className="absolute bottom-0 left-1/2 w-0.5 h-1/2 bg-gradient-to-t from-white to-transparent transform -translate-x-1/2" />
                <div className="absolute top-1/2 left-0 w-1/2 h-0.5 bg-gradient-to-r from-white to-transparent transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Enhanced Musical Notes */}
      {mounted && musicalNotes.map((note) => (
        <div
          key={`note-${note.id}`}
          className="absolute text-indigo-500 opacity-40 animate-bounce"
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
      
      {/* Additional Colorful Musical Elements */}
      {mounted && colorNotes.map((note) => (
        <div
          key={`color-note-${note.id}`}
          className="absolute opacity-50 animate-pulse"
          style={{
            left: `${note.left}%`,
            top: `${note.top}%`,
            animation: `spin ${note.animationDuration}s linear infinite`,
            fontSize: `${note.fontSize}px`,
            color: note.color,
          }}
        >
          {note.symbol}
        </div>
      ))}

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          75% {
            transform: translateY(5px) rotate(-5deg);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
