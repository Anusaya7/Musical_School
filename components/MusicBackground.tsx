'use client'

import { useEffect, useState } from 'react'

export default function MusicBackground() {
  const [waves, setWaves] = useState<number[]>([])

  useEffect(() => {
    setWaves(Array.from({ length: 5 }, (_, i) => i))
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-10" />
      
      {/* Animated Sound Waves */}
      <div className="absolute bottom-0 left-0 right-0 h-64">
        {waves.map((wave) => (
          <div
            key={wave}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-500 to-transparent"
            style={{
              height: '100%',
              animation: `wave ${3 + wave * 0.5}s ease-in-out ${wave * 0.2}s infinite`,
              transformOrigin: 'bottom',
            }}
          />
        ))}
      </div>

      {/* Floating Music Elements */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={`element-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + Math.sin(i) * 20}%`,
              animation: `rotate ${8 + i * 2}s linear infinite`,
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-30" />
              <div className="absolute inset-1 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-50" />
              <div className="absolute inset-2 bg-white rounded-full opacity-70" />
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Particle Effects */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: ['#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#f472b6', '#34d399'][i % 6],
            animation: `particle ${4 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
      
      {/* Additional Sparkle Elements */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`sparkle-bg-${i}`}
          className="absolute w-2 h-2 bg-white rounded-full animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform: scaleY(0.3) translateY(100%);
            opacity: 0.3;
          }
          50% {
            transform: scaleY(1) translateY(0);
            opacity: 0.6;
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg) translateX(0);
          }
          to {
            transform: rotate(360deg) translateX(20px);
          }
        }
        
        @keyframes particle {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
