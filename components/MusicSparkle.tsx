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

export default function MusicSparkle() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = []
      for (let i = 0; i < 25; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 6 + 2,
          duration: Math.random() * 4 + 2,
          delay: Math.random() * 3
        })
      }
      setSparkles(newSparkles)
    }

    generateSparkles()
    const interval = setInterval(generateSparkles, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {sparkles.map((sparkle) => (
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
      {[...Array(15)].map((_, i) => (
        <div
          key={`note-${i}`}
          className="absolute text-indigo-500 opacity-40 animate-bounce"
          style={{
            left: `${5 + i * 6}%`,
            top: `${15 + Math.sin(i) * 35}%`,
            animation: `float ${3 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
            fontSize: `${18 + Math.random() * 14}px`,
          }}
        >
          {['\u266a', '\u266b', '\u266c', '\u2669', '\u266d', '\u266e', '\u266f', '♪', '♫', '♬'][i % 10]}
        </div>
      ))}
      
      {/* Additional Colorful Musical Elements */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`color-note-${i}`}
          className="absolute opacity-50 animate-pulse"
          style={{
            left: `${8 + i * 9}%`,
            top: `${25 + Math.cos(i) * 25}%`,
            animation: `spin ${5 + i * 0.6}s linear infinite`,
            fontSize: `${16 + Math.random() * 12}px`,
            color: ['#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fde047', '#fb923c'][i % 8],
          }}
        >
          {['♪', '♫', '♬', '♭', '♮', '♯'][i % 6]}
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
