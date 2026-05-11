'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import MusicBackground from '@/components/MusicBackground'
import MusicSparkle from '@/components/MusicSparkle'
import CourseBooking from '@/components/CourseBooking'
import { getAllCourses, Course } from '@/data/coursesData'
import { addBooking, generateBookingId } from '@/data/bookingData'
import { 
  Star, 
  Clock, 
  Users, 
  Play, 
  BookOpen, 
  Award, 
  CheckCircle,
  ArrowLeft,
  ShoppingCart,
  Calendar,
  User
} from 'lucide-react'


export default function CourseDetail() {
  const params = useParams()
  const router = useRouter()
  const { addItem, isInCart } = useCart()
  const { theme } = useTheme()
  const [selectedTab, setSelectedTab] = useState('overview')
  const [courseData, setCourseData] = useState<any>(null)

  const courseId = params.id as string

  // Load course data
  useEffect(() => {
    const courses = getAllCourses()
    const foundCourse = courses.find(c => c.id === courseId.toString())
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
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
      <MusicBackground />
      <MusicSparkle />
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </button>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  course.level === 'Advanced' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {course.level}
                </span>
                <span className="text-white/80">{course.category}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{course.title}</h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">{course.description}</p>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-white/80">({course.students} students)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{course.students} enrolled</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold">{course.price}</div>
                <button
                  onClick={() => addItem(course)}
                  disabled={isInCart(course.id)}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    isInCart(course.id)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-purple-600 hover:bg-gray-100'
                  }`}
                >
                  {isInCart(course.id) ? 'In Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <div className="h-96 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-12 h-12" />
                    </div>
                    <p className="text-xl font-semibold">Course Preview</p>
                  </div>
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
                    <p className="text-gray-600 leading-relaxed mb-6">{course.description}</p>
                    <p className="text-gray-600 leading-relaxed">
                      This comprehensive course is designed to take you from your current skill level to mastery. 
                      With expert instruction from {course.instructor}, you'll receive personalized feedback and guidance 
                      throughout your learning journey.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">What You'll Learn</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {course.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4">Course Highlights</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <BookOpen className="w-8 h-8 text-purple-600" />
                        </div>
                        <h4 className="font-semibold mb-2">Comprehensive</h4>
                        <p className="text-gray-600 text-sm">Complete curriculum covering all essential topics</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Award className="w-8 h-8 text-blue-600" />
                        </div>
                        <h4 className="font-semibold mb-2">Certificate</h4>
                        <p className="text-gray-600 text-sm">Receive certificate upon completion</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-8 h-8 text-green-600" />
                        </div>
                        <h4 className="font-semibold mb-2">Community</h4>
                        <p className="text-gray-600 text-sm">Join our active student community</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'curriculum' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold mb-4">Course Curriculum</h3>
                  <div className="space-y-4">
                    {[
                      'Introduction and Getting Started',
                      'Basic Techniques and Fundamentals',
                      'Intermediate Skills and Concepts',
                      'Advanced Techniques and Applications',
                      'Performance and Practice',
                      'Final Project and Assessment'
                    ].map((module, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold">{index + 1}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold">Module {index + 1}: {module}</h4>
                              <p className="text-gray-600 text-sm">Approx. {Math.floor(Math.random() * 3) + 2} hours of content</p>
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
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                      isInCart(course.id)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
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
