'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/Header'
import CourseBooking from '@/components/CourseBooking'
import { getCategoryDisplayName, getCourseById } from '@/data/coursesData'
import { addBooking } from '@/data/bookingData'
import { 
  Star, 
  Clock, 
  Users, 
  Play, 
  BookOpen, 
  Award, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react'


export default function CourseDetail() {
  const params = useParams()
  const router = useRouter()
  const { addItem, isInCart } = useCart()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [courseData, setCourseData] = useState<any>(null)

  const courseId = params.id as string

  // Load course data
  useEffect(() => {
    const foundCourse = getCourseById(courseId)
    if (foundCourse) {
      setCourseData(foundCourse)
    }
  }, [courseId])

  
  const course = courseData

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/')}
            className="btn-premium-base btn-premium-gradient px-6 py-3 text-sm font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      )
    }

    return stars
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </button>
          
          <div className="grid gap-10 rounded-[2rem] border border-slate-200 bg-white p-10 shadow-sm md:grid-cols-2 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  course.level === 'Beginner' ? 'bg-violet-100 text-violet-700' :
                  course.level === 'Intermediate' ? 'bg-indigo-100 text-indigo-700' :
                  course.level === 'Advanced' ? 'bg-sky-100 text-sky-700' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {course.level}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{getCategoryDisplayName(course.category)}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">{course.title}</h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">{course.description}</p>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-slate-900">{course.rating}</span>
                  <span className="text-slate-500">({course.students} students)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-600">{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-slate-500" />
                  <span className="text-slate-600">{course.students} enrolled</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="text-4xl font-bold">₹{course.price.toLocaleString('en-IN')}</div>
                <button
                  onClick={() => addItem(course)}
                  disabled={isInCart(course.id)}
                  className={`btn-premium-base px-8 py-3 text-sm font-semibold ${
                    isInCart(course.id)
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-none'
                      : 'btn-premium-secondary'
                  }`}
                >
                  {isInCart(course.id) ? 'In Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 shadow-sm">
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-violet-600 text-white shadow-lg">
                    <Play className="w-10 h-10" />
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Course Preview</p>
                  <p className="text-sm leading-relaxed text-slate-500">Explore level-specific lessons, skill-building exercises, and performance pathways.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Tabs */}
              <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
                {['overview', 'curriculum', 'instructor'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedTab === tab
                        ? 'bg-white text-purple-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {selectedTab === 'overview' && (
                <div className="space-y-8">
                      <div>
                    <h3 className="text-2xl font-bold mb-4">About This Course</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{course.details.about}</p>
                    <p className="text-gray-600 leading-relaxed">
                      With expert instruction from {course.instructor}, this structured course is designed to develop strong technique, musical expression, and confident performance at every level.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
                      <h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
                      <ul className="space-y-3 text-slate-700">
                        {course.details.prerequisites.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-violet-600" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-6">
                      <h3 className="text-xl font-semibold mb-4">Learning Outcomes</h3>
                      <ul className="space-y-3 text-slate-700">
                        {course.details.outcomes.map((item, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-slate-900" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Topics Covered</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {course.details.topics.map((topic, index) => (
                        <div key={index} className="rounded-3xl border border-slate-200 bg-white p-4 text-slate-700">
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'curriculum' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-4">Course Curriculum</h3>
                  <div className="space-y-4">
                    {course.details.curriculum.map((module, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Module {index + 1}: {module}</h4>
                              <p className="text-gray-600 text-sm">A focused lesson for {course.level.toLowerCase()} students.</p>
                            </div>
                          </div>
                          <Play className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'instructor' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-4">Your Instructor</h3>
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">AA</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{course.instructor}</h4>
                        <p className="text-gray-600 mb-2">Professional Music Educator</p>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm">4.9 Instructor Rating</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {course.instructor} is a distinguished music educator with over 10 years of experience in teaching 
                      and performance. Specializing in {course.category.toLowerCase()}, they have helped hundreds of students 
                      achieve their musical goals through personalized instruction and proven methodologies.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">500+</div>
                        <p className="text-gray-600 text-sm">Students Taught</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">10+</div>
                        <p className="text-gray-600 text-sm">Years Experience</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 mb-1">98%</div>
                        <p className="text-gray-600 text-sm">Success Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Course Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level</span>
                    <span className="font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students</span>
                    <span className="font-medium">{course.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(course.rating)}
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certificate</span>
                    <span className="font-medium">Yes</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">Price</h3>
                <div className="text-3xl font-bold text-purple-600 mb-4">{course.price}</div>
                <div className="space-y-3">
                  <CourseBooking 
                    course={{
                      id: course.id.toString(),
                      title: course.title,
                      instructor: course.instructor,
                      price: Number(course.price),
                      category: course.category
                    }}
                    onBookingComplete={(booking) => {
                      addBooking(booking)
                    }}
                  />
                  <button
                    onClick={() => addItem(course)}
                    disabled={isInCart(course.id)}
                    className={`btn-premium-base w-full px-6 py-3 text-sm font-semibold ${
                      isInCart(course.id)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-none shadow-none'
                        : 'btn-premium-secondary'
                    }`}
                  >
                    {isInCart(course.id) ? 'In Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
  )
}
