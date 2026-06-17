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
              {category ? `${getCategoryDisplayName(category)} Courses` : 'Our Music Courses'}
            </h1>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-slate-500 leading-relaxed font-medium">
              {category
                ? `Master ${getCategoryDisplayName(category)} with instructor Ajinkya Amrule — structured Beginner, Intermediate, and Advanced pathways.`
                : 'Explore every instrument with structured learning paths taught by Ajinkya Amrule.'}
            </p>
            <p className="mt-3 text-xs font-semibold text-purple-600/80">
              All courses · Same expert instructor · Three levels per instrument
            </p>
          </div>
        </section>

        {/* Filters */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Level Filter:</span>
            {(['All', ...LEVELS] as const).map((level) => (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 ${
                  levelFilter === level
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-200'
                    : 'border border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {category && (
            <button
              onClick={clearFilter}
              className="inline-flex items-center gap-2 self-start rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 transition-colors hover:bg-gray-50 hover:border-gray-300 sm:self-auto"
            >
              <X className="h-3.5 w-3.5" />
              Clear category filter
            </button>
          )}
        </div>

        {category && (
          <p className="mb-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredCourses.length} {getCategoryDisplayName(category)} course
            {filteredCourses.length !== 1 ? 's' : ''}
            {levelFilter !== 'All' ? ` · ${levelFilter} level` : ''}
          </p>
        )}

        {filteredCourses.length === 0 ? (
          <div className="rounded-[24px] border border-gray-100 bg-white py-20 text-center shadow-sm">
            <p className="text-sm text-slate-500 font-medium">No courses match your filters.</p>
            <button
              onClick={() => setLevelFilter('All')}
              className="mt-4 text-xs font-bold text-purple-600 underline hover:text-purple-500"
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
