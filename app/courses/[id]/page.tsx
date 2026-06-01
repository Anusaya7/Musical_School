'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/Header'
import MusicBackground from '@/components/MusicBackground'
import MusicSparkle from '@/components/MusicSparkle'
import CourseBooking from '@/components/CourseBooking'
import {
  getCourseById,
  getCoursesByCategory,
  formatCoursePrice,
  getCategoryDisplayName,
  getCategoryGradient,
  getLevelBadgeClass,
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
} from 'lucide-react'

type TabId = 'overview' | 'curriculum' | 'instructor'

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

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-white">Course Not Found</h1>
          <p className="mb-8 text-slate-400">The course you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/courses"
            className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-500"
          >
            Browse All Courses
          </Link>
        </div>
      </div>
    )
  }

  const relatedCourses = getCoursesByCategory(course.category).filter((c) => c.id !== course.id)
  const gradient = getCategoryGradient(course.category)

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
  ]

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MusicBackground />
      <MusicSparkle />
      <Header />

      {/* Hero */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${gradient} pt-28 pb-16`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="container relative mx-auto px-4">
          <button
            onClick={() => router.push('/courses')}
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </button>

          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase ${getLevelBadgeClass(course.level)}`}
                >
                  {course.level}
                </span>
                <span className="text-sm text-white/70">
                  {getCategoryDisplayName(course.category)}
                </span>
              </div>

              <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">{course.title}</h1>
              <p className="mb-6 text-lg leading-relaxed text-white/90">{course.description}</p>

              <div className="mb-6 flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{course.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <p className="text-3xl font-bold text-amber-300">{formatCoursePrice(course.price)}</p>
            </div>

            {/* Sidebar card in hero on desktop */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
              <h3 className="mb-4 text-lg font-semibold text-white">Enroll Now</h3>
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
                onClick={() =>
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
                }
                disabled={isInCart(course.id)}
                className={`mt-4 w-full rounded-xl py-3 font-semibold transition-all ${
                  isInCart(course.id)
                    ? 'cursor-not-allowed bg-white/10 text-slate-400'
                    : 'bg-white text-purple-700 hover:bg-purple-50'
                }`}
              >
                {isInCart(course.id) ? 'Already in Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-8 flex gap-1 rounded-xl border border-white/10 bg-slate-900/80 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    selectedTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {selectedTab === 'overview' && (
              <div className="space-y-10">
                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                    <BookOpen className="h-5 w-5 text-purple-400" />
                    About the Course
                  </h3>
                  <p className="whitespace-pre-line leading-relaxed text-slate-300">
                    {course.aboutCourse}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                    <Target className="h-5 w-5 text-purple-400" />
                    Learning Outcomes
                  </h3>
                  <ul className="space-y-3">
                    {course.learningOutcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                    <ListChecks className="h-5 w-5 text-purple-400" />
                    Prerequisites
                  </h3>
                  <ul className="space-y-3">
                    {course.prerequisites.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300">
                        <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                    <Layers className="h-5 w-5 text-purple-400" />
                    Topics Covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.topicsCovered.map((topic, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-200"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'curriculum' && (
              <div className="space-y-4">
                <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-white">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  {course.level} Curriculum — {course.title}
                </h3>
                <p className="mb-6 text-slate-400">
                  A structured {course.level.toLowerCase()}-level pathway designed by{' '}
                  {course.instructor}.
                </p>
                {course.curriculum.map((module, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-xl border border-white/10 bg-slate-900/50 p-5 transition-colors hover:border-purple-500/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Module {index + 1}</h4>
                      <p className="mt-1 text-slate-400">{module}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === 'instructor' && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-8">
                <div className="mb-6 flex items-center gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-3xl font-bold text-white">
                    AA
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Ajinkya Amrule</h3>
                    <p className="text-purple-300">Lead Instructor · Musical School Academy</p>
                    <div className="mt-2 flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm text-slate-300">4.9 Instructor Rating</span>
                    </div>
                  </div>
                </div>
                <p className="leading-relaxed text-slate-300">
                  Ajinkya Amrule is the lead instructor across all academy programs, bringing over a
                  decade of performance and teaching experience. Specializing in{' '}
                  {getCategoryDisplayName(course.category).toLowerCase()} and holistic musicianship,
                  Ajinkya guides students from their first notes to professional-level mastery with
                  personalized feedback and proven methodologies.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                  {[
                    { value: '2,500+', label: 'Students Taught' },
                    { value: '10+', label: 'Years Experience' },
                    { value: '98%', label: 'Success Rate' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/10 bg-white/5 py-4"
                    >
                      <p className="text-2xl font-bold text-purple-300">{stat.value}</p>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
              <h3 className="mb-4 text-lg font-bold text-white">Course Details</h3>
              <dl className="space-y-4 text-sm">
                {[
                  ['Instructor', course.instructor],
                  ['Level', course.level],
                  ['Duration', course.duration],
                  ['Rating', `${course.rating} ★`],
                  ['Students', course.students.toLocaleString('en-IN')],
                  ['Price', formatCoursePrice(course.price)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-white/5 pb-3">
                    <dt className="text-slate-400">{label}</dt>
                    <dd className="font-medium text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {relatedCourses.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
                <h3 className="mb-4 text-lg font-bold text-white">Other Levels</h3>
                <ul className="space-y-3">
                  {relatedCourses.map((related) => (
                    <li key={related.id}>
                      <Link
                        href={`/courses/${related.id}`}
                        className="block rounded-lg border border-white/10 px-4 py-3 text-sm transition-colors hover:border-purple-500/40 hover:bg-purple-500/10"
                      >
                        <span className="font-medium text-white">{related.title}</span>
                        <span className="mt-1 block text-slate-400">
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
