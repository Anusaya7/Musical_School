'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { COURSE_COUNTS } from '@/data/coursesData'

export default function ExploreInstruments() {
  const router = useRouter();

  const searchParams = useSearchParams()

  const searchTerm = searchParams.get('search')?.toLowerCase().trim() || ''

  const instruments = [
    { name: 'Piano', courses: COURSE_COUNTS.piano, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { name: 'Guitar', courses: COURSE_COUNTS.guitar, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { name: 'Drums', courses: COURSE_COUNTS.drums, icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Vocals', courses: COURSE_COUNTS.vocals, icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { name: 'Violin', courses: COURSE_COUNTS.violin, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { name: 'Music Theory', courses: COURSE_COUNTS['music-theory'], icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Bass Guitar', courses: COURSE_COUNTS['bass-guitar'], icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { name: 'Saxophone', courses: COURSE_COUNTS.saxophone, icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' }
  ];

  const filteredInstruments =
  searchTerm === ''
    ? instruments
    : instruments.filter(
        (instrument) =>
          instrument.name.toLowerCase() === searchTerm
      )

  const handleExploreCourses = (instrumentName: string) => {
    console.log(`Exploring ${instrumentName} courses...`)
    
    // Map instrument names to category slugs
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
    
    // Navigate to courses page with category filter
    router.push(`/courses?category=${category}`)
  }

  const handleViewAllInstruments = () => {
    console.log('Viewing all instruments...')
    alert('Showing all available instruments and courses')
    router.push('/courses')
  }

  return (
    <section className="py-20 bg-white relative">
      {/* Yellow Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-br-full"></div>
      <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-yellow-400 rounded-tr-full"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-tl-full"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4">Explore Music Instruments</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Choose your instrument and start your musical journey. From piano to guitar, drums to vocals, we have courses for every musician.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
         {filteredInstruments.length > 0 ? (
            filteredInstruments.map((instrument, index) => (
            <div
              key={index}
              className="relative group cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-103 hover:brightness-105 hover:shadow-xl rounded-2xl overflow-hidden"
              onClick={() => handleExploreCourses(instrument.name)}
            >
              {/* Exact Blue to Golden Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>
              
              {/* Premium Overlay */}
              <div className="absolute inset-0 bg-black/10"></div>
              
              {/* Content - Center Aligned */}
              <div className="relative py-12 px-6 text-center">
                {/* Icon with White Transparent Circle */}
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={instrument.icon} />
                  </svg>
                </div>
                
                {/* White Text - Semi-bold/Bold */}
                <h3 className="text-2xl font-bold text-white mb-2">{instrument.name}</h3>
                <p className="text-white/80 mb-6">{instrument.courses} courses</p>
                
                {/* Explore Courses Link */}
                <button className="text-white/80 font-semibold transition-all duration-300 hover:text-white group/link">
                  <span className="relative z-10">Explore Courses</span>
                  <span className="ml-1 transition-transform duration-300 group-hover/link:translate-x-1">{' '}&rarr;</span>
                </button>
              </div>
            </div>
         ))
        ) : (
          <div className="col-span-full text-center py-10">
            <h3 className="text-2xl font-semibold text-gray-700">
              No instruments found
            </h3>
          </div>
        )}
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={handleViewAllInstruments}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105"
          >
            View All Instruments
          </button>
        </div>
      </div>
    </section>
  )
}
