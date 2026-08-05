'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import CourseCard from '@/components/CourseCard'
import CourseBooking from '@/components/CourseBooking'
import { useCart } from '@/contexts/CartContext'
import { useSearchParams, useRouter } from 'next/navigation'
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

function CoursesPageContent() {
  const { addItem, isInCart } = useCart()
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category')
  const searchQuery = searchParams.get('search') || ''
  const [levelFilter, setLevelFilter] = useState<CourseLevel | 'All'>('All')
  const [allDbCourses, setAllDbCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchInput, setSearchInput] = useState(searchQuery)

  useEffect(() => {
    setSearchInput(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (category) params.set('category', category)

    const url = `/api/courses${params.toString() ? `?${params.toString()}` : ''}`
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllDbCourses(data.filter((c: any) => !c.isDisabled))
        }
      })
      .catch(err => console.error('Failed to load courses:', err))
  }, [searchQuery, category])

  const baseCourses = useMemo(() => {
    if (category) return allDbCourses.filter(c => c.category === category)
    return allDbCourses
  }, [allDbCourses, category])

  useEffect(() => {
    const result =
      levelFilter === 'All'
        ? baseCourses
        : baseCourses.filter((c) => c.level === levelFilter)
    setFilteredCourses(result)
  }, [baseCourses, levelFilter])

  const clearFilter = () => {
    setSearchInput('')
    setLevelFilter('All')
    router.push('/courses')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchInput.trim().toLowerCase())}`)
    } else {
      router.push('/courses')
    }
  }

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
    <div className="min-h-screen bg-gradient-to-b from-[#FAFBFF] to-[#FFFFFF] font-sans pb-24 text-[#0F1E4A]">
      <Header />

      <main className="container mx-auto px-6 pb-20 pt-32 max-w-7xl">
        {/* Hero Banner Card */}
        <section className="relative mb-14 overflow-hidden rounded-[24px] border border-gray-100 bg-white px-8 py-14 text-center shadow-lg shadow-gray-100/50">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(223,167,255,0.1),transparent_60%)]" />
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50/50 px-4 py-1.5 text-xs font-semibold text-purple-600">
              <Music2 className="h-3.5 w-3.5" />
              Premium Music Academy
            </div>
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-[#0F1E4A] md:text-4xl">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : category
                ? `${getCategoryDisplayName(category)} Courses`
                : 'Our Music Courses'}
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-slate-500 leading-relaxed font-medium">
              {searchQuery
                ? `Showing published courses matching "${searchQuery}".`
                : category
                ? `Master ${getCategoryDisplayName(category)} with instructor Ajinkya Amrule — structured Beginner, Intermediate, and Advanced pathways.`
                : 'Explore every instrument with structured learning paths taught by Ajinkya Amrule.'}
            </p>
            <p className="mt-3 text-xs font-semibold text-purple-600/80">
              All courses · Same expert instructor · Three levels per instrument
            </p>
          </div>
        </section>

        {/* Search & Filters Row */}
        <div className="mb-10 flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto w-full mb-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by instrument name, course title, or description..."
              className="w-full px-5 py-3.5 rounded-full bg-white border border-gray-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-5 py-2 rounded-full font-semibold text-xs hover:bg-purple-700 transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Level Filter:</span>
              {(['All', ...LEVELS] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setLevelFilter(level)}
                  className={`btn-premium-base px-5 py-2 text-xs font-bold ${
                    levelFilter === level
                      ? 'btn-premium-gradient'
                      : 'btn-premium-secondary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            {(category || searchQuery) && (
              <button
                onClick={clearFilter}
                className="btn-premium-base btn-premium-secondary px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2 self-start sm:self-auto"
              >
                <X className="h-3.5 w-3.5" />
                Clear filter / search
              </button>
            )}
          </div>
        </div>

        {(category || searchQuery) && (
          <p className="mb-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredCourses.length} {searchQuery ? `result${filteredCourses.length !== 1 ? 's' : ''} for "${searchQuery}"` : `${getCategoryDisplayName(category)} course${filteredCourses.length !== 1 ? 's' : ''}`}
            {levelFilter !== 'All' ? ` · ${levelFilter} level` : ''}
          </p>
        )}

        {filteredCourses.length === 0 ? (
          <div className="rounded-[24px] border border-gray-100 bg-white py-20 px-6 text-center shadow-sm">
            <p className="text-base text-slate-600 font-semibold mb-4">
              {searchQuery ? `No courses found for '${searchQuery}'.` : 'No courses match your filters.'}
            </p>
            <button
              onClick={clearFilter}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all"
            >
              View All Courses
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

export default function CoursesPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CoursesPageContent />
    </React.Suspense>
  )
}
