'use client'

import Header from '@/components/Header'
import CourseCard from '@/components/CourseCard'
import CourseBooking from '@/components/CourseBooking'
import { useCart } from '@/contexts/CartContext'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import {
  getAllCourses,
  getCoursesByCategory,
  getCategoryDisplayName,
  Course,
  CourseLevel,
} from '@/data/coursesData'
import { addBooking } from '@/data/bookingData'
import { Music2, Filter, X } from 'lucide-react'

const LEVELS: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced']

export default function CoursesPage() {
  const { addItem, isInCart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category')
  const [levelFilter, setLevelFilter] = useState<CourseLevel | 'All'>('All')
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])

  const baseCourses = useMemo(() => {
    if (category) return getCoursesByCategory(category)
    return getAllCourses()
  }, [category])

  useEffect(() => {
    const result =
      levelFilter === 'All'
        ? baseCourses
        : baseCourses.filter((c) => c.level === levelFilter)
    setFilteredCourses(result)
  }, [baseCourses, levelFilter])

  const clearFilter = () => router.push('/courses')

  const handleAddToCart = (course: Course) => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      instructor: course.instructor,
      image: course.image,
      level: course.level,
      duration: course.duration,
      category: course.category,
      rating: course.rating,
      students: course.students,
      description: course.description,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="container mx-auto px-4 pb-20 pt-32">
        {/* Hero */}
        <section className="relative mb-14 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-900/40 px-8 py-14 text-center shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15),transparent_60%)]" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-300">
              <Music2 className="h-4 w-4" />
              Premium Music Academy
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              {category ? `${getCategoryDisplayName(category)} Courses` : 'Our Courses'}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-300">
              {category
                ? `Master ${getCategoryDisplayName(category)} with Ajinkya Amrule — Beginner, Intermediate, and Advanced pathways.`
                : 'Explore every instrument with structured learning paths taught by Ajinkya Amrule.'}
            </p>
            <p className="mt-3 text-sm text-purple-300/80">
              All courses · Same expert instructor · Three levels per instrument
            </p>
          </div>
        </section>

        {/* Filters */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-400">Level:</span>
            {(['All', ...LEVELS] as const).map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  levelFilter === level
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25'
                    : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {category && (
            <button
              onClick={clearFilter}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-white/10 sm:self-auto"
            >
              <X className="h-4 w-4" />
              Clear category filter
            </button>
          )}
        </div>

        {category && (
          <p className="mb-6 text-center text-sm text-slate-400">
            Showing {filteredCourses.length} {getCategoryDisplayName(category)} course
            {filteredCourses.length !== 1 ? 's' : ''}
            {levelFilter !== 'All' ? ` · ${levelFilter} level` : ''}
          </p>
        )}

        {filteredCourses.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 py-20 text-center">
            <p className="text-lg text-slate-400">No courses match your filters.</p>
            <button
              onClick={() => setLevelFilter('All')}
              className="mt-4 text-purple-400 underline hover:text-purple-300"
            >
              Reset level filter
            </button>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isInCart={isInCart(course.id)}
                onAddToCart={handleAddToCart}
                showBooking
                bookingSlot={
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
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
