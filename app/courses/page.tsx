'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import CourseBooking from '@/components/CourseBooking'
import { getAllCourses, getCoursesByCategory, getCategoryDisplayName, COURSE_COUNTS } from '@/data/coursesData'
import { addBooking } from '@/data/bookingData'
import { Star, ShoppingCart, Check } from 'lucide-react'

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
    
    if (category) {
      // Filter courses by category and limit to exact count
      const categoryCourses = getCoursesByCategory(category)
      const maxCount = COURSE_COUNTS[category as keyof typeof COURSE_COUNTS] || categoryCourses.length
      const limitedCourses = categoryCourses.slice(0, maxCount)
      setFilteredCourses(limitedCourses)
    } else {
      setFilteredCourses(courses)
    }
    
    setIsLoading(false)
  }, [category])

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
              <div className="inline-flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-full px-6 py-3">
                <span className="text-blue-700 font-semibold">
                  Showing {getCategoryDisplayName(category)} Courses ({filteredCourses.length})
                </span>
                <button
                  onClick={clearFilter}
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}
          <h1 className="text-4xl font-bold text-primary mb-4">
            {category ? `${getCategoryDisplayName(category)} Courses` : 'Our Courses'}
          </h1>
          <p className="text-xl text-gray-600">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/api/placeholder/24/24" alt={course.instructor} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-gray-600">{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{course.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Level</p>
                    <p className="font-semibold">{course.level}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-semibold">{course.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Students</p>
                    <p className="font-semibold">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-semibold">Rs.{course.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <CourseBooking 
                    course={{
                      id: course.id,
                      title: course.title,
                      instructor: course.instructor,
                      price: course.price,
                      category: course.category
                    }}
                    onBookingComplete={(booking) => {
                      addBooking(booking)
                    }}
                  />
                  <div className="flex gap-2">
                    <Link 
                      href={`/courses/${course.id}`}
                      className="flex-1 py-2 px-4 rounded-lg font-semibold text-center bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(course)}
                      disabled={isInCart(course.id)}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                        isInCart(course.id)
                          ? 'bg-green-100 text-green-600 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isInCart(course.id) ? (
                        <>
                          <Check className="w-4 h-4 inline mr-1" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 inline mr-1" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

