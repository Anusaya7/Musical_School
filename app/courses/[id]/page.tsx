'use client'

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/Header'
import CourseBooking from '@/components/CourseBooking'
import {
  getCourseById,
  getCoursesByCategory,
  formatCoursePrice,
  getCategoryDisplayName,
  Course,
} from '@/data/coursesData'
import { addBooking } from '@/data/bookingData'
import {
  Star,
  Clock,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  User,
  Target,
  ListChecks,
  Layers,
  GraduationCap,
  Sparkles
} from 'lucide-react'

type TabId = 'overview' | 'curriculum' | 'instructor'

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
  const gradId = `piano-detail-grad-${color}`
  const glossyId = `glossy-detail-grad-${color}`

  return (
    <div className="relative w-36 h-28 flex-shrink-0 select-none">
      <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradId} x1="20" y1="15" x2="100" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active.baseGrad[0]} />
            <stop offset="50%" stopColor={active.baseGrad[1]} />
            <stop offset="100%" stopColor={active.shadow} />
          </linearGradient>
          <linearGradient id={glossyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="72" rx="42" ry="7" fill="black" fillOpacity="0.08" />
        <path
          d="M15 48 C15 28, 40 28, 55 18 C68 8, 100 8, 108 18 C115 26, 115 56, 108 60 C98 65, 35 65, 15 58 Z"
          fill={`url(#${gradId})`}
          stroke={active.baseGrad[1]}
          strokeWidth="0.5"
        />
        <path d="M16 45 C20 28, 42 28, 55 19 C66 10, 98 10, 106 19 C111 25, 111 50, 106 54 Z" fill={`url(#${glossyId})`} />
        <path d="M48 15 L92 5 L102 18 L58 22 Z" fill={active.highlight} opacity="0.95" stroke={active.baseGrad[1]} strokeWidth="0.5" />
        <line x1="88" y1="5" x2="88" y2="20" stroke="#555" strokeWidth="2" />
        <rect x="20" y="48" width="70" height="12" rx="2" fill="white" stroke={active.baseGrad[1]} strokeWidth="1.2" />
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
        <rect x="24" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="30" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="42" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="48" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="54" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="66" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="72" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="78" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="22" y="60" width="3.5" height="13" fill={active.baseGrad[1]} />
        <rect x="84.5" y="60" width="3.5" height="13" fill={active.baseGrad[1]} />
        <rect x="53" y="61" width="3.5" height="11" fill={active.shadow} />
      </svg>
      <DoubleNote className="absolute -top-1 -right-3 opacity-60 animate-bounce" color={active.noteColor} />
      <SingleNote className="absolute top-8 -left-4 opacity-50 animate-pulse" color={active.noteColor} />
      <SingleNote className="absolute -top-4 left-12 opacity-40 animate-bounce" color={active.noteColor} />
    </div>
  )
})
PianoSVG.displayName = 'PianoSVG'

export default function CourseDetail() {
  const params = useParams()
  const router = useRouter()
  const { addItem, isInCart } = useCart()
  const [selectedTab, setSelectedTab] = useState<TabId>('overview')
  const [course, setCourse] = useState<Course | null>(null)

  const courseId = params.id as string

  useEffect(() => {
    setCourse(getCourseById(courseId) ?? null)
  }, [courseId])

  // Get dynamic course theme style properties
  const style = useMemo(() => {
    if (!course) return null
    const lvl = course.level?.toLowerCase() || ''
    if (lvl.includes('intermediate')) {
      return {
        themeColor: 'blue' as const,
        badge: 'bg-[#DCEEFF]/30 text-[#5EA8FF] border-[#DCEEFF]/60',
        pillBg: 'bg-[#DCEEFF]/20',
        iconColor: '#5EA8FF',
        priceText: 'text-[#5EA8FF]',
        btnGradient: 'from-[#5EA8FF] to-[#7EB8FF] hover:from-[#7EB8FF] hover:to-[#5EA8FF]',
        outlineBtn: 'border-[#5EA8FF]/40 text-[#5EA8FF] hover:bg-[#DCEEFF]/20',
        label: 'text-[#5EA8FF]',
        border: 'border-[#DCEEFF]',
        activeTab: 'bg-[#5EA8FF] text-white shadow-md shadow-blue-100',
        outcomeIcon: 'text-[#5EA8FF]',
        cardBg: 'bg-[#DCEEFF]/10'
      }
    }
    if (lvl.includes('advanced')) {
      return {
        themeColor: 'purple' as const,
        badge: 'bg-[#F4D9FF]/30 text-[#DFA7FF] border-[#F4D9FF]/60',
        pillBg: 'bg-[#F4D9FF]/20',
        iconColor: '#DFA7FF',
        priceText: 'text-[#DFA7FF]',
        btnGradient: 'from-[#FF6FAF] to-[#DFA7FF] hover:from-[#DFA7FF] hover:to-[#FF6FAF]',
        outlineBtn: 'border-[#DFA7FF]/40 text-[#DFA7FF] hover:bg-[#F4D9FF]/20',
        label: 'text-[#DFA7FF]',
        border: 'border-[#F4D9FF]',
        activeTab: 'bg-[#DFA7FF] text-white shadow-md shadow-purple-100',
        outcomeIcon: 'text-[#DFA7FF]',
        cardBg: 'bg-[#F4D9FF]/10'
      }
    }
    // Beginner
    return {
      themeColor: 'pink' as const,
      badge: 'bg-[#FFD6E8]/30 text-[#FF6FAF] border-[#FFD6E8]/60',
      pillBg: 'bg-[#FFD6E8]/20',
      iconColor: '#FF6FAF',
      priceText: 'text-[#FF6FAF]',
      btnGradient: 'from-[#FF6FAF] to-[#FF8EBF] hover:from-[#FF8EBF] hover:to-[#FF6FAF]',
      outlineBtn: 'border-[#FF6FAF]/40 text-[#FF6FAF] hover:bg-[#FFD6E8]/20',
      label: 'text-[#FF6FAF]',
      border: 'border-[#FFD6E8]',
      activeTab: 'bg-[#FF6FAF] text-white shadow-md shadow-pink-100',
      outcomeIcon: 'text-[#FF6FAF]',
      cardBg: 'bg-[#FFD6E8]/10'
    }
  }, [course])

  const handleAddToCart = useCallback(() => {
    if (!course) return
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration,
      image: course.image,
      category: course.category,
      rating: course.rating,
      students: course.students,
      description: course.description,
    })
  }, [course, addItem])

  if (!course || !style) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFBFF] text-[#0F1E4A]">
        <div className="text-center p-8 max-w-sm bg-white rounded-[24px] border border-gray-100 shadow-xl">
          <h1 className="mb-4 text-2xl font-bold">Course Not Found</h1>
          <p className="mb-8 text-sm text-slate-500 font-semibold">The course you are looking for does not exist.</p>
          <Link
            href="/courses"
            className="block w-full h-12 text-white text-xs font-bold rounded-[20px] bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-200 transition-all flex items-center justify-center"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    )
  }

  const relatedCourses = getCoursesByCategory(course.category).filter((c) => c.id !== course.id)

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
  ]

  return (
    <div className="min-h-screen bg-[#FAFBFF] font-sans pb-24 text-[#0F1E4A]">
      <Header />

      {/* Hero Header Section */}
      <section className={`relative overflow-hidden bg-gradient-to-b ${style.cardBg} to-[#FAFBFF] pt-28 pb-16 border-b border-gray-100/60`}>
        <div className="container relative mx-auto px-6 max-w-7xl z-10">
          <button
            onClick={() => router.push('/courses')}
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0F1E4A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </button>

          <div className="grid items-start gap-12 lg:grid-cols-5">
            {/* Left Content Column */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-wider uppercase ${style.badge}`}>
                  {course.level}
                </span>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  {getCategoryDisplayName(course.category)}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F1E4A] leading-tight">{course.title}</h1>
              <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">{course.description}</p>

              <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>{course.rating} Rating</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Course Fee</p>
                  <p className={`text-3xl font-black ${style.priceText}`}>{formatCoursePrice(course.price)}</p>
                </div>
                <div className="ml-2">
                  <PianoSVG color={style.themeColor} />
                </div>
              </div>
            </div>

            {/* Right Booking Sidebar Card */}
            <div className="lg:col-span-2 rounded-[24px] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 space-y-4">
              <h3 className="text-lg font-bold text-[#0F1E4A] flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
                Enroll & Book Class
              </h3>
              <CourseBooking
                course={{
                  id: course.id,
                  title: course.title,
                  instructor: course.instructor,
                  price: course.price,
                  category: course.category,
                }}
                onBookingComplete={(booking) => addBooking(booking)}
              />
              <button
                onClick={handleAddToCart}
                disabled={isInCart(course.id)}
                className={`w-full h-12 border-[1.5px] rounded-[20px] text-xs font-bold transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center ${
                  isInCart(course.id)
                    ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed shadow-none'
                    : style.outlineBtn
                }`}
              >
                {isInCart(course.id) ? 'Already in Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs & Details Content */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs Selector */}
            <div className="flex gap-2 rounded-[20px] border border-gray-100 bg-white p-1.5 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 rounded-xl py-3 text-xs font-bold transition-all duration-300 ${
                    selectedTab === tab.id
                      ? style.activeTab
                      : 'text-slate-400 hover:text-[#0F1E4A] hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {selectedTab === 'overview' && (
              <div className="space-y-8">
                <div className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-[#0F1E4A]">
                    <BookOpen className={`h-5 w-5 ${style.label}`} />
                    About the Course
                  </h3>
                  <p className="whitespace-pre-line leading-relaxed text-slate-500 font-medium text-sm">
                    {course.aboutCourse}
                  </p>
                </div>

                <div className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-[#0F1E4A]">
                    <Target className={`h-5 w-5 ${style.label}`} />
                    Learning Outcomes
                  </h3>
                  <ul className="space-y-3.5">
                    {course.learningOutcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 font-medium text-sm">
                        <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 text-green-500`} />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-[#0F1E4A]">
                    <ListChecks className={`h-5 w-5 ${style.label}`} />
                    Prerequisites
                  </h3>
                  <ul className="space-y-3.5">
                    {course.prerequisites.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-500 font-medium text-sm">
                        <GraduationCap className={`mt-0.5 h-4 w-4 shrink-0 text-yellow-500`} />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-[#0F1E4A]">
                    <Layers className={`h-5 w-5 ${style.label}`} />
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.topicsCovered.map((topic, i) => (
                      <span
                        key={i}
                        className={`rounded-full border border-gray-100 ${style.pillBg} px-4.5 py-2 text-xs font-bold ${style.label}`}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Curriculum */}
            {selectedTab === 'curriculum' && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 flex items-center gap-2.5 text-lg font-bold text-[#0F1E4A]">
                    <BookOpen className={`h-5 w-5 ${style.label}`} />
                    {course.level} Curriculum — {course.title}
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold">
                    A structured {course.level.toLowerCase()}-level pathway designed by{' '}
                    {course.instructor}.
                  </p>
                </div>
                
                <div className="space-y-4">
                  {course.curriculum.map((module, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:border-gray-200"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0F1E4A] text-sm">Module {index + 1}</h4>
                        <p className="mt-1 text-slate-500 font-medium text-xs md:text-sm leading-relaxed">{module}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Instructor */}
            {selectedTab === 'instructor' && (
              <div className="rounded-[24px] border border-gray-100 bg-white p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-2xl font-bold text-white shadow-md">
                    AA
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F1E4A]">Ajinkya Amrule</h3>
                    <p className="text-purple-600 font-bold text-xs">Lead Instructor · Musical School Academy</p>
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 font-semibold">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>4.9 Instructor Rating</span>
                    </div>
                  </div>
                </div>
                <p className="leading-relaxed text-slate-500 font-medium text-sm">
                  Ajinkya Amrule is the lead instructor across all academy programs, bringing over a
                  decade of performance and teaching experience. Specializing in{' '}
                  {getCategoryDisplayName(course.category).toLowerCase()} and holistic musicianship,
                  Ajinkya guides students from their first notes to professional-level mastery with
                  personalized feedback and proven methodologies.
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { value: '2,500+', label: 'Students Taught' },
                    { value: '10+', label: 'Years Experience' },
                    { value: '98%', label: 'Success Rate' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[20px] border border-gray-100 bg-[#FAFBFF] py-4 shadow-sm"
                    >
                      <p className="text-lg md:text-xl font-extrabold text-purple-600">{stat.value}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-extrabold text-[#0F1E4A] uppercase tracking-widest border-b border-gray-100 pb-3">Course Specs</h3>
              <dl className="space-y-3.5 text-xs font-semibold">
                {[
                  ['Instructor', course.instructor],
                  ['Level', course.level],
                  ['Duration', course.duration],
                  ['Rating', `${course.rating} ★`],
                  ['Students Enrolled', course.students.toLocaleString('en-IN')],
                  ['Price', formatCoursePrice(course.price)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gray-50 pb-2">
                    <dt className="text-slate-400">{label}</dt>
                    <dd className="font-bold text-[#0F1E4A]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {relatedCourses.length > 0 && (
              <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-extrabold text-[#0F1E4A] uppercase tracking-widest border-b border-gray-100 pb-3">Other Skill Levels</h3>
                <ul className="space-y-3">
                  {relatedCourses.map((related) => (
                    <li key={related.id}>
                      <Link
                        href={`/courses/${related.id}`}
                        className="block rounded-xl border border-gray-100 px-4 py-3 text-xs transition-all duration-300 hover:border-purple-200 hover:bg-[#FAFBFF]"
                      >
                        <span className="font-bold text-[#0F1E4A] block mb-1">{related.title}</span>
                        <span className="text-slate-400 font-semibold">
                          {related.level} · {formatCoursePrice(related.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}
