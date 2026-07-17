'use client'

import { useEffect, useState } from 'react'

interface Particle {
  id: number
  left: number
  top: number
  width: number
  height: number
  color: string
  duration: number
  delay: number
}

interface Sparkle {
  id: number
  left: number
  top: number
  delay: number
  duration: number
}

export default function MusicBackground() {
  const [waves, setWaves] = useState<number[]>([])
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    setWaves(Array.from({ length: 5 }, (_, i) => i))
    
    // Generate particles with deterministic values
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: (i * 3.33) % 100,
      top: (i * 3.33) % 100,
      width: 1 + (i % 3),
      height: 1 + (i % 3),
      color: ['#fbbf24', '#f87171', '#60a5fa', '#a78bfa', '#f472b6', '#34d399'][i % 6],
      duration: 4 + (i % 4),
      delay: (i % 4)
    }))
    setParticles(newParticles)
    
    // Generate sparkles with deterministic values
    const newSparkles: Sparkle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: (i * 6.67) % 100,
      top: (i * 6.67) % 100,
      delay: (i % 3),
      duration: 2 + (i % 2)
    }))
    setSparkles(newSparkles)
    
    setMounted(true)
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
      {mounted && particles.map((particle) => (
        <div
          key={`particle-${particle.id}`}
          className="absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            backgroundColor: particle.color,
            animation: `particle ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      {/* Additional Sparkle Elements */}
      {mounted && sparkles.map((sparkle) => (
        <div
          key={`sparkle-bg-${sparkle.id}`}
          className="absolute w-2 h-2 bg-white rounded-full animate-ping"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
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
