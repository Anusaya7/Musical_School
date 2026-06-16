'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import SearchFilterBar from '@/components/SearchFilterBar'
import { Sun, Moon, Sparkles, TrendingUp, Clock, Users, Award } from 'lucide-react'

const featuredCourses = [
  {
    id: 1,
    title: 'Piano Fundamentals',
    instructor: 'instructor all in one',
    level: 'Beginner',
    duration: '8 weeks',
    price: '$199',
    rating: 4.8,
    students: 1250,
    image: '/piano-course.jpg',
    description: 'Learn the fundamentals of piano playing including basic chords, scales, and simple melodies.',
    highlights: ['Basic Music Theory', 'Hand Positioning', 'Simple Songs', 'Practice Routines'],
    category: 'Piano'
  },
  {
    id: 2,
    title: 'Guitar Mastery',
    instructor: 'instructor all in one',
    level: 'Intermediate',
    duration: '12 weeks',
    price: '$299',
    rating: 4.9,
    students: 890,
    image: '/guitar-course.jpg',
    description: 'Master advanced guitar techniques including complex chords, solos, and music theory.',
    highlights: ['Advanced Chords', 'Solo Techniques', 'Music Theory', 'Performance Skills'],
    category: 'Guitar'
  },
  {
    id: 3,
    title: 'Vocal Training Pro',
    instructor: 'instructor all in one',
    level: 'All Levels',
    duration: '10 weeks',
    price: '$249',
    rating: 4.7,
    students: 1567,
    image: '/vocal-course.jpg',
    description: 'Develop your singing voice with proper breathing techniques, pitch control, and performance skills.',
    highlights: ['Breathing Techniques', 'Pitch Control', 'Performance Skills', 'Voice Care'],
    category: 'Vocals'
  },
  {
    id: 4,
    title: 'Drumming Essentials',
    instructor: 'instructor all in one',
    level: 'Beginner',
    duration: '6 weeks',
    price: '$179',
    rating: 4.6,
    students: 432,
    image: '/drums-course.jpg',
    description: 'Learn essential drumming techniques, rhythms, and patterns for various music genres.',
    highlights: ['Basic Rhythms', 'Drum Techniques', 'Genre Styles', 'Practice Methods'],
    category: 'Drums'
  },
  {
    id: 5,
    title: 'Music Theory Complete',
    instructor: 'instructor all in one',
    level: 'All Levels',
    duration: '8 weeks',
    price: '$149',
    rating: 4.8,
    students: 2103,
    image: '/theory-course.jpg',
    description: 'Comprehensive music theory course covering notation, harmony, composition, and analysis.',
    highlights: ['Music Notation', 'Harmony & Chords', 'Composition', 'Music Analysis'],
    category: 'Music Theory'
  },
  {
    id: 6,
    title: 'Violin Basics',
    instructor: 'instructor all in one',
    level: 'Beginner',
    duration: '10 weeks',
    price: '$279',
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
    <section className="py-20 transition-all duration-500 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Featured Courses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <p className="text-2xl font-bold text-purple-600 mb-4">{course.price}</p>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
