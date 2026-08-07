'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/Header'
import CourseBooking from '@/components/CourseBooking'
import { getLevelDetails, getCurriculumList, CourseLevel } from '@/data/coursesData'
import {
  Star,
  Clock,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  User,
  Target,
  ListChecks,
  Award,
  Sparkles,
  ChevronDown,
  Bookmark,
  ShieldCheck,
  Check
} from 'lucide-react'

interface CourseDetailsClientProps {
  course: any
  levelsList: string[]
  instrumentSlug: string
}

export default function CourseDetailsClient({
  course,
  levelsList,
  instrumentSlug
}: CourseDetailsClientProps) {
  const router = useRouter()
  const { addItem, isInCart } = useCart()
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor'>('overview')
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({})
  const [accordionOpen, setAccordionOpen] = useState<{ [key: number]: boolean }>({ 0: true }) // Module 1 open by default

  // Get dynamic level details
  const levelDetails = useMemo(() => {
    return getLevelDetails(course.level as CourseLevel)
  }, [course.level])

  // Get curriculum list
  const curriculumList = useMemo(() => {
    return getCurriculumList(course.level as CourseLevel)
  }, [course.level])

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const toggleAccordion = (index: number) => {
    setAccordionOpen(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const handleEnrollNow = () => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      instructor: course.instructorName,
      level: course.level,
      duration: course.duration,
      image: course.image || `/courses/${course.id}.jpg`,
      category: course.instrumentSlug,
      rating: course.rating || 5.0,
      students: course.students || 120,
      description: course.description
    })
    router.push('/checkout')
  }

  const handleAddToCart = () => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      instructor: course.instructorName,
      level: course.level,
      duration: course.duration,
      image: course.image || `/courses/${course.id}.jpg`,
      category: course.instrumentSlug,
      rating: course.rating || 5.0,
      students: course.students || 120,
      description: course.description
    })
  }

  const style = useMemo(() => {
    const themes = ['pink', 'blue', 'purple']
    const themeColor = themes[Math.abs(instrumentSlug.charCodeAt(0)) % themes.length] as 'pink' | 'blue' | 'purple'

    if (themeColor === 'blue') {
      return {
        badge: 'bg-[#DCEEFF]/40 text-[#4092FF] border-[#DCEEFF]/80',
        pillBg: 'bg-[#DCEEFF]/20',
        iconColor: '#4092FF',
        priceText: 'text-[#4092FF]',
        activeTab: 'bg-[#4092FF] text-white shadow-md shadow-blue-100',
        cardBg: 'bg-[#DCEEFF]/10',
        border: 'border-[#DCEEFF]'
      }
    }
    if (themeColor === 'purple') {
      return {
        badge: 'bg-[#F4D9FF]/40 text-[#C673FF] border-[#F4D9FF]/80',
        pillBg: 'bg-[#F4D9FF]/20',
        iconColor: '#C673FF',
        priceText: 'text-[#C673FF]',
        activeTab: 'bg-[#C673FF] text-white shadow-md shadow-purple-100',
        cardBg: 'bg-[#F4D9FF]/10',
        border: 'border-[#F4D9FF]'
      }
    }
    return {
      badge: 'bg-[#FFD6E8]/40 text-[#FF4C9C] border-[#FFD6E8]/80',
      pillBg: 'bg-[#FFD6E8]/20',
      iconColor: '#FF4C9C',
      priceText: 'text-[#FF4C9C]',
      activeTab: 'bg-[#FF4C9C] text-white shadow-md shadow-pink-100',
      cardBg: 'bg-[#FFD6E8]/10',
      border: 'border-[#FFD6E8]'
    }
  }, [instrumentSlug])

  const alreadyInCart = isInCart(course.id)

  return (
    <div className="min-h-screen bg-[#FAFBFF] font-sans pb-24 text-[#0F1E4A]">
      <Header />

      {/* Course Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-b ${style.cardBg} to-[#FAFBFF] pt-28 pb-16 border-b border-gray-100/60`}>
        <div className="container relative mx-auto px-6 max-w-7xl z-10">
          <Link
            href="/courses"
            className="mb-8 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#0F1E4A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          <div className="grid items-start gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-wider uppercase ${style.badge}`}>
                  {course.level} Level
                </span>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                  {course.instrumentName} Department
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-[#0F1E4A] leading-tight">
                {course.title}
              </h1>
              <p className="text-slate-500 font-medium text-sm md:text-base leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>{course.instructorName}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>{course.rating || 5.0} Rating</span>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-100 rounded-full shadow-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{course.duration || '3 Months'}</span>
                </div>
              </div>
            </div>

            {/* Sidebar Pricing & Action Card */}
            <div className="lg:col-span-2 rounded-[28px] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/30 space-y-5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Course Tuition</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-[#0F1E4A]">₹{course.price.toLocaleString('en-IN')}</span>
                  {course.discountPrice && (
                    <span className="block text-[10px] text-slate-400 line-through">₹{course.discountPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>

              {/* Course Booking Form Widget */}
              <div className="border-t border-gray-50 pt-4">
                <h3 className="text-xs font-bold text-[#0F1E4A] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                  Request Booking Slots
                </h3>
                <CourseBooking
                  course={{
                    id: course.id,
                    title: course.title,
                    instructor: course.instructorName,
                    price: course.price,
                    category: course.instrumentSlug,
                  }}
                  onBookingComplete={() => {}}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={alreadyInCart}
                  className={`h-12 rounded-2xl text-xs font-bold transition-all duration-300 border ${
                    alreadyInCart
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-600 cursor-default'
                      : 'bg-white hover:bg-slate-50 border-gray-200 text-slate-700 hover:border-gray-300'
                  } flex items-center justify-center gap-1.5`}
                >
                  {alreadyInCart ? (
                    <>
                      <Check className="w-4 h-4" /> Added
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button
                  onClick={handleEnrollNow}
                  className="btn-premium-base btn-premium-gradient h-12 text-xs font-bold shadow-md shadow-slate-100"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Levels and Content Section */}
      <section className="container mx-auto px-6 py-16 max-w-7xl">
        <div className="w-full">
          <div className="space-y-10">
            {/* Level Selector Tabs */}
            <div className="space-y-4">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">Department Tracks</h2>
              <div className="flex gap-2 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm">
                {levelsList.map((lvl) => {
                  const isActive = lvl.toLowerCase() === course.level.toLowerCase()
                  return (
                    <Link
                      key={lvl}
                      href={`/courses/${instrumentSlug}/${lvl.toLowerCase()}`}
                      className={`flex-1 rounded-xl py-3 text-center text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? style.activeTab
                          : 'text-slate-400 hover:text-[#0F1E4A] hover:bg-gray-50'
                      }`}
                    >
                      {lvl}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className="space-y-6">
              <div className="flex overflow-x-auto gap-1 border-b border-gray-100 pb-px scrollbar-none">
                {[
                  { id: 'overview', label: 'Overview', icon: BookOpen },
                  { id: 'curriculum', label: 'Curriculum', icon: ListChecks },
                  { id: 'instructor', label: 'Instructor', icon: User }
                ].map((t) => {
                  const isActive = activeTab === t.id
                  const Icon = t.icon
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex items-center gap-1.5 px-4 py-3.5 border-b-2 text-xs font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? 'border-[#0F1E4A] text-[#0F1E4A]'
                          : 'border-transparent text-slate-450 hover:text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {t.label}
                    </button>
                  )
                })}
              </div>

              {/* Tab Contents */}
              <div className="mt-6 animate-fadeIn">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Course Overview */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                      <h3 className="text-xl font-bold text-[#0F1E4A] flex items-center gap-2 border-b border-gray-50 pb-2">
                        <BookOpen className="w-5 h-5 text-blue-500 animate-pulse" />
                        About the Course
                      </h3>
                      {course.instrumentSlug === 'piano' && course.level === 'Beginner' ? (
                        <div className="text-sm text-slate-600 font-semibold leading-relaxed space-y-4">
                          <p>Has your child been learning piano for the past six months?</p>
                          <p>
                            The <strong className="font-extrabold text-[#0F1E4A]">2nd Inversion Method Book 1</strong> course is designed to strengthen their musical foundation while introducing more advanced concepts in a structured and engaging way.
                          </p>
                          <p>
                            This course focuses on developing technical accuracy, musical expression, rhythmic understanding, and overall keyboard proficiency.
                          </p>
                          <div>
                            <p className="mb-2.5 font-extrabold text-[#0F1E4A] text-xs uppercase tracking-widest">Students will explore:</p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
                              {[
                                'Major scales',
                                'Minor scales',
                                'Chord inversions',
                                'Syncopation',
                                'Swing rhythm',
                                'Key signatures',
                                'Repertoire development'
                              ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-slate-500 font-semibold text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#4092FF] shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <p className="pt-2">while building confidence in performance and musicianship.</p>
                        </div>
                      ) : (
                        <p className="whitespace-pre-line text-sm text-slate-500 font-medium leading-relaxed">
                          {levelDetails?.about || course.aboutCourse || course.description}
                        </p>
                      )}
                    </div>

                    {/* Learning Outcomes */}
                    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                      <h3 className="text-lg font-bold text-[#0F1E4A] flex items-center gap-2 border-b border-gray-50 pb-2">
                        <Target className="w-5 h-5 text-emerald-500" />
                        Learning Outcomes
                      </h3>
                      <ul className="space-y-3">
                        {(levelDetails?.learningOutcomes || course.learningOutcomes || []).map((outcome: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-4 p-4 bg-white border border-gray-100/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
                          >
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
                              <Check className="h-3.5 w-3.5" />
                            </div>
                            <span className="text-slate-650 font-semibold text-sm leading-relaxed">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prerequisites */}
                    <div className="rounded-2xl border-l-4 border-pink-500 bg-pink-50/20 p-6 shadow-sm space-y-4 border border-gray-100/50">
                      <h3 className="text-base font-bold text-[#0F1E4A] flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-pink-500" />
                        Prerequisites
                      </h3>
                      <ul className="space-y-2.5">
                        {(levelDetails?.prerequisites || course.prerequisites || []).map((req: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-650 font-semibold text-sm">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Topics Covered Grid */}
                    <div className="space-y-4">
                      <h3 className="text-base font-bold text-[#0F1E4A] flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-blue-500" />
                        Topics Covered
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(levelDetails?.topicsCovered || course.topicsCovered || []).map((topic: string, idx: number) => {
                          const isEven = idx % 2 === 0
                          const accentBorder = isEven ? 'border-l-4 border-l-[#4092FF]' : 'border-l-4 border-l-[#FF4C9C]'
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-3.5 px-5 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${accentBorder} group text-xs font-bold text-slate-700`}
                            >
                              <div className={`w-2 h-2 rounded-full ${isEven ? 'bg-[#4092FF]' : 'bg-[#FF4C9C]'} group-hover:scale-125 transition-transform shrink-0`} />
                              <span>{topic}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-xl font-extrabold text-[#0F1E4A]">
                        {course.level === 'Beginner' && course.instrumentSlug === 'piano'
                          ? 'Beginner Curriculum — Piano Beginner'
                          : `${course.level} Curriculum — ${course.title}`}
                      </h3>
                      <p className="text-slate-500 text-sm font-semibold mt-1.5">
                        A structured {course.level.toLowerCase()}-level pathway designed by <span className="text-[#0F1E4A] font-extrabold">Ajinkya Amrule</span>.
                      </p>
                    </div>

                    <div className="space-y-3.5">
                      {(curriculumList || course.curriculumList || []).map((module: any, idx: number) => {
                        const isOpen = !!accordionOpen[idx]
                        
                        // Local module description resolver
                        const getModuleDescription = (idx: number): string => {
                          const descMap: Record<number, string> = {
                            0: "An overview of anatomy, posture, and correct playing techniques to build proper physical habits.",
                            1: "Learn music notation basics, reading treble and bass clefs, and navigating the grand staff.",
                            2: "Master major scale construction, correct finger patterns, and daily scale workouts.",
                            3: "Explore primary triad chords, root positions, and basic chord inversion transitions.",
                            4: "Develop early voice coordination, pitch matching, and basic ear training drills.",
                            5: "Understand accidentals, sharps/flats key signatures, and syncopated subdivisions.",
                            6: "Apply scale and rhythm concepts to play repertoire pieces in C, G, and F Major.",
                            7: "Learn relative natural minor scale construction, relative key pairings, and transposition rules.",
                            8: "Discover swing feel rhythm, jazz-influenced phrasing, and rhythmic interpretation.",
                            9: "Integrate all technical skills into fully polished performance repertoire pieces."
                          }
                          return descMap[idx] || "A structured lesson plan with custom exercises to develop performance proficiency."
                        }

                        return (
                          <div
                            key={idx}
                            className="border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-200"
                          >
                            <button
                              onClick={() => toggleAccordion(idx)}
                              className="w-full px-6 py-4 flex justify-between items-center text-left text-sm font-bold text-[#0F1E4A] hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="flex items-center gap-3.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-black text-white shadow-sm shadow-blue-100">
                                  {idx + 1}
                                </div>
                                <span className="font-extrabold text-[#0F1E4A] text-sm">{module.moduleName}</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isOpen && (
                              <div className="px-6 pb-5 pt-3 border-t border-slate-50 text-slate-500 text-xs md:text-sm font-medium leading-relaxed space-y-3 bg-slate-50/20 animate-fadeIn">
                                <p className="text-slate-550 text-xs font-semibold leading-relaxed">
                                  {getModuleDescription(idx)}
                                </p>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider pt-1 border-t border-gray-100/50">
                                  Lessons & Practice Topics
                                </div>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {module.topics.map((t: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#4092FF] shrink-0" />
                                      {t}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4092FF] to-[#FF4C9C] flex items-center justify-center text-white text-2xl font-black shadow-md border-2 border-white shrink-0 aspect-square">
                        AA
                      </div>
                      <div className="text-center sm:text-left space-y-1">
                        <h4 className="text-lg font-black text-[#0F1E4A]">Ajinkya Amrule</h4>
                        <p className="text-xs font-extrabold text-slate-400">Lead Instructor · Musical School Academy</p>
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1.5 text-xs text-slate-500 font-bold">
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" /> 4.9 Instructor Rating
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                      <div className="space-y-2">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Biography</h5>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                          Ajinkya Amrule is the lead instructor across all academy programs, bringing over a decade of performance and teaching experience.
                          <br /><br />
                          Specializing in piano and holistic musicianship, Ajinkya guides students from their first notes to professional-level mastery with personalized feedback and proven methodologies.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Statistics</h5>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-50/50 border border-gray-100/80 rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 shadow-sm cursor-default">
                            <div className="text-xl md:text-2xl font-black text-[#0F1E4A]">2,500+</div>
                            <div className="text-[10px] md:text-xs font-extrabold text-slate-400 mt-1 uppercase tracking-wider">Students Taught</div>
                          </div>
                          <div className="bg-slate-50/50 border border-gray-100/80 rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 shadow-sm cursor-default">
                            <div className="text-xl md:text-2xl font-black text-[#0F1E4A]">10+</div>
                            <div className="text-[10px] md:text-xs font-extrabold text-slate-400 mt-1 uppercase tracking-wider">Years Experience</div>
                          </div>
                          <div className="bg-slate-50/50 border border-gray-100/80 rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 shadow-sm cursor-default">
                            <div className="text-xl md:text-2xl font-black text-[#0F1E4A]">98%</div>
                            <div className="text-[10px] md:text-xs font-extrabold text-slate-400 mt-1 uppercase tracking-wider">Success Rate</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest">Certificates & Accolades</h5>
                        <div className="flex flex-wrap gap-2">
                          {['Trinity College London Certified', 'Associated Board of the Royal Schools of Music (ABRSM)'].map((c, i) => (
                            <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-[#DCEEFF]/20 border border-[#DCEEFF]/40 text-[#4092FF] text-[10px] font-bold rounded-lg">
                              <Award className="w-3 h-3" />
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="space-y-6 pt-8 border-t border-gray-100/60">
              <h2 className="text-xl font-extrabold text-[#0F1E4A]">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "What is the class frequency?", a: "Classes are held twice a week with flexible booking slots available in your student panel." },
                  { q: "Can I skip directly to intermediate level?", a: "Yes, if you already have prior experience, you can enroll directly in the Intermediate or Advanced classes." },
                  { q: "Is a course completion certificate provided?", a: "Yes, a secure downloadable PDF completion certificate is issued after completing all assignments." }
                ].map((item, idx) => (
                  <div key={idx} className="border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4 flex justify-between items-center text-left text-sm font-bold text-[#0F1E4A] hover:bg-slate-50/50"
                    >
                      <span>{item.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${faqOpen[idx] ? 'rotate-180' : ''}`} />
                    </button>
                    {faqOpen[idx] && (
                      <div className="px-6 pb-4 text-xs md:text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-2.5">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
