'use client'

import Header from '@/components/Header'
import CourseCard from '@/components/CourseCard'
import { useCart } from '@/contexts/CartContext'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { getAllCourses, getCoursesByCategory, getCategoryDisplayName, COURSE_COUNTS } from '@/data/coursesData'

export default function CoursesPage() {
  const { addItem, isInCart } = useCart()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const [filteredCourses, setFilteredCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()

  // Load courses from data
  const courses = getAllCourses()

  useEffect(() => {
    setIsLoading(true)

    const categoryCourses = category ? getCoursesByCategory(category) : courses
    const maxCount = category ? COURSE_COUNTS[category as keyof typeof COURSE_COUNTS] || categoryCourses.length : categoryCourses.length
    setFilteredCourses(categoryCourses.slice(0, maxCount))
    setIsLoading(false)
  }, [category, courses])

  const clearFilter = () => {
    window.location.href = '/courses'
  }

  const handleAddToCart = (course: any) => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      instructor: course.instructor,
      image: course.image,
      level: course.level,
      duration: course.duration
    })
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header />
        <main className="container mx-auto px-4 py-8 pt-32">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading courses...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-32">
        <div className="text-center mb-16">
          {category && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-3 bg-slate-100 border border-slate-300 rounded-full px-6 py-3">
                <span className="text-slate-800 font-semibold">
                  Showing {getCategoryDisplayName(category)} Courses ({filteredCourses.length})
                </span>
                <button
                  onClick={clearFilter}
                  className="text-slate-700 hover:text-slate-900 font-medium underline"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {category ? `${getCategoryDisplayName(category)} Courses` : 'Our Courses'}
          </h1>
          <p className="text-xl text-slate-600">
            {category 
              ? `Choose from our ${filteredCourses.length} ${getCategoryDisplayName(category)} courses taught by expert instructors`
              : 'Choose from our wide range of music courses taught by expert instructors'
            }
          </p>
        </div>

        {/* Validation Message */}
        {category && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found for this category.</p>
          </div>
        )}

        {/* Courses Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isInCart={isInCart(course.id)}
              onAddToCart={() => handleAddToCart(course)}
            />
          ))}
        </div>

        {/* Load More Button (if applicable) */}
        {category && filteredCourses.length < getCoursesByCategory(category).length && (
          <div className="text-center mt-8">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Load More Courses
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

