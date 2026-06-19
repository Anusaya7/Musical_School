'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart, Course } from '@/contexts/CartContext'
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
  LogOut,
  Settings,
  CheckCircle,
  ChevronRight,
  Flame,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Award as AwardIcon,
  BookOpen as BookIcon,
  Tv,
  ExternalLink,
  ShieldCheck
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
  const { addItem, isInCart } = useCart()
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'workshops' | 'recorded' | 'schedule' | 'learning' | 'achievements' | 'profile' | 'settings'>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleNotification = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  // Load backend database records on mount
  const loadStudentDashboardData = async () => {
    setLoading(true)
    try {
      const [bookingsRes, holidaysRes, workshopsRes, videosRes, coursesRes] = await Promise.all([
        fetch('/api/bookings').then(r => r.json()).catch(() => []),
        fetch('/api/holidays').then(r => r.json()).catch(() => []),
        fetch('/api/workshops').then(r => r.json()).catch(() => []),
        fetch('/api/recorded-sessions').then(r => r.json()).catch(() => []),
        fetch('/api/courses').then(r => r.json()).catch(() => [])
      ])

      // 1. Process Bookings to show as Upcoming Classes
      if (Array.isArray(bookingsRes) && bookingsRes.length > 0) {
        const myBookings = bookingsRes.filter(b => b.studentEmail?.toLowerCase() === profileData.email.toLowerCase())
        const mapped = myBookings.map((b: any) => ({
          id: b.id,
          title: b.courseName,
          instructor: b.instructor || 'Senior Music Instructor',
          instrument: b.courseId?.split('-')[0] || 'piano',
          date: b.date,
          time: b.timeSlot,
          duration: '1 hour',
          type: 'live' as const,
          batchTiming: b.batchTiming || 'evening',
          link: b.link || '#'
        }))
        setUpcomingClasses(mapped)

        // Set enrolled courses based on bookings
        if (Array.isArray(coursesRes) && coursesRes.length > 0) {
          const coursesMap = new Map()
          myBookings.forEach((b: any) => {
            const courseObj = coursesRes.find(c => c.id === b.courseId)
            if (courseObj) {
              coursesMap.set(courseObj.id, courseObj)
            }
          })
          setEnrolledCourses(Array.from(coursesMap.values()))
        }
      } else {
        // Fallback Mock Courses if DB empty
        setEnrolledCourses([
          { id: 'piano-101', title: 'Piano Fundamentals', instructor: 'Sarah Johnson', level: 'beginner', duration: '8 weeks', price: 2999, image: '/api/placeholder/300/200', rating: 4.9, category: 'Piano' },
          { id: 'guitar-101', title: 'Guitar Mastery', instructor: 'Mike Wilson', level: 'beginner', duration: '6 weeks', price: 2499, image: '/api/placeholder/300/200', rating: 4.7, category: 'Guitar' }
        ])
        setUpcomingClasses([
          { id: '1', title: 'Live Piano Session', instructor: 'Sarah Johnson', instrument: 'piano', date: 'June 20, 2026', time: '3:00 PM', duration: '1 hour', type: 'live', batchTiming: 'evening', link: '#' },
          { id: '2', title: 'Guitar Workshop Jam', instructor: 'Mike Wilson', instrument: 'guitar', date: 'June 21, 2026', time: '4:00 PM', duration: '45 mins', type: 'live', batchTiming: 'afternoon', link: '#' }
        ])
      }

      if (Array.isArray(holidaysRes)) setHolidays(holidaysRes)
      if (Array.isArray(workshopsRes) && workshopsRes.length > 0) {
        setWorkshops(workshopsRes)
      } else {
        // Fallback Mock Workshops
        setWorkshops([
          { id: 'w1', title: 'Vocal Performance masterclass', instructor: 'Dr. Sarah Chen', date: 'June 25, 2026', time: '11:00 AM', price: 1500, description: 'Learn breath control, performance delivery, and pitch correction guidelines.' },
          { id: 'w2', title: 'Piano Techniques & Posture', instructor: 'Ajinkya Amrule', date: 'June 28, 2026', time: '2:00 PM', price: 1200, description: 'Correct hand positioning and chord transitions for classical songs.' }
        ])
      }

      if (Array.isArray(videosRes) && videosRes.length > 0) {
        setRecordedSessions(videosRes)
      } else {
        // Fallback Mock Videos
        setRecordedSessions([
          { id: 'v1', title: 'Basic Chord Progressions', description: 'Understanding I-V-vi-IV chords in C Major key.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', instrument: 'Piano' },
          { id: 'v2', title: 'Fingerstyle Guitar Patterns', description: 'Introduction to Travis picking and baseline flows.', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', instrument: 'Guitar' }
        ])
      }
      
    } catch (error) {
      console.error("Failed to load student dashboard", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudentDashboardData()
  }, [profileData.email])

  const handleRegisterWorkshop = (workshop: Workshop) => {
    addItem({
      id: workshop.id,
      title: workshop.title,
      price: workshop.price,
      instructor: workshop.instructor,
      level: 'General',
      duration: '2 hours'
    })
    handleNotification(`${workshop.title} added to checkout cart!`)
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', emoji: '🏠' },
    { id: 'courses', label: 'My Courses', emoji: '📚' },
    { id: 'workshops', label: 'Workshops', emoji: '🎤' },
    { id: 'recorded', label: 'Recorded Sessions', emoji: '🎥' },
    { id: 'schedule', label: 'Class Schedule', emoji: '📅' },
    { id: 'learning', label: 'Learning Progress', emoji: '📊' },
    { id: 'achievements', label: 'Achievements', emoji: '🏆' },
    { id: 'profile', label: 'My Profile', emoji: '👤' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ]

  const getCourseImage = (category: string) => {
    const term = category?.toLowerCase() || ''
    if (term.includes('piano') || term.includes('v1')) {
      return 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=400&auto=format&fit=crop'
    }
    if (term.includes('guitar') || term.includes('v2')) {
      return 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=400&auto=format&fit=crop'
    }
    return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop'
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[24px] p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative space-y-2.5 max-w-xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Welcome Back, {profileData.firstName}! 👋</h1>
          <p className="text-sm sm:text-md opacity-90 leading-relaxed font-medium">
            Continue your musical journey and track your learning progress.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => setActiveTab('courses')}
              className="bg-white text-[#5EA8FF] px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-md hover:scale-[1.02] active:scale-100 transition-all shadow-sm flex items-center space-x-2"
            >
              <span>Continue Learning →</span>
            </button>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0 w-full lg:w-auto relative">
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] p-4 text-center min-w-[120px] transition-all hover:bg-white/25">
            <span className="text-xl select-none mb-1 block">📚</span>
            <span className="block text-xl font-extrabold">{enrolledCourses.length}</span>
            <span className="text-[9px] uppercase font-extrabold tracking-wider opacity-90 block mt-0.5">Courses Enrolled</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] p-4 text-center min-w-[120px] transition-all hover:bg-white/25">
            <span className="text-xl select-none mb-1 block">🎥</span>
            <span className="block text-xl font-extrabold">{recordedSessions.length + 10}</span>
            <span className="text-[9px] uppercase font-extrabold tracking-wider opacity-90 block mt-0.5">Recorded Lessons</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] p-4 text-center min-w-[120px] transition-all hover:bg-white/25">
            <span className="text-xl select-none mb-1 block">🏆</span>
            <span className="block text-xl font-extrabold">2</span>
            <span className="text-[9px] uppercase font-extrabold tracking-wider opacity-90 block mt-0.5">Certificates</span>
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] p-4 text-center min-w-[120px] transition-all hover:bg-white/25">
            <span className="text-xl select-none mb-1 block">⭐</span>
            <span className="block text-xl font-extrabold">92%</span>
            <span className="text-[9px] uppercase font-extrabold tracking-wider opacity-90 block mt-0.5">Learning Score</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DCEEFF]/50 flex items-center justify-center text-xl shrink-0 select-none">
            📚
          </div>
          <div>
            <span className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Enrolled Courses</span>
            <span className="block text-xl font-extrabold text-[#0F1E4A] mt-0.5">{enrolledCourses.length || 4}</span>
          </div>
        </div>

        <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD6E8]/50 flex items-center justify-center text-xl shrink-0 select-none">
            🎥
          </div>
          <div>
            <span className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Recorded Sessions</span>
            <span className="block text-xl font-extrabold text-[#0F1E4A] mt-0.5">25</span>
          </div>
        </div>

        <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#DCEEFF]/50 flex items-center justify-center text-xl shrink-0 select-none">
            🏆
          </div>
          <div>
            <span className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Certificates Earned</span>
            <span className="block text-xl font-extrabold text-[#0F1E4A] mt-0.5">2</span>
          </div>
        </div>

        <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD6E8]/50 flex items-center justify-center text-xl shrink-0 select-none">
            ⭐
          </div>
          <div>
            <span className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Attendance Rate</span>
            <span className="block text-xl font-extrabold text-[#0F1E4A] mt-0.5">96%</span>
          </div>
        </div>
      </div>

      {/* Holiday Announcements Section */}
      <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-md text-[#0F1E4A] flex items-center gap-2">
          <span>📢</span> Holiday Announcements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1 - Weekly Holiday */}
          <div className="p-5 bg-[#DCEEFF]/60 border-2 border-[#FFD6E8] rounded-[24px] relative overflow-hidden shadow-sm hover:scale-[1.01] transition-transform">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FFD6E8]/40 rounded-full blur-sm"></div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xl">📅</span>
                <h4 className="font-extrabold text-xs text-[#0F1E4A] uppercase tracking-wider mt-2">Weekly Holiday</h4>
                <p className="text-sm text-[#FF6FAF] font-black mt-1">Every Monday</p>
              </div>
              <span className="bg-[#FF6FAF]/10 text-[#FF6FAF] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Closed</span>
            </div>
            <p className="text-xs text-slate-600 mt-3 font-medium">No regular classes conducted. Virtual practice rooms remain open.</p>
          </div>

          {/* Card 2 - Scheduled Holidays */}
          {holidays.length > 0 ? (
            holidays.slice(0, 1).map(h => (
              <div key={h.id} className="p-5 bg-[#DCEEFF]/60 border-2 border-[#FFD6E8] rounded-[24px] relative overflow-hidden shadow-sm hover:scale-[1.01] transition-transform">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FFD6E8]/40 rounded-full blur-sm"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xl">🎉</span>
                    <h4 className="font-extrabold text-xs text-[#0F1E4A] uppercase tracking-wider mt-2">Scheduled Holiday</h4>
                    <p className="text-sm text-[#5EA8FF] font-black mt-1">{h.date}</p>
                  </div>
                  <span className="bg-[#5EA8FF]/10 text-[#5EA8FF] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Public Holiday</span>
                </div>
                <p className="text-xs text-slate-600 mt-3 font-medium">{h.reason}</p>
              </div>
            ))
          ) : (
            <div className="p-5 bg-[#DCEEFF]/60 border-2 border-[#FFD6E8] rounded-[24px] relative overflow-hidden shadow-sm hover:scale-[1.01] transition-transform">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#FFD6E8]/40 rounded-full blur-sm"></div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xl">🎵</span>
                  <h4 className="font-extrabold text-xs text-[#0F1E4A] uppercase tracking-wider mt-2">Practice Challenge</h4>
                  <p className="text-sm text-[#5EA8FF] font-black mt-1">Weekend Jam Session</p>
                </div>
                <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
              </div>
              <p className="text-xs text-slate-600 mt-3 font-medium">Record and submit your weekly guitar/piano scale progressions by Sunday midnight.</p>
            </div>
          )}
        </div>
      </div>

      {/* My Courses Section */}
      <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-[#DCEEFF] mb-6">
          <div>
            <h3 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
              <span>📚</span> My Enrolled Courses
            </h3>
            <p className="text-xs text-slate-400 mt-1">Track your active courses and daily tasks</p>
          </div>
          <button 
            onClick={() => setActiveTab('courses')}
            className="text-xs font-bold text-[#5EA8FF] hover:text-[#FF6FAF] transition-colors"
          >
            View All Courses →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course, idx) => {
            const progress = idx === 0 ? 75 : 45
            const duration = course.duration || '8 weeks'
            const courseImg = getCourseImage(course.category || course.title)
            return (
              <div 
                key={course.id || idx} 
                className="bg-white border-2 border-[#DCEEFF] rounded-[24px] overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Course Image */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img 
                    src={courseImg} 
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#0F1E4A] border border-[#DCEEFF]">
                    {course.category || 'Music'}
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-md text-[#0F1E4A] leading-tight hover:text-[#5EA8FF] transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">Instructor: {course.instructor}</p>
                  </div>

                  {/* Progress Bar & Info */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-[#0F1E4A]">
                      <span>Progress</span>
                      <span className="text-[#5EA8FF]">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-[#DCEEFF]/50">
                      <div 
                        className="bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-1">
                      <span>⏱️ {duration}</span>
                      <span>Level: {course.level || 'Beginner'}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('recorded')}
                    className="w-full bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:scale-[1.02] active:scale-100 text-white font-extrabold py-3 rounded-[16px] text-xs shadow-md transition-all text-center flex items-center justify-center space-x-2"
                  >
                    <span>Continue Learning</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modern Schedule Widget */}
      <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
            <span>📅</span> Class Schedule & Events
          </h3>
          <p className="text-xs text-slate-400 mt-1">Don't miss out on live learning opportunities with top mentors</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Today's Classes */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-[#0F1E4A] border-b-2 border-[#5EA8FF]/30 pb-2 flex items-center justify-between">
              <span>Today's Classes</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            </h4>
            <div className="space-y-3">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.slice(0, 1).map((cls) => (
                  <div key={cls.id} className="p-4 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[20px] space-y-3 hover:border-[#5EA8FF] transition-all">
                    <div>
                      <h5 className="font-bold text-xs text-[#0F1E4A]">{cls.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Instructor: {cls.instructor}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-[#DCEEFF] pt-2">
                      <span>🕒 {cls.time}</span>
                      <span>Batch: {cls.batchTiming}</span>
                    </div>
                    <button 
                      onClick={() => handleNotification(`Redirecting to class: ${cls.title}`)}
                      className="w-full bg-[#5EA8FF] text-white py-2 rounded-xl text-[10px] font-bold hover:scale-[1.02] active:scale-100 transition-all shadow-sm"
                    >
                      Join Class
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-[20px] text-center">
                  <p className="text-[11px] text-slate-400">No classes scheduled today.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tomorrow's Classes */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-[#0F1E4A] border-b-2 border-[#FF6FAF]/30 pb-2">
              Tomorrow's Classes
            </h4>
            <div className="space-y-3">
              {upcomingClasses.length > 1 ? (
                upcomingClasses.slice(1, 2).map((cls) => (
                  <div key={cls.id} className="p-4 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[20px] space-y-3 hover:border-[#FF6FAF] transition-all">
                    <div>
                      <h5 className="font-bold text-xs text-[#0F1E4A]">{cls.title}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5">Instructor: {cls.instructor}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-[#DCEEFF] pt-2">
                      <span>🕒 {cls.time}</span>
                      <span>Batch: {cls.batchTiming}</span>
                    </div>
                    <button 
                      onClick={() => handleNotification(`Class starts tomorrow at ${cls.time}`)}
                      className="w-full bg-slate-200 text-slate-600 py-2 rounded-xl text-[10px] font-bold cursor-not-allowed"
                    >
                      Upcoming Tomorrow
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[20px] space-y-3">
                  <div>
                    <h5 className="font-bold text-xs text-[#0F1E4A]">Guitar Mastery Session</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Instructor: Mike Wilson</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-[#DCEEFF] pt-2">
                    <span>🕒 4:00 PM</span>
                    <span>Batch: Afternoon</span>
                  </div>
                  <button 
                    onClick={() => handleNotification('Class starts tomorrow at 4:00 PM')}
                    className="w-full bg-[#DCEEFF] text-[#5EA8FF] py-2 rounded-xl text-[10px] font-bold hover:scale-[1.02] active:scale-100 transition-all"
                  >
                    Upcoming Tomorrow
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Workshops */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-sm text-[#0F1E4A] border-b-2 border-purple-300 pb-2">
              Upcoming Workshops
            </h4>
            <div className="space-y-3">
              {workshops.slice(0, 1).map((w) => (
                <div key={w.id} className="p-4 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[20px] space-y-3 hover:border-purple-400 transition-all">
                  <div>
                    <h5 className="font-bold text-xs text-[#0F1E4A]">{w.title}</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">Host: {w.instructor}</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-[#DCEEFF] pt-2">
                    <span>📅 {w.date}</span>
                    <span>🕒 {w.time}</span>
                  </div>
                  <button 
                    onClick={() => handleRegisterWorkshop(w)}
                    className="w-full bg-gradient-to-r from-purple-500 to-[#FF6FAF] text-white py-2 rounded-xl text-[10px] font-bold hover:scale-[1.02] active:scale-100 transition-all shadow-sm"
                  >
                    Register Now
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Recorded Sessions Section */}
      <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-[#DCEEFF]">
          <div>
            <h3 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
              <span>🎥</span> Recent Recordings
            </h3>
            <p className="text-xs text-slate-400 mt-1">Catch up on sessions you missed or want to review</p>
          </div>
          <button 
            onClick={() => setActiveTab('recorded')}
            className="text-xs font-bold text-[#5EA8FF] hover:text-[#FF6FAF] transition-colors"
          >
            Watch All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recordedSessions.slice(0, 2).map((rec, idx) => {
            const courseImg = getCourseImage(rec.instrument)
            return (
              <div 
                key={rec.id || idx} 
                className="bg-white border-2 border-[#DCEEFF] rounded-[24px] overflow-hidden shadow-sm group hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Video Thumbnail with Play Button Overlay */}
                <div className="h-44 w-full relative overflow-hidden bg-black flex items-center justify-center">
                  <img 
                    src={courseImg} 
                    alt={rec.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-905/20 group-hover:bg-slate-955/40 transition-colors duration-300"></div>
                  {/* Play Button Overlay */}
                  <button 
                    onClick={() => {
                      setActiveTab('recorded')
                      handleNotification(`Playing: ${rec.title}`)
                    }}
                    className="absolute w-12 h-12 rounded-full bg-white/95 text-[#5EA8FF] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-10"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-extrabold uppercase text-[#FF6FAF] tracking-wider">{rec.instrument}</span>
                      <span className="bg-[#DCEEFF] text-[#5EA8FF] text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">Continue Watching</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-[#0F1E4A] leading-snug">{rec.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Learning Progress svg rings & stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Completion Ring */}
        <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Course Completion</span>
            <h4 className="text-xl font-extrabold text-[#0F1E4A]">75%</h4>
            <span className="text-[10px] text-[#5EA8FF] font-semibold">Good pace</span>
          </div>
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#5EA8FF]" strokeDasharray="75, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">75%</div>
          </div>
        </div>

        {/* Practice Hours */}
        <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Practice Hours</span>
            <h4 className="text-xl font-extrabold text-[#0F1E4A]">156 Hrs</h4>
            <span className="text-[10px] text-[#FF6FAF] font-semibold">+24 hrs this week</span>
          </div>
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-[#FF6FAF]" strokeDasharray="80, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">80%</div>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Attendance Rate</span>
            <h4 className="text-xl font-extrabold text-[#0F1E4A]">96%</h4>
            <span className="text-[10px] text-green-500 font-semibold">Excellent</span>
          </div>
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-green-500" strokeDasharray="96, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">96%</div>
          </div>
        </div>

        {/* Learning Score */}
        <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Performance Score</span>
            <h4 className="text-xl font-extrabold text-[#0F1E4A]">92%</h4>
            <span className="text-[10px] text-purple-600 font-semibold">Active learner</span>
          </div>
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-purple-500" strokeDasharray="92, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">92%</div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
        <div>
          <h3 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
            <span>🏆</span> Achievements
          </h3>
          <p className="text-xs text-slate-400 mt-1">Unlock badges as you complete courses and workshops</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Badge 1 */}
          <div className="p-[1.5px] bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[20px] shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-white/90 backdrop-blur-md rounded-[18.5px] p-5 text-center flex flex-col items-center justify-between h-full space-y-3">
              <span className="text-3xl select-none">🏆</span>
              <div>
                <h4 className="font-extrabold text-xs text-[#0F1E4A]">First Course Completed</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Awarded on completing Piano 101 theory basics.</p>
              </div>
              <span className="bg-[#DCEEFF] text-[#5EA8FF] text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">Unlocked</span>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="p-[1.5px] bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[20px] shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-white/90 backdrop-blur-md rounded-[18.5px] p-5 text-center flex flex-col items-center justify-between h-full space-y-3">
              <span className="text-3xl select-none">⭐</span>
              <div>
                <h4 className="font-extrabold text-xs text-[#0F1E4A]">Perfect Attendance</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-1">96% session presence achieved over 3 months.</p>
              </div>
              <span className="bg-[#DCEEFF] text-[#5EA8FF] text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">Unlocked</span>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="p-[1.5px] bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[20px] shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-white/90 backdrop-blur-md rounded-[18.5px] p-5 text-center flex flex-col items-center justify-between h-full space-y-3">
              <span className="text-3xl select-none">🎵</span>
              <div>
                <h4 className="font-extrabold text-xs text-[#0F1E4A]">Piano Beginner Certified</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Finger dexterity assessment completed with grade A.</p>
              </div>
              <span className="bg-[#DCEEFF] text-[#5EA8FF] text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase">Unlocked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-4">
        <div>
          <h3 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
            <span>🔔</span> Latest Actions
          </h3>
          <p className="text-xs text-slate-400 mt-1">Review your latest actions and notifications</p>
        </div>

        <div className="divide-y divide-[#DCEEFF]/50">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <span className="text-xl">✅</span>
              <div>
                <h5 className="font-bold text-xs text-[#0F1E4A]">Lesson Completed</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Finished "Basic Chord Progressions" theory lecture</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-[#5EA8FF] bg-[#DCEEFF] px-2 py-0.5 rounded-full">2 hrs ago</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🎤</span>
              <div>
                <h5 className="font-bold text-xs text-[#0F1E4A]">Workshop Joined</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Registered for Dr. Sarah Chen's Vocal masterclass</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-[#FF6FAF] bg-[#FFD6E8] px-2 py-0.5 rounded-full">1 day ago</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <span className="text-xl">📝</span>
              <div>
                <h5 className="font-bold text-xs text-[#0F1E4A]">Assignment Submitted</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Uploaded Practice Record for "C Major Scale Scales"</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">3 days ago</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🏆</span>
              <div>
                <h5 className="font-bold text-xs text-[#0F1E4A]">Certificate Earned</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Acquired "Music Theory Basics Level 1" certificate</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">1 week ago</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white border-2 border-[#DCEEFF] rounded-[24px] p-6 shadow-sm">
        <h3 className="font-extrabold text-md text-[#0F1E4A] pb-3 border-b border-[#DCEEFF] mb-4 flex items-center gap-2">
          <span>⚡</span> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button 
            onClick={() => setActiveTab('courses')}
            className="p-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white border-2 border-[#2563EB] rounded-[16px] text-xs font-extrabold shadow-sm hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 transition-all text-center"
          >
            📚 Browse Courses
          </button>
          <button 
            onClick={() => setActiveTab('workshops')}
            className="p-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white border-2 border-[#2563EB] rounded-[16px] text-xs font-extrabold shadow-sm hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 transition-all text-center"
          >
            🎤 Join Workshop
          </button>
          <button 
            onClick={() => setActiveTab('recorded')}
            className="p-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white border-2 border-[#2563EB] rounded-[16px] text-xs font-extrabold shadow-sm hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 transition-all text-center"
          >
            🎥 Watch Recordings
          </button>
          <button 
            onClick={() => setActiveTab('schedule')}
            className="p-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white border-2 border-[#2563EB] rounded-[16px] text-xs font-extrabold shadow-sm hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 transition-all text-center"
          >
            📅 Book Class
          </button>
          <button 
            onClick={() => handleNotification('Message compose opened for Ajinkya Amrule!')}
            className="p-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white border-2 border-[#2563EB] rounded-[16px] text-xs font-extrabold shadow-sm hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 transition-all text-center col-span-2 sm:col-span-1"
          >
            💬 Contact Instructor
          </button>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[24px] p-8 shadow-md text-white text-center space-y-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none"></div>
        <h3 className="text-2xl font-black">Start Your Musical Journey Today</h3>
        <p className="text-xs opacity-95 max-w-lg mx-auto font-medium">
          Join 10,000+ Students Mastering Music. Learn piano, guitar, and vocals from Trinity College Guildhall verified educators.
        </p>
        <div className="flex justify-center space-x-3.5 pt-2">
          <button 
            onClick={() => handleNotification('Demo booked successfully!')}
            className="bg-white text-[#5EA8FF] hover:bg-slate-50 hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200"
          >
            Book Free Demo
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className="bg-[#0F1E4A] hover:bg-[#0F1E4A]/90 hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all duration-200"
          >
            Explore Courses
          </button>
        </div>
      </div>

      {/* Footer Redesign */}
      <footer className="pt-8 border-t border-[#DCEEFF] grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-500 text-xs">
        <div className="space-y-2">
          <h4 className="font-extrabold text-[#0F1E4A]">🎵 2nd Inversion</h4>
          <p className="leading-relaxed">AI-powered music school featuring smart schedule bookings and interactive practice sessions.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-extrabold text-[#0F1E4A]">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link href="/courses" className="hover:text-[#5EA8FF]">Browse All Courses</Link></li>
            <li><button onClick={() => setActiveTab('workshops')} className="hover:text-[#5EA8FF]">Upcoming Seminars</button></li>
            <li><button onClick={() => setActiveTab('profile')} className="hover:text-[#5EA8FF]">Student Profile</button></li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-extrabold text-[#0F1E4A]">Top Courses</h4>
          <ul className="space-y-1">
            <li>Piano Fundamentals</li>
            <li>Guitar Mastery</li>
            <li>Music Theory</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-extrabold text-[#0F1E4A]">Contact Details</h4>
          <p>📧 support@2ndinversion.com</p>
          <p>📞 +91 98765 43210</p>
          <div className="flex space-x-2 pt-2">
            <button className="p-1.5 bg-[#DCEEFF] rounded-full text-[#5EA8FF] hover:bg-[#5EA8FF] hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </button>
            <button className="p-1.5 bg-[#DCEEFF] rounded-full text-[#5EA8FF] hover:bg-[#5EA8FF] hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="9.7 15 9.7 9 14.3 12 9.7 15"/></svg>
            </button>
            <button className="p-1.5 bg-[#DCEEFF] rounded-full text-[#5EA8FF] hover:bg-[#5EA8FF] hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </button>
            <button className="p-1.5 bg-[#DCEEFF] rounded-full text-[#5EA8FF] hover:bg-[#5EA8FF] hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </button>
          </div>
        </div>
      </footer>

    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#0F1E4A] flex flex-col md:flex-row antialiased font-sans">
      
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <div 
        className={`${
          mobileMenuOpen 
            ? 'fixed inset-y-0 left-0 w-80 z-40 bg-white border-r border-[#DCEEFF] flex flex-col transition-transform duration-300 translate-x-0'
            : 'hidden md:flex w-72 bg-white border-r border-[#DCEEFF] flex flex-col shrink-0 z-30'
        }`}
      >
        <div className="p-6 border-b border-[#DCEEFF] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🎵</span>
            <div>
              <h2 className="font-extrabold text-[#0F1E4A] text-sm leading-tight">2nd Inversion</h2>
              <p className="text-[10px] text-[#5EA8FF] font-extrabold uppercase tracking-wider">Musical School</p>
            </div>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile card */}
        <div className="p-5">
          <div className="p-[2px] bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[24px] shadow-sm hover:shadow-md transition-all duration-300">
            <div className="bg-white/95 backdrop-blur-md rounded-[22px] p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#DCEEFF] to-[#FFD6E8] opacity-20 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105"></div>
              <div className="flex items-center space-x-3.5 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white text-sm font-extrabold shadow-inner shrink-0">
                  JD
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight text-[#0F1E4A]">{profileData.firstName} {profileData.lastName}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Music Student</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#DCEEFF]/50 text-[10px] text-slate-500 font-bold">
                <span className="bg-[#FFD6E8] text-[#FF6FAF] px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider">🟢 Active Learner</span>
                <span className="text-[#5EA8FF] font-extrabold uppercase">Online</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any)
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-[16px] transition-all duration-200 group text-left ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#DCEEFF]/60 to-[#FAFBFF] text-[#0F1E4A] border-l-4 border-[#5EA8FF] font-extrabold shadow-sm'
                  : 'text-slate-600 hover:bg-[#FAFBFF] hover:text-[#5EA8FF]'
              }`}
            >
              <span className="text-lg transition-transform duration-200 group-hover:scale-110 select-none">{item.emoji}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Exit link */}
        <div className="p-4 border-t border-[#DCEEFF]">
          <Link
            href="/"
            className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-[16px] text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="text-lg select-none">🚪</span>
            <span className="text-xs font-bold">Exit Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#DCEEFF] px-6 py-4 sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-[#DCEEFF] rounded-lg transition-colors text-[#0F1E4A]"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-[#0F1E4A] tracking-tight capitalize">
                {activeTab === 'dashboard' ? 'Student Dashboard' : activeTab.replace('-', ' ')}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">2nd Inversion Music Academy</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-48 sm:w-64 hidden sm:block">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search lessons, workshops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none"
              />
            </div>
            
            <button className="p-2 hover:bg-[#DCEEFF] rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-[#0F1E4A]" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF6FAF] rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white text-xs font-bold">
                JD
              </div>
              <span className="hidden lg:block text-xs font-bold">{profileData.firstName} {profileData.lastName}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-6 space-y-6">
          
          {/* Notification Alert */}
          {showNotification && (
            <div className="fixed top-6 right-6 bg-white border border-[#DCEEFF] text-[#0F1E4A] px-5 py-4 rounded-[20px] shadow-lg z-50 flex items-center space-x-3 animate-slide-in">
              <div className="p-1.5 bg-[#DCEEFF] rounded-full">
                <CheckCircle className="w-5 h-5 text-[#5EA8FF]" />
              </div>
              <div>
                <p className="text-sm font-bold">LMS Notice</p>
                <p className="text-xs text-slate-500">{notificationMessage}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5EA8FF]"></div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}

              {/* MY COURSES TAB */}
              {activeTab === 'courses' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>📚</span> My Enrolled Courses
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Manage, play video tutorials, and track batch assignments.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((course, idx) => {
                      const progress = idx === 0 ? 75 : 45
                      const courseImg = getCourseImage(course.category || course.title)
                      return (
                        <div key={course.id || idx} className="border-2 border-[#DCEEFF] bg-[#FAFBFF] rounded-[24px] overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                          <div className="h-40 w-full relative bg-slate-100">
                            <img src={courseImg} alt={course.title} className="w-full h-full object-cover" />
                            <span className="absolute top-3 right-3 text-[10px] bg-green-100 text-green-800 border border-green-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                              Active
                            </span>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                              <h4 className="font-extrabold text-sm text-[#0F1E4A] mb-1 leading-snug">{course.title}</h4>
                              <p className="text-xs text-slate-500">Instructor: {course.instructor}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-[#DCEEFF]/50">
                                <div className="bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] h-full rounded-full" style={{ width: `${progress}%` }}></div>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                <span>Progress: {progress}%</span>
                                <span>Level: {course.level || 'Beginner'}</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => setActiveTab('recorded')}
                              className="w-full bg-[#5EA8FF] hover:bg-[#2563EB] text-white py-2.5 rounded-xl font-bold text-xs hover:-translate-y-0.5 transition-all shadow-sm"
                            >
                              Continue Learning
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* WORKSHOPS TAB */}
              {activeTab === 'workshops' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>🎤</span> Special Music Workshops
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Book live interaction sessions, Q&As, and masterclasses.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {workshops.map((w) => {
                      const courseImg = getCourseImage(w.title)
                      return (
                        <div key={w.id} className="border-2 border-[#DCEEFF] bg-[#FAFBFF] rounded-[24px] overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                          <div className="h-32 w-full relative bg-slate-100">
                            <img src={courseImg} alt={w.title} className="w-full h-full object-cover" />
                            <span className="absolute top-3 right-3 text-[10px] bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                              Workshop
                            </span>
                          </div>
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-1">
                              <h3 className="font-extrabold text-sm text-[#0F1E4A]">{w.title}</h3>
                              <p className="text-xs text-slate-500">Instructor: {w.instructor}</p>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 pt-1.5 border-t border-[#DCEEFF]">{w.description}</p>
                            </div>
                            <div className="space-y-3 pt-2">
                              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                <span>📅 {w.date}</span>
                                <span>⏰ {w.time}</span>
                              </div>
                              <p className="text-xs font-black text-[#FF6FAF]">Fee: ₹{w.price.toLocaleString('en-IN')}</p>
                              <button 
                                onClick={() => handleRegisterWorkshop(w)}
                                className="w-full bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white py-2.5 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-100 shadow-sm transition-all border-2 border-[#2563EB]"
                              >
                                Register for Workshop
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* RECORDED LESSONS TAB */}
              {activeTab === 'recorded' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>🎥</span> Recorded Practice Directory
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Access lecture videos, scale guides, and backing audios.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recordedSessions.map((rec) => {
                      return (
                        <div key={rec.id} className="border-2 border-[#DCEEFF] bg-[#FAFBFF] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="aspect-video bg-black relative">
                            <iframe src={rec.url} title={rec.title} className="w-full h-full" allowFullScreen></iframe>
                          </div>
                          <div className="p-5 space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-extrabold text-sm text-[#0F1E4A]">{rec.title}</h4>
                              <span className="bg-[#DCEEFF] text-[#5EA8FF] font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase shrink-0">
                                {rec.instrument}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{rec.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* CLASS SCHEDULE CALENDAR */}
              {activeTab === 'schedule' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>📅</span> Class Schedule
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Check class dates, batch timings, and scheduled recurring holidays.</p>
                  </div>
                  <div className="space-y-4">
                    {upcomingClasses.map((cls) => (
                      <div key={cls.id} className="p-5 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#5EA8FF] transition-colors">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-[#0F1E4A]">{cls.title}</h4>
                          <p className="text-xs text-slate-500 font-medium">Instructor: {cls.instructor} • Instrument: {cls.instrument}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">Timings: {cls.time} ({cls.duration})</p>
                        </div>
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                          <span className="text-[10px] bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full uppercase shrink-0">
                            {cls.date}
                          </span>
                          <button 
                            onClick={() => handleNotification(`Starting class: ${cls.title}`)}
                            className="bg-[#5EA8FF] hover:bg-[#2563EB] text-white px-5 py-2 rounded-xl text-xs font-bold w-full sm:w-auto transition-colors"
                          >
                            Join Batch
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LEARNING PROGRESS DATA */}
              {activeTab === 'learning' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A]">Learning Statistics & Analytics</h2>
                    <p className="text-xs text-slate-500 mt-1">Detailed statistics of practice milestones and streak summaries.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[24px] text-center space-y-1">
                      <span className="block text-3xl font-black text-[#5EA8FF]">156</span>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Practice Hours</span>
                    </div>
                    <div className="p-5 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[24px] text-center space-y-1">
                      <span className="block text-3xl font-black text-[#FF6FAF]">96%</span>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Attendance Rate</span>
                    </div>
                    <div className="p-5 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[24px] text-center space-y-1">
                      <span className="block text-3xl font-black text-purple-600">75%</span>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Completion Rate</span>
                    </div>
                    <div className="p-5 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[24px] text-center space-y-1">
                      <span className="block text-3xl font-black text-amber-600">92%</span>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Performance Score</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ACHIEVEMENTS TAB */}
              {activeTab === 'achievements' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A]">Earned Achievements</h2>
                    <p className="text-xs text-slate-500 mt-1">Certifications, course badges, and milestones.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-[1.5px] bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[20px]">
                      <div className="bg-white/90 backdrop-blur-md rounded-[18.5px] p-5 text-center flex flex-col items-center justify-between h-full space-y-3 shadow-inner">
                        <span className="text-3xl select-none">🏆</span>
                        <div>
                          <h4 className="font-bold text-xs text-[#0F1E4A]">First Course Completed</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">Introduction to Music Theory Completed</p>
                        </div>
                        <span className="bg-[#DCEEFF] text-[#5EA8FF] text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Unlocked</span>
                      </div>
                    </div>
                    <div className="p-[1.5px] bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[20px]">
                      <div className="bg-white/90 backdrop-blur-md rounded-[18.5px] p-5 text-center flex flex-col items-center justify-between h-full space-y-3 shadow-inner">
                        <span className="text-3xl select-none">⭐</span>
                        <div>
                          <h4 className="font-bold text-xs text-[#0F1E4A]">Perfect Attendance</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">96% active student class attendance</p>
                        </div>
                        <span className="bg-[#DCEEFF] text-[#5EA8FF] text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Unlocked</span>
                      </div>
                    </div>
                    <div className="p-[1.5px] bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[20px]">
                      <div className="bg-white/90 backdrop-blur-md rounded-[18.5px] p-5 text-center flex flex-col items-center justify-between h-full space-y-3 shadow-inner">
                        <span className="text-3xl select-none">🎵</span>
                        <div>
                          <h4 className="font-bold text-xs text-[#0F1E4A]">Piano Beginner Certified</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">Scales assessment passed</p>
                        </div>
                        <span className="bg-[#DCEEFF] text-[#5EA8FF] text-[8px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">Unlocked</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>👤</span> My Student Profile
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Verify and manage your personal details.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs max-w-xl">
                    <div className="p-4 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[20px] space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">First Name</span>
                      <p className="font-bold text-sm text-[#0F1E4A]">{profileData.firstName}</p>
                    </div>
                    <div className="p-4 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[20px] space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Last Name</span>
                      <p className="font-bold text-sm text-[#0F1E4A]">{profileData.lastName}</p>
                    </div>
                    <div className="p-4 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[20px] space-y-1 sm:col-span-2">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Email Address</span>
                      <p className="font-bold text-sm text-[#0F1E4A]">{profileData.email}</p>
                    </div>
                    <div className="p-4 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[20px] space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Current Learning Level</span>
                      <p className="font-bold text-sm text-[#0F1E4A]">{profileData.level}</p>
                    </div>
                    <div className="p-4 bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-[20px] space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Academy Join Date</span>
                      <p className="font-bold text-sm text-[#0F1E4A]">{profileData.joinDate}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>⚙️</span> Settings Panel
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Manage profile bio and name preferences.</p>
                  </div>
                  <div className="space-y-5 max-w-md">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">Edit First Name</label>
                      <input 
                        type="text" 
                        value={profileData.firstName} 
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-xl font-bold focus:outline-none focus:border-[#5EA8FF]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">Edit Bio</label>
                      <textarea 
                        value={profileData.bio} 
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        className="w-full px-4 py-2.5 text-xs bg-[#FAFBFF] border-2 border-[#DCEEFF] rounded-xl font-bold focus:outline-none focus:border-[#5EA8FF]"
                        rows={3}
                      />
                    </div>
                    <button 
                      onClick={() => handleNotification('Settings saved successfully!')}
                      className="bg-[#5EA8FF] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold transition-colors shadow-sm"
                    >
                      Save Settings
                    </button>
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

