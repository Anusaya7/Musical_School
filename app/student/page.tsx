'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart, Course } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  Calendar,
  Play,
  Award,
  Target,
  User,
  Music,
  Video,
  Star,
  AlertCircle,
  Bell,
  LayoutDashboard,
  Heart,
  MessageSquare,
  Search,
  Menu,
  X,
  PlayCircle,
  LogOut
} from 'lucide-react'

interface PracticeSession {
  id: string
  instrument: string
  date: string
  duration: number
  exercises: number
  completed: number
  level: string
}

interface UpcomingClass {
  id: string
  title: string
  instructor: string
  instrument: string
  date: string
  time: string
  duration: string
  type: 'live' | 'recorded'
  batchTiming: string
  link?: string
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  instruments: string[]
  level: string
  goals: string
  joinDate: string
}

interface Holiday {
  id: string
  date: string
  reason: string
  isRecurringWeekly: boolean
  dayOfWeek?: number
}

interface Workshop {
  id: string
  title: string
  instructor: string
  date: string
  time: string
  price: number
  description: string
}

interface RecordedSession {
  id: string
  title: string
  description: string
  url: string
  instrument: string
}

export default function StudentDashboard() {
  const { theme } = useTheme()
  const router = useRouter()
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'workshops' | 'recorded' | 'profile'>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    bio: 'Passionate music learner exploring piano and guitar.',
    instruments: ['Piano', 'Guitar'],
    level: 'Beginner',
    goals: 'Learn fundamental chords and scales',
    joinDate: '2026-01-15'
  })

  // Database Driven States
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])

  // Mock static data
  const practiceSessions: PracticeSession[] = [
    { id: '1', instrument: 'piano', date: '2026-06-16', duration: 45, exercises: 5, completed: 4, level: 'beginner' },
    { id: '2', instrument: 'guitar', date: '2026-06-15', duration: 30, exercises: 3, completed: 3, level: 'beginner' }
  ]

  // Load backend database records on mount
  const loadStudentDashboardData = async () => {
    setLoading(true)
    try {
      const [bookingsRes, holidaysRes, workshopsRes, videosRes, coursesRes] = await Promise.all([
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/holidays').then(r => r.json()),
        fetch('/api/workshops').then(r => r.json()),
        fetch('/api/recorded-sessions').then(r => r.json()),
        fetch('/api/courses').then(r => r.json())
      ])

      // 1. Process Bookings to show as Upcoming Classes
      if (Array.isArray(bookingsRes)) {
        const myBookings = bookingsRes.filter(b => b.studentEmail.toLowerCase() === profileData.email.toLowerCase())
        const mapped = myBookings.map((b: any) => ({
          id: b.id,
          title: b.courseName,
          instructor: b.instructor,
          instrument: b.courseId?.split('-')[0] || 'piano',
          date: b.date,
          time: b.timeSlot,
          duration: '1 hour',
          type: 'live' as const,
          batchTiming: b.batchTiming,
          link: '#'
        }))
        setUpcomingClasses(mapped)

        // Set enrolled courses based on bookings
        if (Array.isArray(coursesRes)) {
          const coursesMap = new Map()
          myBookings.forEach((b: any) => {
            const courseObj = coursesRes.find(c => c.id === b.courseId)
            if (courseObj) {
              coursesMap.set(courseObj.id, courseObj)
            }
          });
          setEnrolledCourses(Array.from(coursesMap.values()))
        }
      }

      if (Array.isArray(holidaysRes)) setHolidays(holidaysRes)
      if (Array.isArray(workshopsRes)) setWorkshops(workshopsRes)
      if (Array.isArray(videosRes)) setRecordedSessions(videosRes)
      
    } catch (error) {
      console.error("Failed to load student dashboard", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudentDashboardData()
  }, [profileData.email])

  // Get active menu list
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'workshops', label: 'Workshops', icon: Calendar },
    { id: 'recorded', label: 'Recorded Sessions', icon: Video },
    { id: 'profile', label: 'My Profile', icon: User }
  ]

  const getInstrumentIcon = (instrument: string) => {
    return <Music className="w-5 h-5" />
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className={`rounded-2xl p-8 bg-gradient-to-r from-purple-700 to-indigo-800 text-white shadow-md`}>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profileData.firstName}! 👋</h1>
        <p className="text-lg opacity-90">Manage your batch timings, view notices, and join live streams below.</p>
      </div>

      {/* Holiday Notices Section */}
      <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-300 dark:border-red-900 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          Holiday Announcements & Schedule Notices
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Static monday holiday display */}
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900">
            <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Weekly Standard holiday</h4>
            <p className="text-xs text-gray-500 mt-1">Every Monday</p>
            <p className="text-sm text-red-700 dark:text-red-400 font-semibold mt-2">No regular classes are conducted on Monday.</p>
          </div>

          {/* Dynamic database holiday display */}
          {holidays.filter(h => !h.isRecurringWeekly || h.dayOfWeek !== 1).map(h => (
            <div key={h.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900">
              <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">Custom Scheduled Holiday</h4>
              <p className="text-xs text-gray-500 mt-1">{h.isRecurringWeekly ? 'Weekly Recurring' : `Date: ${h.date}`}</p>
              <p className="text-sm text-red-700 dark:text-red-400 font-semibold mt-2">{h.reason}</p>
            </div>
          ))}

          {holidays.length <= 1 && (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-red-200 dark:border-red-900 flex items-center justify-center">
              <p className="text-xs text-gray-500">No other scheduled holidays marked at this time.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrolled Courses & Selected Batch Timing */}
        <div className={`lg:col-span-2 rounded-2xl p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg space-y-4`}>
          <h3 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>My Enrolled Courses</h3>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-gray-500">You haven't booked any courses yet.</p>
              <Link href="/courses" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.map(course => {
                // Find matching booking to display batch timing
                const booking = upcomingClasses.find(c => c.title === course.title)
                return (
                  <div key={course.id} className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-md text-gray-900 dark:text-white">{course.title}</h4>
                        <p className="text-xs text-gray-500">Instructor: {course.instructor}</p>
                      </div>
                      
                      {booking ? (
                        <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-bold px-3 py-1 rounded-full uppercase">
                          {booking.batchTiming} Batch
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                          Awaiting Schedule
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span>Duration: {course.duration}</span>
                      {booking && (
                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                          Timings: {booking.batchTiming === 'morning' ? '4:00 AM – 12:00 PM' : '3:00 PM – 9:00 PM'}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming Classes */}
        <div className={`rounded-2xl p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg space-y-4`}>
          <h3 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Upcoming Booked Classes</h3>
          
          <div className="space-y-4">
            {upcomingClasses.map((classItem) => (
              <div key={classItem.id} className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              } space-y-2`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{classItem.title}</h4>
                    <p className="text-xs text-gray-500">{classItem.instructor}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {classItem.batchTiming}
                  </span>
                </div>
                
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium space-y-1">
                  <p>📅 Date: {classItem.date}</p>
                  <p>⏰ Time Slot: {classItem.time}</p>
                </div>
              </div>
            ))}

            {upcomingClasses.length === 0 && (
              <p className="text-center text-xs text-gray-500 py-6">No upcoming classes booked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900/95 border-b border-gray-800' 
          : 'bg-white/95 border-b border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Student Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">JD</div>
                <span className={`hidden md:block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {profileData.firstName} {profileData.lastName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-20 bottom-0 w-64 transition-transform duration-300 z-40 ${
          theme === 'dark' ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any)
                  setMobileMenuOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : theme === 'dark' 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Exit Dashboard</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 lg:ml-64 p-8 min-h-[calc(100vh-5rem)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}

              {activeTab === 'courses' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border shadow-sm space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Booked Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map(course => (
                      <div key={course.id} className="p-4 border rounded-xl flex gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
                          {getInstrumentIcon(course.category)}
                        </div>
                        <div>
                          <h4 className="font-bold text-md dark:text-white">{course.title}</h4>
                          <p className="text-xs text-gray-500">Level: {course.level} | Instructor: {course.instructor}</p>
                          <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-2">Duration: {course.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'workshops' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border shadow-sm space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Special Seminars & Workshops</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workshops.map(w => (
                      <div key={w.id} className="p-5 border rounded-2xl bg-gray-50 dark:bg-gray-700/30 space-y-3">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{w.title}</h3>
                        <p className="text-xs text-gray-500">Instructor: {w.instructor}</p>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-300">
                          <span>📅 {w.date}</span>
                          <span>⏰ {w.time}</span>
                        </div>
                        <p className="text-sm font-bold text-purple-600 dark:text-purple-400">Fee: ₹{w.price.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{w.description}</p>
                      </div>
                    ))}

                    {workshops.length === 0 && (
                      <p className="text-xs text-gray-500">No upcoming workshops listed.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'recorded' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border shadow-sm space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recorded Lessons Directory</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recordedSessions.map(v => (
                      <div key={v.id} className="border rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                        <div className="aspect-video">
                          <iframe
                            src={v.url}
                            title={v.title}
                            className="w-full h-full"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-4 space-y-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-bold text-md text-gray-800 dark:text-white">{v.title}</h4>
                            <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                              {v.instrument}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{v.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border shadow-sm max-w-2xl space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Student Profile</h2>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase">First Name</span>
                      <p className="font-bold text-gray-800 dark:text-white">{profileData.firstName}</p>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase">Last Name</span>
                      <p className="font-bold text-gray-800 dark:text-white">{profileData.lastName}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-xs font-bold text-gray-500 uppercase">Email</span>
                      <p className="font-semibold text-gray-800 dark:text-white">{profileData.email}</p>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase">Phone</span>
                      <p className="font-semibold text-gray-800 dark:text-white">{profileData.phone}</p>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-500 uppercase">Level</span>
                      <p className="font-semibold text-gray-800 dark:text-white">{profileData.level}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
