'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { COURSE_COUNTS } from '@/data/coursesData'
import { motion } from 'framer-motion'

export default function ExploreInstruments() {
  const router = useRouter()
  const [shakingCard, setShakingCard] = useState<number | null>(null)

  const instruments = [
    { name: 'Piano', courses: COURSE_COUNTS.piano, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', theme: 'pink' },
    { name: 'Guitar', courses: COURSE_COUNTS.guitar, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', theme: 'blue' },
    { name: 'Drums', courses: COURSE_COUNTS.drums, icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z', theme: 'cyan' },
    { name: 'Vocals', courses: COURSE_COUNTS.vocals, icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', theme: 'pink' },
    { name: 'Violin', courses: COURSE_COUNTS.violin, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', theme: 'blue' },
    { name: 'Music Theory', courses: COURSE_COUNTS['music-theory'], icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', theme: 'pink' },
    { name: 'Bass Guitar', courses: COURSE_COUNTS['bass-guitar'], icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', theme: 'blue' },
    { name: 'Saxophone', courses: COURSE_COUNTS.saxophone, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', theme: 'pink' }
  ]

  const handleExploreCourses = (instrumentName: string) => {
    console.log(`Exploring ${instrumentName} courses...`)
    
    const categoryMap: { [key: string]: string } = {
      'Piano': 'piano',
      'Guitar': 'guitar',
      'Drums': 'drums',
      'Vocals': 'vocals',
      'Violin': 'violin',
      'Music Theory': 'music-theory',
      'Bass Guitar': 'bass-guitar',
      'Saxophone': 'saxophone'
    }
    
    const category = categoryMap[instrumentName] || instrumentName.toLowerCase().replace(' ', '-')
    router.push(`/courses?category=${category}`)
  }

  const handleCardClick = (instrumentName: string, index: number) => {
    setShakingCard(index)
    setTimeout(() => {
      setShakingCard(null)
      handleExploreCourses(instrumentName)
    }, 250)
  }

  const handleViewAllInstruments = () => {
    console.log('Viewing all instruments...')
    router.push('/courses')
  }

  // Define icon gradient themes
  const getIconStyles = (theme: string) => {
    switch (theme) {
      case 'pink':
        return 'bg-gradient-to-tr from-[#FF6FAF]/15 via-[#FFD6E8]/25 to-[#FFEAF4]/40 text-[#FF6FAF] border border-[#FF6FAF]/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]'
      case 'blue':
        return 'bg-gradient-to-tr from-[#5EA8FF]/15 via-[#DCEEFF]/25 to-[#EAF5FF]/40 text-[#5EA8FF] border border-[#5EA8FF]/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]'
      case 'cyan':
        return 'bg-gradient-to-tr from-[#00E5FF]/15 via-[#E0F7FA]/25 to-[#E0F7FA]/40 text-[#00B8D4] border border-[#00E5FF]/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]'
      default:
        return 'bg-[#DCEEFF]/70 text-[#5EA8FF]'
    }
  }

  // Framer Motion staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring' as const, 
        stiffness: 80, 
        damping: 14 
      } 
    }
  }

  return (
    <section className="py-24 bg-[#FAFBFF] relative overflow-hidden font-sans">
      {/* Decorative top soft accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#DCEEFF]/20 rounded-br-full opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD6E8]/20 rounded-bl-full opacity-60"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F1E4A] mb-4 tracking-tight">
            Explore Music Instruments
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Choose your instrument and start your musical journey. From piano to guitar, drums to vocals, we have courses for every musician.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12"
        >
          {instruments.map((instrument, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative cursor-pointer rounded-[24px] border-[1.5px] border-[#5EA8FF]/15 p-[1px] flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(94,168,255,0.14)] will-change-transform transform-gpu"
              style={{
                background: 'linear-gradient(135deg, #EAF5FF 0%, #F8FBFF 50%, #FFEAF4 100%)',
                backfaceVisibility: 'hidden'
              }}
              onClick={() => handleCardClick(instrument.name, index)}
            >
              {/* White glassmorphism card effect */}
              <div className="bg-white/45 backdrop-blur-[16px] rounded-[23px] py-10 px-6 text-center w-full h-full flex flex-col justify-between items-center transition-all duration-300 border border-white/30 overflow-hidden relative">
                
                <div className="mb-8 flex flex-col items-center w-full">
                  {/* Icon with Circular pastel background and inner glow */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-105 group-hover:rotate-[6deg] transition-all duration-300 ease-out backdrop-blur-[8px] ${getIconStyles(instrument.theme)}`}>
                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={instrument.icon} />
                    </svg>
                  </div>
                  
                  {/* Heading Text */}
                  <h3 className="text-xl font-bold text-[#0F1E4A] mb-2 transition-colors duration-300 group-hover:text-[#5EA8FF]">
                    {instrument.name}
                  </h3>
                  <p className="text-slate-400 font-bold text-xs">
                    {instrument.courses} courses
                  </p>
                </div>
                
                {/* Explore Courses Button Redesign */}
                <div className="flex justify-center w-full">
                  <div
                    className={`btn-premium-base btn-premium-explore h-[48px] w-fit px-[28px] ${
                      shakingCard === index ? 'animate-button-shake' : ''
                    }`}
                  >
                    <span className="relative z-10 select-none">
                      Explore Courses
                    </span>
                    <svg 
                      className="w-4 h-4 ml-2 relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-2 text-current" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth={2.5} 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-20">
          <button 
            onClick={handleViewAllInstruments}
            className="btn-premium-base btn-premium-gradient h-12 px-8 text-sm font-semibold"
          >
            View All Instruments
          </button>
        </div>
      </div>
    </section>
  )
}

