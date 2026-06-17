'use client'

import { useRouter } from 'next/navigation'
import { COURSE_COUNTS } from '@/data/coursesData'

export default function ExploreInstruments() {
  const router = useRouter()

  const instruments = [
    { name: 'Piano', courses: COURSE_COUNTS.piano, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', theme: 'pink' },
    { name: 'Guitar', courses: COURSE_COUNTS.guitar, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3', theme: 'blue' },
    { name: 'Drums', courses: COURSE_COUNTS.drums, icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z', theme: 'blue' },
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

  const handleViewAllInstruments = () => {
    console.log('Viewing all instruments...')
    router.push('/courses')
  }

  return (
    <section className="py-24 bg-[#FAFBFF] relative overflow-hidden font-sans">
      {/* Decorative top soft accents */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-[#DCEEFF]/30 rounded-br-full opacity-40"></div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFD6E8]/30 rounded-bl-full opacity-40"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-3xl font-extrabold text-[#0F1E4A] mb-4">
            Explore Music Instruments
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Choose your instrument and start your musical journey. From piano to guitar, drums to vocals, we have courses for every musician.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {instruments.map((instrument, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-[24px] border border-white/60 p-1 flex flex-col justify-between transition-all duration-300 transform translate-z-0 will-change-transform hover:-translate-y-[6px] hover:scale-[1.02] shadow-sm hover:shadow-xl hover:shadow-[#DCEEFF]/40 bg-white"
              style={{
                background: 'linear-gradient(135deg, #EAF5FF 0%, #F8FBFF 50%, #FFEAF4 100%)',
                transform: 'translateZ(0)'
              }}
              onClick={() => handleExploreCourses(instrument.name)}
            >
              {/* White glassmorphism card effect */}
              <div className="bg-white/60 backdrop-blur-[8px] rounded-[22px] py-10 px-5 text-center w-full h-full flex flex-col justify-between border border-white/40">
                <div className="mb-6">
                  {/* Icon with Circular pastel background */}
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm ${
                    instrument.theme === 'pink' ? 'bg-[#FFD6E8]/70 text-[#FF6FAF]' : 'bg-[#DCEEFF]/70 text-[#5EA8FF]'
                  }`}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={instrument.icon} />
                    </svg>
                  </div>
                  
                  {/* Heading Text */}
                  <h3 className="text-xl font-bold text-[#0F1E4A] mb-1.5">{instrument.name}</h3>
                  <p className="text-slate-400 font-bold text-xs">{instrument.courses} courses</p>
                </div>
                
                {/* Explore Courses Link with gradient text */}
                <div className="flex justify-center">
                  <span className="font-bold text-xs transition-all duration-300 group/link flex items-center gap-1">
                    <span className="bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] bg-clip-text text-transparent">
                      Explore Courses
                    </span>
                    <span className="text-[#FF6FAF] font-black transition-transform duration-300 group-hover/link:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={handleViewAllInstruments}
            className="h-12 px-8 rounded-[20px] text-sm font-bold text-white transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:from-[#FF6FAF] hover:to-[#5EA8FF] shadow-[#DCEEFF]/60"
          >
            View All Instruments
          </button>
        </div>
      </div>
    </section>
  )
}
