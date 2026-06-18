'use client'

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import { Clock, Star, User, ShoppingCart } from 'lucide-react'
import BookingModal from '@/components/BookingModal'
import BookingSuccess from '@/components/BookingSuccess'

// Custom SVG Note Components
const SingleNote = memo(({ className, color }: { className?: string; color: string }) => (
  <svg className={`${className} w-3 h-4`} viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 12.5c0 1.38-1.12 2.5-2.5 2.5S3 13.88 3 12.5s1.12-2.5 2.5-2.5c.34 0 .66.07.96.19V2h5v3H8v7.5z"
      fill={color}
    />
  </svg>
))
SingleNote.displayName = 'SingleNote'

const DoubleNote = memo(({ className, color }: { className?: string; color: string }) => (
  <svg className={`${className} w-4 h-4`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 11.5c0 1.1.9 2 2 2s2-.9 2-2v-8l7-1.75V9.5c0 1.1.9 2 2 2s2-.9 2-2v-9L5 2.5v9z"
      fill={color}
    />
  </svg>
))
DoubleNote.displayName = 'DoubleNote'

// Custom 3D Glossy Grand Piano Vector SVG
const PianoSVG = memo(({ color }: { color: 'pink' | 'blue' | 'purple' }) => {
  const themes = {
    pink: {
      baseGrad: ['#FFD6E8', '#FF6FAF'],
      highlight: '#FFF0F6',
      shadow: '#FF3B8E',
      noteColor: '#FF6FAF'
    },
    blue: {
      baseGrad: ['#DCEEFF', '#5EA8FF'],
      highlight: '#F0F7FF',
      shadow: '#2B8CFF',
      noteColor: '#5EA8FF'
    },
    purple: {
      baseGrad: ['#F4D9FF', '#DFA7FF'],
      highlight: '#FAF0FF',
      shadow: '#C37DFF',
      noteColor: '#DFA7FF'
    }
  }

  const active = themes[color]
  const gradId = `piano-grad-${color}`
  const glossyId = `glossy-grad-${color}`

  return (
    <div className="relative w-32 h-24 flex-shrink-0 select-none">
      <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Main 3D Gradient */}
          <linearGradient id={gradId} x1="20" y1="15" x2="100" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active.baseGrad[0]} />
            <stop offset="50%" stopColor={active.baseGrad[1]} />
            <stop offset="100%" stopColor={active.shadow} />
          </linearGradient>
          {/* Glossy Overlay Gradient */}
          <linearGradient id={glossyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 3D Drop Shadow under the Piano */}
        <ellipse cx="60" cy="72" rx="42" ry="7" fill="black" fillOpacity="0.08" />

        {/* Piano Back/Main Body */}
        <path
          d="M15 48 C15 28, 40 28, 55 18 C68 8, 100 8, 108 18 C115 26, 115 56, 108 60 C98 65, 35 65, 15 58 Z"
          fill={`url(#${gradId})`}
          stroke={active.baseGrad[1]}
          strokeWidth="0.5"
        />

        {/* Glossy Specular Reflection Layer */}
        <path
          d="M16 45 C20 28, 42 28, 55 19 C66 10, 98 10, 106 19 C111 25, 111 50, 106 54 Z"
          fill={`url(#${glossyId})`}
        />

        {/* Piano Open Lid */}
        <path d="M48 15 L92 5 L102 18 L58 22 Z" fill={active.highlight} opacity="0.95" stroke={active.baseGrad[1]} strokeWidth="0.5" />
        {/* Support Stick */}
        <line x1="88" y1="5" x2="88" y2="20" stroke="#555" strokeWidth="2" />

        {/* Keyboard Bed */}
        <rect x="20" y="48" width="70" height="12" rx="2" fill="white" stroke={active.baseGrad[1]} strokeWidth="1.2" />
        {/* Key Dividers */}
        <line x1="26" y1="48" x2="26" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="32" y1="48" x2="32" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="38" y1="48" x2="38" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="44" y1="48" x2="44" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="50" y1="48" x2="50" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="56" y1="48" x2="56" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="62" y1="48" x2="62" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="68" y1="48" x2="68" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="74" y1="48" x2="74" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="80" y1="48" x2="80" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="86" y1="48" x2="86" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />

        {/* Black keys */}
        <rect x="24" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="30" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="42" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="48" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="54" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="66" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="72" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="78" y="48" width="2" height="7" fill="#0F172A" />

        {/* Legs */}
        <rect x="22" y="60" width="3.5" height="13" fill={active.baseGrad[1]} />
        <rect x="84.5" y="60" width="3.5" height="13" fill={active.baseGrad[1]} />
        <rect x="53" y="61" width="3.5" height="11" fill={active.shadow} />
      </svg>
      
      {/* Floating vector music notes */}
      <DoubleNote className="absolute -top-1 -right-3 opacity-60 animate-bounce" color={active.noteColor} />
      <SingleNote className="absolute top-8 -left-4 opacity-50 animate-pulse" color={active.noteColor} />
      <SingleNote className="absolute -top-4 left-12 opacity-40 animate-bounce" color={active.noteColor} />
    </div>
  )
})
PianoSVG.displayName = 'PianoSVG'

// Static piano courses array placed outside component to guarantee stable references
const pianoCourses = [
  {
    id: 'piano-beginner',
    title: 'Piano Beginner',
    category: 'PIANO',
    level: 'Beginner',
    price: 4999,
    instructor: 'Ajinkya Amrule',
    duration: '3 Months',
    rating: 4.8,
    description: 'Build a strong piano foundation with posture, note reading, scales, and your first performance pieces.',
    themeColor: 'pink',
    badgeText: 'BEGINNER',
    cardStyle: {
      bg: 'bg-white',
      border: 'border-[#FFD6E8] hover:border-[#FF6FAF]/50',
      shadow: 'shadow-sm hover:shadow-xl hover:shadow-[#FFD6E8]/30',
      badge: 'bg-[#FFD6E8]/30 text-[#FF6FAF] border-[#FFD6E8]/60',
      label: 'text-[#FF6FAF]',
      instructorIcon: 'text-[#FF6FAF]',
      pillBg: 'bg-[#FFD6E8]/20',
      iconColor: '#FF6FAF',
      price: 'text-[#FF6FAF]',
      primaryBtn: 'bg-gradient-to-r from-[#FF6FAF] to-[#FF8EBF] hover:from-[#FF8EBF] hover:to-[#FF6FAF] shadow-[#FFD6E8]/60',
      secondaryBtn: 'border-[#FF6FAF]/40 text-[#FF6FAF] hover:bg-[#FFD6E8]/20',
      cartBtn: 'border-gray-200 text-gray-400 hover:border-[#FF6FAF] hover:text-[#FF6FAF] hover:bg-[#FFD6E8]/10'
    }
  },
  {
    id: 'piano-intermediate',
    title: 'Piano Intermediate',
    category: 'PIANO',
    level: 'Intermediate',
    price: 6999,
    instructor: 'Ajinkya Amrule',
    duration: '4 Months',
    rating: 4.85,
    description: 'Develop expressive playing, chord voicings, sight-reading fluency, and stylistic versatility.',
    themeColor: 'blue',
    badgeText: 'INTERMEDIATE',
    cardStyle: {
      bg: 'bg-white',
      border: 'border-[#DCEEFF] hover:border-[#5EA8FF]/50',
      shadow: 'shadow-sm hover:shadow-xl hover:shadow-[#DCEEFF]/30',
      badge: 'bg-[#DCEEFF]/30 text-[#5EA8FF] border-[#DCEEFF]/60',
      label: 'text-[#5EA8FF]',
      instructorIcon: 'text-[#5EA8FF]',
      pillBg: 'bg-[#DCEEFF]/20',
      iconColor: '#5EA8FF',
      price: 'text-[#5EA8FF]',
      primaryBtn: 'bg-gradient-to-r from-[#5EA8FF] to-[#7EB8FF] hover:from-[#7EB8FF] hover:to-[#5EA8FF] shadow-[#DCEEFF]/60',
      secondaryBtn: 'border-[#5EA8FF]/40 text-[#5EA8FF] hover:bg-[#DCEEFF]/20',
      cartBtn: 'border-gray-200 text-gray-400 hover:border-[#5EA8FF] hover:text-[#5EA8FF] hover:bg-[#DCEEFF]/10'
    }
  },
  {
    id: 'piano-advanced',
    title: 'Piano Advanced',
    category: 'PIANO',
    level: 'Advanced',
    price: 9999,
    instructor: 'Ajinkya Amrule',
    duration: '6 Months',
    rating: 4.9,
    description: 'Master advanced repertoire, improvisation, performance technique, and professional-level...',
    themeColor: 'purple',
    badgeText: 'ADVANCED',
    cardStyle: {
      bg: 'bg-white',
      border: 'border-[#F4D9FF] hover:border-[#DFA7FF]/50',
      shadow: 'shadow-sm hover:shadow-xl hover:shadow-[#F4D9FF]/30',
      badge: 'bg-[#F4D9FF]/30 text-[#DFA7FF] border-[#F4D9FF]/60',
      label: 'text-[#DFA7FF]',
      instructorIcon: 'text-[#DFA7FF]',
      pillBg: 'bg-[#F4D9FF]/20',
      iconColor: '#DFA7FF',
      price: 'text-[#DFA7FF]',
      primaryBtn: 'bg-gradient-to-r from-[#FF6FAF] to-[#DFA7FF] hover:from-[#DFA7FF] hover:to-[#FF6FAF] shadow-[#F4D9FF]/60',
      secondaryBtn: 'border-[#DFA7FF]/40 text-[#DFA7FF] hover:bg-[#F4D9FF]/20',
      cartBtn: 'border-gray-200 text-gray-400 hover:border-[#DFA7FF] hover:text-[#DFA7FF] hover:bg-[#F4D9FF]/10'
    }
  }
]

interface CourseCardProps {
  course: any
  isInCartAlready: boolean
  onBookClick: (course: any) => void
  onAddToCart: (course: any) => void
}

const CourseCard = memo(({ course, isInCartAlready, onBookClick, onAddToCart }: CourseCardProps) => {
  const style = course.cardStyle

  return (
    <div
      className={`group rounded-[24px] border-[1.5px] p-7 flex flex-col justify-between transition-transform transition-shadow duration-300 transform translate-z-0 will-change-transform hover:-translate-y-1.5 ${style.bg} ${style.border} ${style.shadow} hover:shadow-2xl`}
      style={{ transform: 'translateZ(0)' }}
    >
      <div>
        {/* Card Header: Badge & Glossy Piano Illustration */}
        <div className="flex justify-between items-start mb-6">
          <span className={`px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-wider uppercase ${style.badge}`}>
            {course.badgeText}
          </span>
          <PianoSVG color={course.themeColor as any} />
        </div>

        {/* Course Info */}
        <div className="space-y-3 mb-6">
          <p className={`text-[11px] font-extrabold tracking-widest uppercase ${style.label}`}>
            {course.category}
          </p>
          <h3 className="text-[22px] font-bold text-[#0F1E4A] leading-tight">
            {course.title}
          </h3>
          
          {/* Instructor Info */}
          <div className="flex items-center gap-2 text-sm pt-1">
            <User className={`w-4 h-4 ${style.instructorIcon}`} />
            <span className="text-[#0F1E4A] font-semibold opacity-90">{course.instructor}</span>
          </div>

          <p className="text-sm text-slate-500 leading-relaxed font-normal line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Duration & Rating Pills */}
        <div className="flex gap-3 mb-6">
          {/* Duration Box */}
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs ${style.pillBg}`}>
            <Clock className="w-3.5 h-3.5" style={{ color: style.iconColor }} />
            <span className="text-[#0F1E4A]">{course.duration}</span>
          </div>
          {/* Rating Box */}
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs ${style.pillBg}`}>
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-[#0F1E4A]">{course.rating}</span>
          </div>
        </div>
      </div>

      <div>
        {/* Course Fee Section */}
        <div className="border-t border-gray-100 pt-5 mb-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Course Fee
            </p>
            <p className={`text-2xl font-black ${style.price}`}>
              ₹{course.price.toLocaleString('en-IN')}
            </p>
          </div>
          
          {/* Fee Tag Badge */}
          <span className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider ${style.badge}`}>
            {course.level}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Primary button: Book Time Slot */}
          <button
            onClick={() => onBookClick(course)}
            className="btn-premium-base btn-premium-gradient w-full h-12 text-sm font-bold flex items-center justify-center"
          >
            Book Time Slot
          </button>

          {/* Secondary & Cart buttons row */}
          <div className="flex gap-3">
            <Link
              href={`/courses/${course.id}`}
              className="btn-premium-base btn-premium-secondary flex-1 h-12 text-xs gap-1.5"
            >
              <span>View Details</span>
              <span className="text-sm">→</span>
            </Link>

            <button
              onClick={() => onAddToCart(course)}
              className={`btn-premium-base w-12 h-12 ${
                isInCartAlready 
                  ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200' 
                  : 'btn-premium-secondary'
              }`}
              title={isInCartAlready ? 'Added to Cart' : 'Add to Cart'}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})
CourseCard.displayName = 'CourseCard'

export default function FeaturedCourses() {
  const { addItem, isInCart } = useCart()
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  
  const [showSuccess, setShowSuccess] = useState(false)
  const [booking, setBooking] = useState<any>(null)

  const handleBookClick = useCallback((course: any) => {
    setSelectedClass({
      id: course.id,
      name: course.title,
      instructor: course.instructor,
      level: course.level,
      category: 'piano'
    })
    setShowBookingModal(true)
  }, [])

  const handleAddToCart = useCallback((course: any) => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration,
      image: `/courses/${course.id}.jpg`,
      category: 'Piano'
    })
  }, [addItem])

  const handleBookingSuccess = useCallback((newBooking: any) => {
    setBooking(newBooking)
    setShowBookingModal(false)
    setShowSuccess(true)
  }, [])

  return (
    <section className="py-24 bg-gradient-to-b from-[#FAFBFF] to-[#FFFFFF] relative font-sans overflow-hidden">
      {/* Decorative subtle top accents */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-pink-100/30 rounded-br-full opacity-40"></div>
      <div className="absolute top-0 right-0 w-8 h-8 bg-blue-100/30 rounded-bl-full opacity-40"></div>

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-3xl font-bold text-[#0F1E4A]">
            Showing 3 Piano courses
          </h2>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pianoCourses.map((course) => {
            const isInCartAlready = isInCart(course.id)

            return (
              <CourseCard
                key={course.id}
                course={course}
                isInCartAlready={isInCartAlready}
                onBookClick={handleBookClick}
                onAddToCart={handleAddToCart}
              />
            )
          })}
        </div>
      </div>

      {/* Booking Calendar Modal */}
      {selectedClass && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedClass(null)
          }}
          classSchedule={selectedClass}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Booking Success Modal */}
      <BookingSuccess
        isOpen={showSuccess}
        booking={booking}
        onClose={() => {
          setShowSuccess(false)
          setBooking(null)
        }}
      />
    </section>
  )
}
