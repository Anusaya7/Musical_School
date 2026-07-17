'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function ExploreInstruments() {
  const router = useRouter()
  const [shakingCard, setShakingCard] = useState<number | null>(null)
  const [instrumentsList, setInstrumentsList] = useState<any[]>([])
  const [coursesList, setCoursesList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/categories?paginated=false').then(res => res.json()).catch(() => []),
      fetch('/api/courses').then(res => res.json()).catch(() => [])
    ]).then(([insts, crss]) => {
      if (Array.isArray(insts)) setInstrumentsList(insts)
      if (Array.isArray(crss)) setCoursesList(crss)
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load instruments or courses:', err)
      setLoading(false)
    })
  }, [])

  const handleExploreCourses = (instrumentId: string, status: string) => {
    if (status === 'Upcoming') {
      alert("Thanks for your interest! We'll notify you as soon as our Saxophone classes launch.")
      return
    }
    router.push(`/courses/${instrumentId}`)
  }

  const handleCardClick = (instrumentId: string, status: string, index: number) => {
    if (status === 'Upcoming') {
      handleExploreCourses(instrumentId, status)
      return
    }
    setShakingCard(index)
    setTimeout(() => {
      setShakingCard(null)
      handleExploreCourses(instrumentId, status)
    }, 250)
  }

  const handleViewAllInstruments = () => {
    router.push('/courses')
  }

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

  // Pre-process instruments and associate with courses list
  const visibleInstruments = instrumentsList.filter(inst => inst.isVisible !== false && inst.status !== 'Inactive')
  const mappedInstruments = visibleInstruments.map((inst, index) => {
    const matchingCourses = coursesList.filter(
      c => c.category?.toLowerCase() === inst.id?.toLowerCase() && !c.isDisabled
    )
    const startingPrice = inst.startingPrice || (matchingCourses.length > 0 ? Math.min(...matchingCourses.map(c => c.price)) : 4999)
    
    const themes = ['pink', 'blue', 'cyan']
    const theme = themes[index % themes.length]

    const iconMap: { [key: string]: string } = {
      piano: '/icons/piano.svg',
      guitar: '/icons/guitar.svg',
      drums: '/icons/drums.svg',
      vocals: '/icons/microphone.svg',
      violin: '/icons/violin.svg',
      'music-theory': '/icons/music-theory.svg',
      'bass-guitar': '/icons/bass-guitar.svg',
      saxophone: '/icons/saxophone.svg'
    }

    const lookupId = inst.id?.toLowerCase() || ''
    const normalizedId = lookupId === 'vocals' ? 'vocals'
      : lookupId === 'theory' || lookupId === 'music-theory' || lookupId === 'music theory' ? 'music-theory'
      : lookupId === 'bass' || lookupId === 'bass-guitar' || lookupId === 'bass guitar' ? 'bass-guitar'
      : lookupId;

    const uniqueLevels = inst.levels || matchingCourses
      .map(c => c.level)
      .filter((value, idx, self) => self.indexOf(value) === idx)

    return {
      id: inst.id,
      name: inst.name,
      status: inst.status === 'ACTIVE' ? 'Active' : (inst.status === 'COMING_SOON' ? 'Upcoming' : 'Inactive'),
      courses: 3,
      levels: uniqueLevels.length > 0 ? uniqueLevels.join(', ') : 'Beginner, Intermediate, Advanced',
      startingPrice,
      icon: iconMap[normalizedId] || inst.icon || '/icons/piano.svg',
      theme
    }
  })

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-500 font-bold text-sm">
        Loading instruments registry...
      </div>
    )
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
          {mappedInstruments.map((instrument, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="group relative cursor-pointer rounded-[24px] border-[1.5px] border-[#5EA8FF]/15 p-[1px] flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_20px_50px_rgba(94,168,255,0.14)] will-change-transform transform-gpu"
              style={{
                background: 'linear-gradient(135deg, #EAF5FF 0%, #F8FBFF 50%, #FFEAF4 100%)',
                backfaceVisibility: 'hidden'
              }}
              onClick={() => handleCardClick(instrument.id, instrument.status, index)}
            >
              {/* White glassmorphism card effect */}
              <div className="bg-white/45 backdrop-blur-[16px] rounded-[23px] py-10 px-6 text-center w-full h-full flex flex-col justify-between items-center transition-all duration-300 border border-white/30 overflow-hidden relative">
                
                {/* Upcoming Badge */}
                {instrument.status === 'Upcoming' && (
                  <div className="absolute top-4 right-4 bg-[#FFF7E6] text-[#D97706] border border-[#FACC15] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    🚀 Coming Soon
                  </div>
                )}

                <div className="mb-8 flex flex-col items-center w-full">
                  {/* Icon with Circular pastel background and inner glow */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 group-hover:scale-105 group-hover:rotate-[6deg] transition-all duration-300 ease-out backdrop-blur-[8px] ${getIconStyles(instrument.theme)}`}>
                    {instrument.icon?.startsWith('/') ? (
                      <img 
                        src={instrument.icon} 
                        alt={instrument.name} 
                        className="w-10 h-10 object-contain" 
                      />
                    ) : (
                      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={instrument.icon} />
                      </svg>
                    )}
                  </div>
                  
                  {/* Heading Text */}
                  <h3 className="text-xl font-bold text-[#0F1E4A] mb-2 transition-colors duration-300 group-hover:text-[#5EA8FF]">
                    {instrument.name}
                  </h3>
                  
                  {instrument.status === 'Upcoming' ? (
                    <p className="text-[#D97706] font-extrabold text-xs uppercase tracking-wider">
                      Launching Soon
                    </p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-slate-400 font-bold text-xs">
                        {instrument.courses} courses
                      </p>
                      <p className="text-[10px] text-slate-450 font-medium">
                        Levels: {instrument.levels}
                      </p>
                      {instrument.startingPrice && (
                        <p className="text-xs font-black text-[#5EA8FF] mt-1">
                          Starts from ₹{instrument.startingPrice.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Explore Courses Button */}
                <div className="flex justify-center w-full">
                  <div
                    className={`btn-premium-base btn-premium-explore h-[48px] w-fit px-[28px] ${
                      shakingCard === index ? 'animate-button-shake' : ''
                    } ${instrument.status === 'Upcoming' ? 'opacity-75 cursor-not-allowed border-amber-300' : ''}`}
                  >
                    <span className="relative z-10 select-none">
                      {instrument.status === 'Upcoming' ? 'Notify Me' : 'Explore Courses'}
                    </span>
                    {instrument.status !== 'Upcoming' && (
                      <svg 
                        className="w-4 h-4 ml-2 relative z-10 text-current" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth={2.5} 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    )}
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
