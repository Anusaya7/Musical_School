'use client'

import React, { memo, useTransition, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Star, Clock, User, ShoppingCart } from 'lucide-react'
import { Course } from '@/data/coursesData'

import InstrumentIllustration from '@/components/InstrumentIllustration'
interface CourseCardProps {
  course: Course
  isInCart?: boolean
  onAddToCart?: (course: Course) => void
  showBooking?: boolean
  bookingSlot?: React.ReactNode
  
  // Dashboard modes
  mode?: 'public' | 'admin' | 'instructor' | 'student'
  
  // Admin triggers
  onEdit?: (course: Course) => void
  onDelete?: (course: Course) => void
  onToggleStatus?: (course: Course) => void
  onDuplicate?: (course: Course) => void
  
  // Instructor triggers
  onManageAssignments?: (course: Course) => void
  onUploadVideos?: (course: Course) => void
  onQuizzes?: (course: Course) => void
  onAttendance?: (course: Course) => void
  onPerformance?: (course: Course) => void
  
  // Student parameters
  progress?: number
  completedLessons?: number
  totalLessons?: number
  certificateStatus?: string
  isFavorite?: boolean
  onToggleFavorite?: (course: Course) => void
  onContinueLearning?: (course: Course) => void
}

const CourseCard = memo(({
  course,
  isInCart = false,
  onAddToCart,
  showBooking = false,
  bookingSlot,
  mode = 'public',
  onEdit,
  onDelete,
  onToggleStatus,
  onDuplicate,
  onManageAssignments,
  onUploadVideos,
  onQuizzes,
  onAttendance,
  onPerformance,
  progress = 60,
  completedLessons = 14,
  totalLessons = 24,
  certificateStatus,
  isFavorite = false,
  onToggleFavorite,
  onContinueLearning,
}: CourseCardProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPending) {
      timer = setTimeout(() => {
        setShowSpinner(true)
      }, 200)
    } else {
      setShowSpinner(false)
    }
    return () => clearTimeout(timer)
  }, [isPending])

  // Determine card accent styling based on course level/title
  const getThemeConfig = (title: string, levelStr: string) => {
    const t = (title + ' ' + levelStr).toLowerCase()
    if (t.includes('intermediate')) {
      return {
        themeColor: 'blue',
        badgeText: 'INTERMEDIATE',
        border: 'border-[#DCEEFF] hover:border-[#5EA8FF]/50 dark:border-slate-800 dark:hover:border-blue-500/50',
        shadow: 'shadow-sm hover:shadow-xl hover:shadow-[#DCEEFF]/30 dark:hover:shadow-blue-900/10',
        badge: 'bg-[#DCEEFF]/30 text-[#5EA8FF] border-[#DCEEFF]/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/40',
        label: 'text-[#5EA8FF] dark:text-blue-400',
        instructorIcon: 'text-[#5EA8FF] dark:text-blue-450',
        pillBg: 'bg-[#DCEEFF]/20 dark:bg-blue-950/15',
        iconColor: '#5EA8FF',
        price: 'text-[#5EA8FF] dark:text-blue-400',
        secondaryBtn: 'border-[#5EA8FF]/40 text-[#5EA8FF] hover:bg-[#DCEEFF]/20 dark:border-blue-800/40 dark:text-blue-400 dark:hover:bg-blue-950/30',
        cartBtn: 'border-gray-200 text-gray-400 hover:border-[#5EA8FF] hover:text-[#5EA8FF] hover:bg-[#DCEEFF]/10 dark:border-slate-800 dark:hover:border-blue-500'
      }
    }
    if (t.includes('advanced')) {
      return {
        themeColor: 'purple',
        badgeText: 'ADVANCED',
        border: 'border-[#F4D9FF] hover:border-[#DFA7FF]/50 dark:border-slate-800 dark:hover:border-purple-500/50',
        shadow: 'shadow-sm hover:shadow-xl hover:shadow-[#F4D9FF]/30 dark:hover:shadow-purple-900/10',
        badge: 'bg-[#F4D9FF]/30 text-[#DFA7FF] border-[#F4D9FF]/60 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800/40',
        label: 'text-[#DFA7FF] dark:text-purple-400',
        instructorIcon: 'text-[#DFA7FF] dark:text-purple-450',
        pillBg: 'bg-[#F4D9FF]/20 dark:bg-purple-950/15',
        iconColor: '#DFA7FF',
        price: 'text-[#DFA7FF] dark:text-purple-400',
        secondaryBtn: 'border-[#DFA7FF]/40 text-[#DFA7FF] hover:bg-[#F4D9FF]/20 dark:border-purple-800/40 dark:text-purple-400 dark:hover:bg-purple-950/30',
        cartBtn: 'border-gray-200 text-gray-400 hover:border-[#DFA7FF] hover:text-[#DFA7FF] hover:bg-[#F4D9FF]/10 dark:border-slate-800 dark:hover:border-purple-500'
      }
    }
    // Beginner/Default
    return {
      themeColor: 'pink',
      badgeText: 'BEGINNER',
      border: 'border-[#FFD6E8] hover:border-[#FF6FAF]/50 dark:border-slate-800 dark:hover:border-pink-500/50',
      shadow: 'shadow-sm hover:shadow-xl hover:shadow-[#FFD6E8]/30 dark:hover:shadow-pink-900/10',
      badge: 'bg-[#FFD6E8]/30 text-[#FF6FAF] border-[#FFD6E8]/60 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-800/40',
      label: 'text-[#FF6FAF] dark:text-pink-400',
      instructorIcon: 'text-[#FF6FAF] dark:text-pink-450',
      pillBg: 'bg-[#FFD6E8]/20 dark:bg-pink-950/15',
      iconColor: '#FF6FAF',
      price: 'text-[#FF6FAF] dark:text-pink-400',
      secondaryBtn: 'border-[#FF6FAF]/40 text-[#FF6FAF] hover:bg-[#FFD6E8]/20 dark:border-pink-800/40 dark:text-pink-400 dark:hover:bg-pink-950/30',
      cartBtn: 'border-gray-200 text-gray-400 hover:border-[#FF6FAF] hover:text-[#FF6FAF] hover:bg-[#FFD6E8]/10 dark:border-slate-800 dark:hover:border-pink-500'
    }
  }

  const style = getThemeConfig(course.title, course.level)

  return (
    <article
      className={`group rounded-[24px] border-[1.5px] p-7 flex flex-col justify-between transition-all duration-300 transform translate-z-0 will-change-transform hover:-translate-y-1.5 bg-white dark:bg-slate-900 ${style.border} ${style.shadow} hover:shadow-2xl`}
      style={{ transform: 'translateZ(0)' }}
    >
      <div>
        {/* Card Header: Badge & Glossy Piano Illustration */}
        <div className="flex justify-between items-start mb-6 relative">
          <span className={`px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-wider uppercase ${style.badge}`}>
            {style.badgeText}
          </span>
          <div className="flex items-center gap-3">
            <InstrumentIllustration category={course.category} size={64} className="w-16 h-16" />
            {mode === 'student' && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onToggleFavorite?.(course)
                }}
                className={`absolute top-0 right-0 p-2 rounded-full border transition-all ${
                  isFavorite 
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50 text-red-500 shadow-sm'
                    : 'bg-white dark:bg-slate-850 border-slate-100 dark:border-slate-800 text-slate-400 hover:text-red-400'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Course Info */}
        <div className="space-y-3 mb-6">
          <p className={`text-[11px] font-extrabold tracking-widest uppercase ${style.label}`}>
            {course.category.replace('-', ' ').toUpperCase()}
          </p>
          <h3 className="text-[22px] font-bold text-[#0F1E4A] dark:text-slate-100 leading-tight">
            {course.title}
          </h3>
          
          {/* Instructor Info */}
          <div className="flex items-center gap-2 text-sm pt-1">
            <User className={`w-4 h-4 ${style.instructorIcon}`} />
            <span className="text-[#0F1E4A] dark:text-slate-350 font-semibold opacity-90">{course.instructor}</span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Duration & Rating Pills */}
        <div className="flex gap-3 mb-6">
          {/* Duration Box */}
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs ${style.pillBg}`}>
            <Clock className="w-3.5 h-3.5" style={{ color: style.iconColor }} />
            <span className="text-[#0F1E4A] dark:text-slate-300">{course.duration}</span>
          </div>
          {/* Rating Box */}
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs ${style.pillBg}`}>
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-[#0F1E4A] dark:text-slate-300">{course.rating}</span>
          </div>
        </div>
      </div>

      <div>
        {/* Course Fee Section */}
        <div className="border-t border-gray-100 dark:border-slate-800 pt-5 mb-6 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">
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

        {/* Action Buttons depending on Mode */}
        {mode === 'public' && (
          <div className="space-y-3">
            <div className="flex gap-3">
              {(() => {
                const parts = course.id.toLowerCase().split('-')
                const level = parts[parts.length - 1]
                const instrument = parts.slice(0, -1).join('-')
                return (
                  <Link
                    href={`/courses/${instrument}/${level}`}
                    onClick={(e) => {
                      if (isPending) {
                        e.preventDefault()
                        return
                      }
                      e.preventDefault()
                      startTransition(() => {
                        router.push(`/courses/${instrument}/${level}`)
                      })
                    }}
                    className={`btn-premium-base btn-premium-secondary flex-1 h-12 text-xs gap-1.5 ${isPending ? 'opacity-80 pointer-events-none' : ''}`}
                  >
                    {showSpinner && (
                      <span className="w-3.5 h-3.5 border-2 border-[#0F1E4A] border-t-transparent rounded-full animate-spin shrink-0 mr-0.5" />
                    )}
                    <span>View Details</span>
                    <span className="text-sm">→</span>
                  </Link>
                )
              })()}

              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(course)}
                  className={`btn-premium-base w-12 h-12 ${
                    isInCart 
                      ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-200' 
                      : 'btn-premium-secondary'
                  }`}
                  title={isInCart ? 'Added to Cart' : 'Add to Cart'}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {mode === 'admin' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              <button
                onClick={() => onEdit?.(course)}
                className="btn-premium-base btn-premium-secondary h-10 border-[#5EA8FF]/20 text-[#5EA8FF] hover:bg-[#DCEEFF]/10"
              >
                Edit Course
              </button>
              <button
                onClick={() => onDuplicate?.(course)}
                className="btn-premium-base btn-premium-secondary h-10"
              >
                Duplicate
              </button>
              <button
                onClick={() => onToggleStatus?.(course)}
                className={`btn-premium-base h-10 border ${
                  course.isDisabled 
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 hover:bg-green-100'
                    : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100'
                }`}
              >
                {course.isDisabled ? 'Enable' : 'Disable'}
              </button>
              <button
                onClick={() => onDelete?.(course)}
                className="btn-premium-base h-10 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
            
            {/* Admin specific stats block */}
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2">
              <span>👨‍🎓 {course.students || 0} Enrolled</span>
              <span>💰 ₹{((course.students || 0) * course.price).toLocaleString('en-IN')} Rev</span>
            </div>
          </div>
        )}

        {mode === 'instructor' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1.5 text-[9px] font-bold">
              <button
                onClick={() => onEdit?.(course)}
                className="btn-premium-base btn-premium-secondary h-8 py-0"
                title="Edit Course Specs"
              >
                Edit
              </button>
              <button
                onClick={() => onManageAssignments?.(course)}
                className="btn-premium-base btn-premium-secondary h-8 py-0"
                title="Manage Assignments"
              >
                Assign
              </button>
              <button
                onClick={() => onUploadVideos?.(course)}
                className="btn-premium-base btn-premium-secondary h-8 py-0"
                title="Upload Lessons"
              >
                Videos
              </button>
              <button
                onClick={() => onQuizzes?.(course)}
                className="btn-premium-base btn-premium-secondary h-8 py-0"
                title="Manage Quizzes"
              >
                Quizzes
              </button>
              <button
                onClick={() => onAttendance?.(course)}
                className="btn-premium-base btn-premium-secondary h-8 py-0"
                title="Attendance Logs"
              >
                Attend
              </button>
              <button
                onClick={() => onPerformance?.(course)}
                className="btn-premium-base btn-premium-secondary h-8 py-0"
                title="Performance Analytics"
              >
                Analytics
              </button>
            </div>
            
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-2">
              <span>👨‍🎓 {course.students || 0} Students</span>
              <span>{course.isDisabled ? '🚫 Draft' : '✅ Published'}</span>
            </div>
          </div>
        )}

        {mode === 'student' && (
          <div className="space-y-4 mt-2">
            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>Learning Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                <span>{completedLessons} Completed</span>
                <span>{Math.max(0, totalLessons - completedLessons)} Remaining</span>
              </div>
            </div>

            {/* Student metadata specs */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800 pt-3">
              <div>👨‍🏫 {course.instructor}</div>
              <div>⏳ {course.duration}</div>
              <div className="col-span-2 flex items-center gap-1.5 mt-1">
                🎓 Certificate: <span className="text-green-600 dark:text-green-400">
                  {certificateStatus || (course.hasCertificate ? 'Available' : 'None')}
                </span>
              </div>
            </div>

            <button
              onClick={() => onContinueLearning?.(course)}
              className="w-full h-12 flex items-center justify-center font-bold text-xs bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Continue Learning →
            </button>
          </div>
        )}
      </div>
    </article>
  )
})

CourseCard.displayName = 'CourseCard'

export default CourseCard
