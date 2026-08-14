'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DEFAULT_CATEGORIES } from '@/lib/fallback-data'
import InstrumentIllustration from '@/components/InstrumentIllustration'

export default function ExploreInstruments() {
  const router = useRouter()
  const [shakingCard, setShakingCard] = useState<number | null>(null)
  const [instrumentsList, setInstrumentsList] = useState<any[]>([])
  const [coursesList, setCoursesList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorOccurred, setErrorOccurred] = useState(false)

  const fetchInstrumentsData = () => {
    setLoading(true)
    setErrorOccurred(false)
    Promise.all([
      fetch('/api/categories?paginated=false').then(res => {
        if (!res.ok) throw new Error('API failed')
        return res.json()
      }),
      fetch('/api/courses').then(res => {
        if (!res.ok) throw new Error('API failed')
        return res.json()
      })
    ]).then(([insts, crss]) => {
      const finalInsts = Array.isArray(insts) && insts.length > 0 && !insts.some(i => i.error) ? insts : DEFAULT_CATEGORIES
      const finalCrss = Array.isArray(crss) ? crss : []
      setInstrumentsList(finalInsts)
      setCoursesList(finalCrss)
      setLoading(false)
    }).catch(err => {
      console.error('Failed to load instruments or courses:', err)
      setErrorOccurred(true)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchInstrumentsData()
  }, [])

  const [notifyMsg, setNotifyMsg] = useState<string | null>(null)

  const handleExploreCourses = (instrumentId: string, status: string) => {
    if (status === 'Upcoming') {
      setNotifyMsg("Thanks for your interest! We'll notify you as soon as these classes launch.")
      setTimeout(() => setNotifyMsg(null), 4000)
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

  const getBorderColorClass = (theme: string) => {
    switch (theme) {
      case 'pink':
        return 'border-[#FF6FAF]/30'
      case 'blue':
        return 'border-[#5EA8FF]/30'
      case 'cyan':
        return 'border-[#00B8D4]/30'
      case 'purple':
        return 'border-[#DFA7FF]/30'
      case 'gold':
        return 'border-[#EAB308]/30'
      case 'teal':
        return 'border-[#0D9488]/30'
      default:
        return 'border-[#5EA8FF]/30'
    }
  }

  const FloatingNotes = ({ colorTheme }: { colorTheme: string }) => {
    const noteColors: Record<string, string> = {
      pink: 'text-[#FF6FAF]',
      blue: 'text-[#5EA8FF]',
      cyan: 'text-[#00B8D4]',
      purple: 'text-[#C37DFF]',
      gold: 'text-[#EAB308]',
      teal: 'text-[#0D9488]'
    }
    const color = noteColors[colorTheme] || 'text-[#5EA8FF]'

    return (
      <>
        {/* Note 1 */}
        <span className={`absolute -top-2 -left-2 opacity-0 scale-75 translate-y-2 group-hover:opacity-90 group-hover:scale-100 group-hover:-translate-y-4 transition-all duration-500 ease-out pointer-events-none ${color}`}>
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 12 16">
            <path d="M8 12.5c0 1.38-1.12 2.5-2.5 2.5S3 13.88 3 12.5s1.12-2.5 2.5-2.5c.34 0 .66.07.96.19V2h5v3H8v7.5z" />
          </svg>
        </span>
        {/* Note 2 */}
        <span className={`absolute -top-3 -right-2 opacity-0 scale-75 translate-y-2 group-hover:opacity-90 group-hover:scale-100 group-hover:-translate-y-5 transition-all duration-500 ease-out delay-75 pointer-events-none ${color}`}>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
            <path d="M3 11.5c0 1.1.9 2 2 2s2-.9 2-2v-8l7-1.75V9.5c0 1.1.9 2 2 2s2-.9 2-2v-9L5 2.5v9z" />
          </svg>
        </span>
      </>
    )
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
    const startingPrice = inst.startingPrice || (matchingCourses.length > 0 ? Math.min(...matchingCourses.map(c => c.price)) : 3500)
    
    const lookupId = inst.id?.toLowerCase() || ''
    const normalizedId = lookupId === 'vocals' ? 'vocals'
      : lookupId === 'theory' || lookupId === 'music-theory' || lookupId === 'music theory' ? 'music-theory'
      : lookupId === 'bass' || lookupId === 'bass-guitar' || lookupId === 'bass guitar' ? 'bass-guitar'
      : lookupId;

    const themeMap: { [key: string]: string } = {
      piano: 'pink',
      guitar: 'blue',
      drums: 'cyan',
      vocals: 'pink',
      violin: 'blue',
      'music-theory': 'teal',
      'bass-guitar': 'purple',
      saxophone: 'blue'
    }
    const theme = themeMap[normalizedId] || 'blue'

    const uniqueLevels = inst.levels || matchingCourses
      .map(c => c.level)
      .filter((value, idx, self) => self.indexOf(value) === idx)

    return {
      id: inst.id,
      name: inst.name,
      status: inst.status === 'Active' || inst.status === 'ACTIVE' ? 'Active' : (inst.status === 'Upcoming' || inst.status === 'COMING_SOON' ? 'Upcoming' : 'Inactive'),
      courses: matchingCourses.length,
      levels: uniqueLevels.length > 0 ? uniqueLevels.join(', ') : 'Beginner, Intermediate, Advanced',
      startingPrice,
      icon: '',
      theme
    }
  })

  if (errorOccurred) {
    return (
      <section className="py-24 bg-[#FAFBFF] text-center font-sans">
        <div className="container mx-auto px-6 max-w-md bg-white border-2 border-red-100 rounded-[28px] p-10 shadow-lg">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
          <h3 className="text-xl font-bold text-[#10234F] mb-3">Unable to Load Instruments</h3>
          <p className="text-sm text-slate-500 mb-8 font-semibold leading-relaxed">
            There was a connection issue loading our instrument directory. Please check your connection and try again.
          </p>
          <button 
            onClick={fetchInstrumentsData} 
            className="btn-premium-base btn-premium-gradient h-12 w-full font-bold text-sm"
          >
            Retry Loading
          </button>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="py-24 bg-[#FAFBFF] relative overflow-hidden font-sans">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <div className="h-9 w-64 bg-slate-200 animate-pulse rounded-md mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-slate-200 animate-pulse rounded-md mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-[#DCE8F8] rounded-[24px] p-10 flex flex-col items-center justify-between h-[280px]">
                <div className="w-20 h-20 bg-slate-200 animate-pulse rounded-full mb-6"></div>
                <div className="h-6 w-32 bg-slate-200 animate-pulse rounded-md mb-2"></div>
                <div className="h-4 w-24 bg-slate-200 animate-pulse rounded-md mb-4"></div>
                <div className="h-10 w-full bg-slate-200 animate-pulse rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 bg-[#FAFBFF] relative overflow-hidden font-sans">
      {/* Decorative top soft accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#DCEEFF]/20 rounded-br-full opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD6E8]/20 rounded-bl-full opacity-60"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          {notifyMsg && (
            <div className="mb-6 p-4 max-w-md mx-auto bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl shadow-sm animate-fade-in">
              {notifyMsg}
            </div>
          )}
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
                  {/* Icon with Circular glass container and border/shadow */}
                  <div 
                    style={{
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(248, 249, 255, 0.95))',
                      boxShadow: '0 12px 32px rgba(72, 94, 144, 0.12)',
                    }}
                    className={`w-20 h-20 rounded-full border-2 flex items-center justify-center mb-6 relative transition-all duration-300 backdrop-blur-[12px] group-hover:shadow-[0_20px_40px_rgba(72,94,144,0.24)] ${getBorderColorClass(instrument.theme)}`}
                  >
                    {/* Floating music notes on hover */}
                    <FloatingNotes colorTheme={instrument.theme} />

                    {/* Reusable premium illustration component */}
                    <InstrumentIllustration 
                      category={instrument.id} 
                      size={58} 
                      className="w-[58px] h-[58px]" 
                    />
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
