'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import SearchFilterBar from '@/components/SearchFilterBar'
import { Sun, Moon, Sparkles, TrendingUp, Clock, Users, Award } from 'lucide-react'

const featuredCourses = [
  {
    id: '1',
    title: 'Piano Fundamentals',
    instructor: 'instructor all in one',
    level: 'Beginner',
    duration: '8 weeks',
    price: 199,
    rating: 4.8,
    students: 1250,
    image: '/piano-course.jpg',
    description: 'Learn the fundamentals of piano playing including basic chords, scales, and simple melodies.',
    highlights: ['Basic Music Theory', 'Hand Positioning', 'Simple Songs', 'Practice Routines'],
    category: 'Piano'
  },
  {
    id: '2',
    title: 'Guitar Mastery',
    instructor: 'instructor all in one',
    level: 'Intermediate',
    duration: '12 weeks',
    price: 299,
    rating: 4.9,
    students: 890,
    image: '/guitar-course.jpg',
    description: 'Master advanced guitar techniques including complex chords, solos, and music theory.',
    highlights: ['Advanced Chords', 'Solo Techniques', 'Music Theory', 'Performance Skills'],
    category: 'Guitar'
  },
  {
    id: '3',
    title: 'Vocal Training Pro',
    instructor: 'instructor all in one',
    level: 'All Levels',
    duration: '10 weeks',
    price: 249,
    rating: 4.7,
    students: 1567,
    image: '/vocal-course.jpg',
    description: 'Develop your singing voice with proper breathing techniques, pitch control, and performance skills.',
    highlights: ['Breathing Techniques', 'Pitch Control', 'Performance Skills', 'Voice Care'],
    category: 'Vocals'
  },
  {
    id: '4',
    title: 'Drumming Essentials',
    instructor: 'instructor all in one',
    level: 'Beginner',
    duration: '6 weeks',
    price: 179,
    rating: 4.6,
    students: 432,
    image: '/drums-course.jpg',
    description: 'Learn essential drumming techniques, rhythms, and patterns for various music genres.',
    highlights: ['Basic Rhythms', 'Drum Techniques', 'Genre Styles', 'Practice Methods'],
    category: 'Drums'
  },
  {
    id: '5',
    title: 'Music Theory Complete',
    instructor: 'instructor all in one',
    level: 'All Levels',
    duration: '8 weeks',
    price: 149,
    rating: 4.8,
    students: 2103,
    image: '/theory-course.jpg',
    description: 'Comprehensive music theory course covering notation, harmony, composition, and analysis.',
    highlights: ['Music Notation', 'Harmony & Chords', 'Composition', 'Music Analysis'],
    category: 'Music Theory'
  },
  {
    id: '6',
    title: 'Violin Basics',
    instructor: 'instructor all in one',
    level: 'Beginner',
    duration: '10 weeks',
    price: 279,
    rating: 4.7,
    students: 678,
    image: '/violin-course.jpg',
    description: 'Learn violin fundamentals including proper posture, bowing techniques, and basic repertoire.',
    highlights: ['Posture & Holding', 'Bowing Techniques', 'Basic Repertoire', 'Music Reading'],
    category: 'Violin'
  }
]

export default function FeaturedCourses() {
  const { addItem, isInCart } = useCart()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [filteredCourses, setFilteredCourses] = useState(featuredCourses)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const renderStars = (rating: number) => {
    return <div className="text-yellow-400">{'\u2605'.repeat(Math.floor(rating))}</div>
  }

  return (
    <section className={`py-20 transition-all duration-500 relative ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-purple-50 via-white to-blue-50'}`}>
      {/* Yellow Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-br-full opacity-80"></div>
      <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-bl-full opacity-80"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-yellow-400 rounded-tr-full opacity-80"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-tl-full opacity-80"></div>
      <div className="container mx-auto px-4">
        {/* Header Section with Mode Toggle */}
        <div className="flex justify-between items-center mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-purple-800' : 'bg-purple-100'}`}>
                <Sparkles className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Featured Courses
              </h2>
            </div>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl`}>
              Discover our handpicked selection of premium music courses designed to transform your musical journey
            </p>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-2xl transition-all duration-200 ${isDarkMode ? 'bg-purple-800 hover:bg-purple-700' : 'bg-white hover:bg-gray-100'} shadow-lg hover:shadow-xl`}
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-purple-700' : 'bg-white border border-gray-200'} shadow-lg`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-700' : 'bg-purple-100'}`}>
                <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Courses</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{featuredCourses.length}</p>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-purple-700' : 'bg-white border border-gray-200'} shadow-lg`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-700' : 'bg-purple-100'}`}>
                <Users className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Students</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {featuredCourses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-purple-700' : 'bg-white border border-gray-200'} shadow-lg`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-700' : 'bg-purple-100'}`}>
                <Award className={`w-6 h-6 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Rating</p>
                <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>4.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <SearchFilterBar 
          courses={featuredCourses} 
          onFilteredCourses={setFilteredCourses} 
          isDarkMode={isDarkMode}
        />

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div key={course.id} className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${isDarkMode ? 'bg-gray-800 border border-purple-700' : 'bg-white border border-gray-200'} shadow-lg hover:shadow-2xl`}>
                {/* Course Image/Gradient */}
                <div className={`h-56 relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-purple-800 to-blue-800' : 'bg-gradient-to-br from-purple-500 to-blue-500'}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white/20" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-purple-700 text-purple-200' : 'bg-white text-purple-700'}`}>
                      {course.level}
                    </span>
                  </div>
                </div>
                
                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(course.rating)}
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>({course.rating})</span>
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {course.title}
                  </h3>
                  
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-2`}>
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{course.students}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      {course.price}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => addItem(course)}
                      disabled={isInCart(course.id)}
                      className={`flex-1 px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:translate-y-[-2px] hover:scale-105 ${
                        isInCart(course.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:scale-[0.97]'
                      }`}
                    >
                      {isInCart(course.id) ? 'In Cart' : 'Add to Cart'}
                    </button>
                    
                    <Link
                      href={`/courses/${course.id}`}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 border-2 transform hover:translate-y-[-2px] hover:scale-105 ${
                        isDarkMode 
                          ? 'border-purple-600 text-purple-400 hover:bg-purple-600' 
                          : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <svg className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No courses found</h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Try adjusting your filters to see more results.</p>
              <button 
                onClick={() => setFilteredCourses(featuredCourses)}
                className="inline-flex items-center justify-center px-6 py-3 font-medium rounded-xl transition-all duration-200 ease-in-out bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 shadow-md hover:shadow-lg min-h-[44px]"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className={`mt-16 p-8 rounded-3xl text-center ${isDarkMode ? 'bg-gradient-to-r from-purple-800 to-blue-800 border border-purple-700' : 'bg-gradient-to-r from-purple-600 to-blue-600'} shadow-2xl`}>
          <h3 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-white'}`}>
            Ready to Start Your Musical Journey?
          </h3>
          <p className={`text-xl mb-8 ${isDarkMode ? 'text-purple-200' : 'text-purple-100'} max-w-2xl mx-auto`}>
            Join thousands of students learning music with our expert instructors and interactive courses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 ease-in-out bg-white text-purple-600 hover:bg-gray-100 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 shadow-lg hover:shadow-xl min-h-[44px]">
              View All Courses
            </button>
            <button className="inline-flex items-center justify-center px-8 py-4 font-semibold rounded-xl transition-all duration-200 ease-in-out border-2 border-white text-white hover:bg-white/10 active:bg-white/20 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 min-h-[44px]">
              Browse by Instrument
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
