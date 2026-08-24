'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useCart, Course } from '@/contexts/CartContext'
import {
  LayoutDashboard,
  BookOpen,
  Tv,
  Video,
  Calendar,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle,
  Bell,
  ArrowRight
} from 'lucide-react'

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
import CourseCard from '@/components/CourseCard'

export default function StudentDashboard() {
  const router = useRouter()
  const { addItem } = useCart()

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'workshops' | 'recorded' | 'schedule' | 'bookings' | 'payments' | 'profile' | 'settings'>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Database Driven States
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
  const [favoriteCourses, setFavoriteCourses] = useState<string[]>(['c1'])
  const [bookings, setBookings] = useState<any[]>([])
  const [studentName, setStudentName] = useState('Kritika Patil')
  const [studentInitials, setStudentInitials] = useState('KP')
  const [payments, setPayments] = useState<any[]>([])

  // Reviews state variables
  const [myReviews, setMyReviews] = useState<any[]>([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedReviewCourse, setSelectedReviewCourse] = useState<any>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState('')

  const handleNotification = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  // Load backend database records on mount
  const loadStudentDashboardData = async () => {
    setLoading(true)
    try {
      const userString = localStorage.getItem('user')
      const loggedUser = userString ? JSON.parse(userString) : null
      const userEmail = loggedUser?.email || 'student@2ndinversion.com'

      if (loggedUser?.name) {
        setStudentName(loggedUser.name)
        setStudentInitials(loggedUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase())
      }

      const [workshopsRes, videosRes, studentsRes, coursesRes, paymentsRes, bookingsRes] = await Promise.all([
        fetch('/api/workshops').then(r => r.json()).catch(() => []),
        fetch('/api/recorded-sessions').then(r => r.json()).catch(() => []),
        fetch('/api/students').then(r => r.json()).catch(() => []),
        fetch('/api/courses').then(r => r.json()).catch(() => []),
        fetch('/api/payment/history?email=' + userEmail).then(r => r.json()).catch(() => []),
        fetch('/api/bookings').then(r => r.json()).catch(() => [])
      ])

      if (Array.isArray(paymentsRes)) {
        setPayments(paymentsRes)
      }

      if (Array.isArray(bookingsRes)) {
        const studentBookings = bookingsRes.filter((b: any) => b.studentEmail?.toLowerCase() === userEmail.toLowerCase())
        setBookings(studentBookings)
      }

      // 1. Set workshops
      if (Array.isArray(workshopsRes) && workshopsRes.length > 0) {
        setWorkshops(workshopsRes)
      } else {
        setWorkshops([
          { id: 'w1', title: 'Vocal Performance Masterclass', instructor: 'Dr. Sarah Chen', date: 'June 25, 2026', time: '11:00 AM', price: 1500, description: 'Learn breath control, performance delivery, and pitch correction guidelines.' },
          { id: 'w2', title: 'Piano Techniques & Posture', instructor: 'Ajinkya Amrule', date: 'June 28, 2026', time: '2:00 PM', price: 1200, description: 'Correct hand positioning and chord transitions for classical songs.' }
        ])
      }

      // 2. Set enrolled courses
      const currentStudent = Array.isArray(studentsRes) ? studentsRes.find((s: any) => s.email === userEmail) : null
      const enrolledCourseIds = currentStudent?.enrolledCourses || []

      // Fetch reviews for student
      if (currentStudent?.id) {
        const reviewsRes = await fetch(`/api/reviews?studentId=${currentStudent.id}`).then(r => r.json()).catch(() => ({ success: false }))
        if (reviewsRes.success) {
          setMyReviews(reviewsRes.reviews)
        }
      }

      let enrolledList = []
      if (Array.isArray(coursesRes) && coursesRes.length > 0) {
        enrolledList = coursesRes.filter((c: any) => enrolledCourseIds.includes(c.id))
        // If student exists but has no active course purchases yet, show first two as demo
        if (enrolledList.length === 0 && coursesRes.length > 0) {
          enrolledList = coursesRes.slice(0, 2)
        }
      } else {
        enrolledList = [
          { id: 'piano-beginner', title: 'Piano Fundamentals', instructor: 'Sarah Johnson', progress: 75, level: 'Beginner', category: 'Piano' },
          { id: 'guitar-mastery', title: 'Guitar Mastery', instructor: 'Mike Wilson', progress: 45, level: 'Intermediate', category: 'Guitar' }
        ]
      }
      setEnrolledCourses(enrolledList)

      // 3. Filter recorded sessions based on purchased course IDs
      if (Array.isArray(videosRes) && videosRes.length > 0) {
        if (loggedUser?.role === 'STUDENT' && currentStudent && enrolledCourseIds.length > 0) {
          const filtered = videosRes.filter((v: any) => !v.courseId || enrolledCourseIds.includes(v.courseId))
          setRecordedSessions(filtered)
        } else {
          setRecordedSessions(videosRes)
        }
      } else {
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
  }, [])

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

  // Logout Handler
  const handleLogout = async () => {
    sessionStorage.clear()
    localStorage.clear()
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', emoji: '🏠' },
    { id: 'courses', label: 'My Courses', emoji: '📚' },
    { id: 'workshops', label: 'Workshops', emoji: '🎤' },
    { id: 'recorded', label: 'Recorded Sessions', emoji: '🎥' },
    { id: 'schedule', label: 'Class Schedule', emoji: '📅' },
    { id: 'bookings', label: 'My Bookings', emoji: '📝' },
    { id: 'payments', label: 'Payments & Invoices', emoji: '💳' },
    { id: 'profile', label: 'My Profile', emoji: '👤' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ]

  const getCourseImage = (category: string) => {
    const term = category?.toLowerCase() || ''
    if (term.includes('piano')) {
      return 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=400&auto=format&fit=crop'
    }
    if (term.includes('guitar')) {
      return 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=400&auto=format&fit=crop'
    }
    return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop'
  }

  const handleOpenReviewModal = (course: any) => {
    const existing = myReviews.find(r => r.courseId === course.id)
    setReviewError('')
    if (existing) {
      setReviewRating(existing.rating)
      setReviewComment(existing.comment)
      setEditingReviewId(existing.id)
    } else {
      setReviewRating(5)
      setReviewComment('')
      setEditingReviewId(null)
    }
    setSelectedReviewCourse(course)
    setShowReviewModal(true)
  }

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      setReviewError('Review comment cannot be empty.')
      return
    }
    if (reviewComment.trim().length < 10) {
      setReviewError('Review comment must be at least 10 characters long.')
      return
    }

    setSubmittingReview(true)
    setReviewError('')
    try {
      const url = editingReviewId ? `/api/reviews/${editingReviewId}` : '/api/reviews'
      const method = editingReviewId ? 'PATCH' : 'POST'
      const body = editingReviewId
        ? { rating: reviewRating, comment: reviewComment }
        : { courseId: selectedReviewCourse.id, rating: reviewRating, comment: reviewComment }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (data.success) {
        handleNotification(
          editingReviewId
            ? 'Review updated successfully! It is pending approval.'
            : 'Review submitted successfully! It is pending approval.'
        )
        setShowReviewModal(false)
        // Refresh reviews list
        const userString = localStorage.getItem('user')
        const loggedUser = userString ? JSON.parse(userString) : null
        const userEmail = loggedUser?.email || 'student@2ndinversion.com'
        const studentsRes = await fetch('/api/students').then(r => r.json()).catch(() => [])
        const currentStudent = Array.isArray(studentsRes) ? studentsRes.find((s: any) => s.email === userEmail) : null
        if (currentStudent?.id) {
          const reviewsRes = await fetch(`/api/reviews?studentId=${currentStudent.id}`).then(r => r.json()).catch(() => ({ success: false }))
          if (reviewsRes.success) {
            setMyReviews(reviewsRes.reviews)
          }
        }
      } else {
        setReviewError(data.error || 'Failed to submit review.')
      }
    } catch (err: any) {
      setReviewError(err.message || 'An error occurred.')
    } finally {
      setSubmittingReview(false)
    }
  }

  const renderReviewAction = (course: any) => {
    const existing = myReviews.find(r => r.courseId === course.id)
    if (!existing) {
      return (
        <button
          onClick={() => handleOpenReviewModal(course)}
          className="px-4 h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-xl transition-all shrink-0 active:scale-[0.98]"
        >
          Write Review
        </button>
      )
    }

    let statusPill = 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
    if (existing.status === 'APPROVED') statusPill = 'bg-green-50 text-green-700 border-green-200 shadow-sm'
    if (existing.status === 'REJECTED') statusPill = 'bg-red-50 text-red-700 border-red-200 shadow-sm'

    return (
      <div className="flex flex-col items-stretch gap-1 shrink-0">
        <button
          onClick={() => handleOpenReviewModal(course)}
          className="px-4 h-8 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-[9px] rounded-xl transition-all"
        >
          Edit Review
        </button>
        <span className={`text-[8px] font-black uppercase border rounded px-2 py-0.5 text-center leading-none mt-0.5 ${statusPill}`}>
          {existing.status}
        </span>
      </div>
    )
  }

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
            ? 'fixed inset-y-0 left-0 w-80 z-40 bg-white border-r border-[#E6EEFF] flex flex-col transition-transform duration-300 translate-x-0'
            : 'hidden md:flex w-72 bg-white border-r border-[#E6EEFF] flex flex-col shrink-0 z-30'
        }`}
      >
        <div className="p-6 border-b border-[#E6EEFF] flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-[#F8FBFF] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
          >
            <span className="text-2xl">🎵</span>
            <div>
              <h2 className="font-extrabold text-[#0F1E4A] text-sm leading-tight">2nd Inversion</h2>
              <p className="text-[10px] text-[#5EA8FF] font-extrabold uppercase tracking-wider mt-0.5">Student Portal</p>
            </div>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="p-5">
          <div className="p-[1px] bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] rounded-[24px] shadow-sm">
            <div className="bg-white/95 backdrop-blur-md rounded-[23px] p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E6EEFF] to-[#FFD6E8] opacity-20 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center space-x-3.5 mb-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white text-sm font-extrabold shadow-inner shrink-0">
                  {studentInitials}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight text-[#0F1E4A]">{studentName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">Music Student</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#E6EEFF]/50 text-[10px] text-slate-500 font-bold">
                <span className="bg-[#FFD6E8] text-[#FF6FAF] px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold">🟢 Active Learner</span>
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
                  ? 'bg-[#FAFBFF] border border-[#E6EEFF] text-[#5EA8FF] shadow-sm font-extrabold'
                  : 'text-slate-600 hover:bg-[#FAFBFF] hover:text-[#5EA8FF]'
              }`}
            >
              <span className="text-lg transition-transform duration-200 group-hover:scale-110 select-none">{item.emoji}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Exit / Logout Links */}
        <div className="p-4 border-t border-[#E6EEFF] flex flex-col gap-1.5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-[16px] text-[#FF6FAF] hover:bg-red-50/50 border border-transparent transition-colors text-left font-bold"
          >
            <span className="text-lg select-none">🚪</span>
            <span className="text-xs font-bold">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Mobile Header Bar */}
        <header className="md:hidden bg-white border-b border-[#E6EEFF] px-6 py-4 flex items-center justify-between z-20 sticky top-0">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 hover:bg-[#FAFBFF] rounded-lg transition-colors text-[#0F1E4A]"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl">🎵</span>
            <span className="font-extrabold text-[#0F1E4A] text-sm">2nd Inversion Portal</span>
          </Link>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white text-xs font-bold">
            {studentInitials}
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* Notification Alert */}
          {showNotification && (
            <div className="fixed top-6 right-6 bg-white border border-[#E6EEFF] text-[#0F1E4A] px-5 py-4 rounded-[20px] shadow-lg z-50 flex items-center space-x-3 animate-slide-in">
              <div className="p-1.5 bg-[#E6EEFF] rounded-full">
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
              {/* TAB: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  
                  {/* Premium Welcome Banner */}
                  <div className="bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] rounded-[24px] p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
                    <div className="relative space-y-2">
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">Welcome Back, {studentName.split(' ')[0]} 👋</h1>
                      <p className="text-sm text-white/90 font-medium max-w-md">
                        Continue your musical journey and track your courses from one place.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-sm relative z-10">
                      <span className="text-xs font-bold text-white">
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white text-[#5EA8FF] flex items-center justify-center font-extrabold text-xs shadow-sm">
                        {studentInitials}
                      </div>
                    </div>
                  </div>

                  {/* OVERVIEW CARDS (Only 4) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Courses Enrolled */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)] hover:-translate-y-1 transition-all duration-300">
                      <span className="text-2xl select-none mb-3 block">📚</span>
                      <span className="block text-2xl font-black text-[#0F1E4A] tracking-tight">{enrolledCourses.length}</span>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mt-1 block">Courses Enrolled</span>
                    </div>

                    {/* Recorded Lessons */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)] hover:-translate-y-1 transition-all duration-300">
                      <span className="text-2xl select-none mb-3 block">🎥</span>
                      <span className="block text-2xl font-black text-[#0F1E4A] tracking-tight">{recordedSessions.length}</span>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mt-1 block">Recorded Lessons</span>
                    </div>

                    {/* Certificates */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)] hover:-translate-y-1 transition-all duration-300">
                      <span className="text-2xl select-none mb-3 block">🏆</span>
                      <span className="block text-2xl font-black text-[#0F1E4A] tracking-tight">2</span>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mt-1 block">Certificates</span>
                    </div>

                    {/* Attendance */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)] hover:-translate-y-1 transition-all duration-300">
                      <span className="text-2xl select-none mb-3 block">📈</span>
                      <span className="block text-2xl font-black text-[#0F1E4A] tracking-tight">96%</span>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mt-1 block">Attendance</span>
                    </div>
                  </div>

                  {/* MAIN SECTIONS: MY COURSES & UPCOMING CLASSES & QUICK ACTIONS & RECENT ACTIVITY */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: COURSES & CLASSES */}
                    <div className="lg:col-span-7 space-y-8">
                      {/* My Courses Enrolled */}
                      <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)]">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-extrabold text-[#0F1E4A] text-base">📚 My Enrolled Courses</h3>
                          <button onClick={() => setActiveTab('courses')} className="text-xs font-bold text-[#5EA8FF] hover:underline">
                            View All
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {enrolledCourses.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4">No enrolled courses yet.</p>
                          ) : (
                            enrolledCourses.map((c) => {
                              const isPiano = c.category?.toLowerCase() === 'piano'
                              const emoji = isPiano ? '🎹' : '🎸'
                              const prog = c.progress || 50
                              return (
                                <div key={c.id} className="border border-[#E6EEFF] rounded-[20px] p-4 bg-[#FAFBFF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl p-2 bg-white rounded-xl border border-[#E6EEFF] shadow-sm select-none">{emoji}</span>
                                    <div>
                                      <h4 className="font-extrabold text-xs text-[#0F1E4A]">{c.title}</h4>
                                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Instructor: {c.instructor}</p>
                                      <div className="flex items-center gap-2 mt-2 w-28 sm:w-36">
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                          <div className="bg-[#5EA8FF] h-full" style={{ width: `${prog}%` }}></div>
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-500">{prog}%</span>
                                      </div>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={() => setActiveTab('recorded')}
                                    className="px-4 py-2 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-md text-white text-[10px] font-black rounded-xl transition-all self-end sm:self-center shrink-0"
                                  >
                                    Continue Learning →
                                  </button>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>

                      {/* Upcoming Classes & Bookings */}
                      <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)] font-sans">
                        <h3 className="font-extrabold text-[#0F1E4A] text-base mb-6">📅 My Booked Slots</h3>
                        
                        <div className="space-y-4">
                          {bookings.length === 0 ? (
                            <div className="text-center py-6 space-y-2">
                              <p className="text-xs text-slate-400 font-bold">No active slot bookings yet.</p>
                              <button
                                onClick={() => router.push('/courses')}
                                className="text-[10px] bg-[#0F1E4A] text-white px-3 py-1.5 rounded-lg font-black"
                              >
                                Book Demo Slot
                              </button>
                            </div>
                          ) : (
                            bookings.map((b) => {
                              const isPiano = b.courseName?.toLowerCase().includes('piano')
                              const emoji = isPiano ? '🎹' : '🎸'
                              return (
                                <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FAFBFF] border border-[#E6EEFF] rounded-2xl hover:border-[#5EA8FF] transition-all gap-4">
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl p-2 bg-white rounded-xl border border-[#E6EEFF] shadow-sm select-none">{emoji}</span>
                                    <div>
                                      <h4 className="text-xs font-extrabold text-[#0F1E4A]">{b.courseName}</h4>
                                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                        Date: {b.date} • {b.timeSlot} ({b.batchTiming} batch)
                                      </p>
                                      <p className="text-[9px] text-slate-450 font-bold">Instructor: {b.instructor}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 self-end sm:self-center">
                                    <span className="text-[9px] bg-green-50 text-green-700 font-extrabold px-2.5 py-1 rounded-lg uppercase">
                                      {b.status || 'Booked'}
                                    </span>
                                    <button 
                                      onClick={() => handleNotification(`Redirecting to virtual classroom for ${b.courseName}...`)}
                                      className="px-4 py-2 bg-[#0F1E4A] text-white hover:bg-slate-800 text-[10px] font-black rounded-xl transition-all"
                                    >
                                      Join Class
                                    </button>
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: QUICK ACTIONS & RECENT ACTIVITY */}
                    <div className="lg:col-span-5 space-y-8">
                      
                      {/* Quick Actions */}
                      <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)]">
                        <h3 className="font-extrabold text-[#0F1E4A] text-base mb-6">⚡ Quick Actions</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setActiveTab('courses')}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                          >
                            <span className="text-lg">📚</span>
                            <span className="text-[10px] font-extrabold text-center">Browse Courses</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('workshops')}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                          >
                            <span className="text-lg">🎤</span>
                            <span className="text-[10px] font-extrabold text-center">Join Workshop</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('recorded')}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                          >
                            <span className="text-lg">🎥</span>
                            <span className="text-[10px] font-extrabold text-center">Watch Recordings</span>
                          </button>
                          <button
                            onClick={() => setActiveTab('schedule')}
                            className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                          >
                            <span className="text-lg">📅</span>
                            <span className="text-[10px] font-extrabold text-center">Book Class</span>
                          </button>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)]">
                        <h3 className="font-extrabold text-[#0F1E4A] text-base mb-6">🔔 Recent Activity</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">✅</span>
                              <div>
                                <h5 className="font-bold text-xs text-[#0F1E4A]">Lesson Completed</h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">Finished C Major chords tutorial</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">🎤</span>
                              <div>
                                <h5 className="font-bold text-xs text-[#0F1E4A]">Workshop Joined</h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">Joined Dr. Sarah Chen's Vocal masterclass</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">🏆</span>
                              <div>
                                <h5 className="font-bold text-xs text-[#0F1E4A]">Certificate Earned</h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">Achieved Music Theory Level 1 certified award</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleNotification('All activities loaded!')}
                          className="w-full mt-6 py-2.5 bg-[#FAFBFF] border border-[#E6EEFF] text-slate-500 hover:text-[#5EA8FF] hover:border-[#5EA8FF] text-xs font-bold rounded-xl transition-all"
                        >
                          View All Activity
                        </button>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB: MY COURSES */}
              {activeTab === 'courses' && (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>📚</span> My Enrolled Courses
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Manage, play video tutorials, and track batch assignments.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {enrolledCourses.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 col-span-4 text-center">No enrolled courses yet.</p>
                    ) : (
                      enrolledCourses.map((c) => (
                        <CourseCard
                          key={c.id}
                          course={{
                            ...c,
                            instructor: c.instructor || 'Ajinkya Amrule',
                            level: c.level || 'Beginner',
                            duration: c.duration || '3 Months'
                          }}
                          mode="student"
                          progress={c.progress || 60}
                          completedLessons={c.completedLessons || 14}
                          totalLessons={c.totalLessons || 24}
                          certificateStatus={c.hasCertificate ? 'Available' : 'None'}
                          isFavorite={favoriteCourses.includes(c.id)}
                          onToggleFavorite={(course) => {
                            setFavoriteCourses(prev => 
                              prev.includes(course.id)
                                ? prev.filter(id => id !== course.id)
                                : [...prev, course.id]
                            )
                            handleNotification(
                              favoriteCourses.includes(course.id)
                                ? `Removed "${course.title}" from favorites`
                                : `Added "${course.title}" to favorites`
                            )
                          }}
                          onContinueLearning={() => {
                            setActiveTab('recorded')
                          }}
                          onReviewAction={(course) => renderReviewAction(course)}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB: WORKSHOPS */}
              {activeTab === 'workshops' && (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>🎤</span> Special Music Workshops
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Book live interaction sessions, Q&As, and masterclasses.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workshops.map((w) => {
                      const courseImg = getCourseImage(w.title)
                      return (
                        <div key={w.id} className="border-2 border-[#E6EEFF] bg-[#FAFBFF] rounded-[24px] overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
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
                              <p className="text-xs text-slate-500 leading-relaxed pt-1.5 border-t border-[#E6EEFF]">{w.description}</p>
                            </div>
                            <div className="space-y-3 pt-2">
                              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                                <span>📅 {w.date}</span>
                                <span>⏰ {w.time}</span>
                              </div>
                              <p className="text-xs font-black text-[#FF6FAF]">Fee: ₹{w.price.toLocaleString('en-IN')}</p>
                              <button 
                                onClick={() => handleRegisterWorkshop(w)}
                                className="w-full bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white py-2.5 rounded-xl text-xs font-bold hover:scale-[1.02] active:scale-100 shadow-sm transition-all"
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

              {/* TAB: RECORDED SESSIONS */}
              {activeTab === 'recorded' && (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>🎥</span> Recorded Practice Directory
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Access lecture videos, scale guides, and backing audios.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recordedSessions.map((rec) => {
                      return (
                        <div key={rec.id} className="border-2 border-[#E6EEFF] bg-[#FAFBFF] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="aspect-video bg-black relative">
                            <iframe src={rec.url} title={rec.title} className="w-full h-full" allowFullScreen></iframe>
                          </div>
                          <div className="p-5 space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-extrabold text-sm text-[#0F1E4A]">{rec.title}</h4>
                              <span className="bg-[#E6EEFF] text-[#5EA8FF] font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase shrink-0">
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

              {/* TAB: CLASS SCHEDULE */}
              {activeTab === 'schedule' && (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>📅</span> Class Schedule
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Check class dates, batch timings, and scheduled lessons.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-5 bg-[#FAFBFF] border-2 border-[#E6EEFF] rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#5EA8FF] transition-colors">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-[#0F1E4A]">Piano Session</h4>
                        <p className="text-xs text-slate-500 font-medium">Instructor: Sarah Johnson • Instrument: Piano</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Timings: 3:00 PM (1 hour)</p>
                      </div>
                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <span className="text-[10px] bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full uppercase shrink-0">
                          Today
                        </span>
                        <button 
                          onClick={() => handleNotification(`Starting class: Piano Session`)}
                          className="bg-[#5EA8FF] hover:bg-[#2563EB] text-white px-5 py-2 rounded-xl text-xs font-bold w-full sm:w-auto transition-colors"
                        >
                          Join Batch
                        </button>
                      </div>
                    </div>

                    <div className="p-5 bg-[#FAFBFF] border-2 border-[#E6EEFF] rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#5EA8FF] transition-colors">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm text-[#0F1E4A]">Guitar Workshop</h4>
                        <p className="text-xs text-slate-500 font-medium">Instructor: Mike Wilson • Instrument: Guitar</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Timings: 4:00 PM (45 mins)</p>
                      </div>
                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <span className="text-[10px] bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full uppercase shrink-0">
                          Tomorrow
                        </span>
                        <button 
                          onClick={() => handleNotification(`Class starts tomorrow at 4:00 PM`)}
                          className="bg-slate-200 text-slate-500 px-5 py-2 rounded-xl text-xs font-bold w-full sm:w-auto cursor-not-allowed"
                        >
                          Upcoming
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: MY BOOKINGS */}
              {activeTab === 'bookings' && (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>📝</span> My Booked Slots
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Review the status of your demo classes and course booking slots.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                          <th className="p-4">Course</th>
                          <th className="p-4">Booking Date & Time</th>
                          <th className="p-4">Instructor</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-bold">
                              No class bookings found.
                            </td>
                          </tr>
                        ) : (
                          bookings.map((b: any, idx: number) => (
                            <tr key={idx} className="border-b border-slate-50 hover:bg-[#FAFBFF] text-xs font-bold text-slate-600 transition-colors">
                              <td className="p-4 text-[#0F1E4A] font-extrabold">{b.courseName}</td>
                              <td className="p-4">
                                <span className="block text-[#0F1E4A]">{b.date}</span>
                                <span className="text-[10px] text-slate-400 font-medium">{b.timeSlot} ({b.batchTiming})</span>
                              </td>
                              <td className="p-4 text-slate-500">{b.instructor}</td>
                              <td className="p-4 text-[#2563EB] font-black">{b.amount ? `₹${b.amount.toLocaleString('en-IN')}` : 'Free Trial'}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[9px] uppercase font-black ${
                                  b.status === 'Approved' || b.status === 'Confirmed' || b.status === 'Booked'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : b.status === 'Rejected' || b.status === 'Cancelled'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {b.status === 'Booked' ? 'Approved' : b.status === 'Cancelled' ? 'Rejected' : b.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: MY PROFILE */}
              {activeTab === 'profile' && (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>👤</span> My Student Profile
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Verify and manage your personal details.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs max-w-xl">
                    <div className="p-4 bg-[#FAFBFF] border-2 border-[#E6EEFF] rounded-[20px] space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Full Name</span>
                      <p className="font-bold text-sm text-[#0F1E4A]">Kritika Patil</p>
                    </div>
                    <div className="p-4 bg-[#FAFBFF] border-2 border-[#E6EEFF] rounded-[20px] space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Current Learning Level</span>
                      <p className="font-bold text-sm text-[#0F1E4A]">Beginner</p>
                    </div>
                    <div className="p-4 bg-[#FAFBFF] border-2 border-[#E6EEFF] rounded-[20px] space-y-1 sm:col-span-2">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Email Address</span>
                      <p className="font-bold text-sm text-[#0F1E4A]">student@2ndinversion.com</p>
                    </div>
                    <div className="p-4 bg-[#FAFBFF] border-2 border-[#E6EEFF] rounded-[20px] space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Academy Join Date</span>
                      <p className="font-bold text-sm text-[#0F1E4A]">2026-01-15</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PAYMENTS */}
              {activeTab === 'payments' && (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>💳</span> Payments & Invoices
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">View your purchase history and download invoices.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                          <th className="p-4">Invoice No</th>
                          <th className="p-4">Course</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Payment ID</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-450 text-xs font-bold">
                              No payments recorded.
                            </td>
                          </tr>
                        ) : (
                          payments.map((p, idx) => (
                            <tr key={idx} className="border-b border-slate-50 hover:bg-[#FAFBFF] text-xs font-bold text-slate-600 transition-colors">
                              <td className="p-4 text-[#0F1E4A] font-extrabold">{p.invoiceNumber || `INV-${p.id}`}</td>
                              <td className="p-4">{p.courseName}</td>
                              <td className="p-4 text-[#5EA8FF] font-black">₹{p.amount.toLocaleString('en-IN')}</td>
                              <td className="p-4 text-slate-400 font-mono select-all">{p.paymentId}</td>
                              <td className="p-4 text-slate-400">{p.createdAt ? p.createdAt.substring(0, 10) : '2026-06-18'}</td>
                              <td className="p-4">
                                <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-lg text-[9px] uppercase font-black">
                                  {p.status || 'Success'}
                                </span>
                              </td>
                              <td className="p-4">
                                <a
                                  href={`/api/payment/invoice?id=${p.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#E6EEFF] border border-[#E6EEFF] rounded-xl text-[10px] font-extrabold text-[#0F1E4A] transition-all"
                                >
                                  Download
                                </a>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-extrabold text-lg text-[#0F1E4A] flex items-center gap-2">
                      <span>⚙️</span> Settings Panel
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Manage profile bio and settings preferences.</p>
                  </div>
                  <div className="space-y-5 max-w-md">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider">Biography / Notes</label>
                      <textarea 
                        className="w-full px-4 py-2.5 text-xs bg-[#FAFBFF] border-2 border-[#E6EEFF] rounded-xl font-bold focus:outline-none focus:border-[#5EA8FF]"
                        rows={3}
                        defaultValue="Passionate music learner exploring piano and guitar."
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

      {/* Interactive Write/Edit Review Modal */}
      {showReviewModal && selectedReviewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] border border-[#E6EEFF] w-full max-w-lg overflow-hidden shadow-2xl p-7 relative space-y-6">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-5 right-5 p-2 bg-[#FAFBFF] border border-[#E6EEFF] rounded-xl text-slate-400 hover:text-slate-600 hover:shadow-sm transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#5EA8FF] uppercase tracking-wider block">Course Review System</span>
              <h3 className="text-lg font-black text-[#0F1E4A]">
                {editingReviewId ? 'Edit Your Review' : 'Share Your Experience'}
              </h3>
              <p className="text-xs text-slate-450 font-bold">
                For course: <span className="text-[#0F1E4A] font-extrabold">{selectedReviewCourse.title}</span>
              </p>
            </div>

            {/* Stars Rating Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-2xl hover:scale-110 active:scale-95 transition-transform"
                    title={`${star} Star${star > 1 ? 's' : ''}`}
                  >
                    <span className={star <= reviewRating ? 'text-amber-400 select-none' : 'text-slate-200 select-none'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Review Comment</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="What did you like about this course? How was the instructor's feedback? (Minimum 10 characters)"
                className="w-full px-4.5 py-3 text-xs bg-[#FAFBFF] border-2 border-[#E6EEFF] rounded-2xl font-bold focus:outline-none focus:border-[#5EA8FF] resize-none h-32"
                maxLength={500}
              />
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>{reviewComment.length} / 500 characters</span>
                {editingReviewId && (
                  <span className="text-amber-500">⚠️ Editing will reset approval status to pending</span>
                )}
              </div>
            </div>

            {/* Error message */}
            {reviewError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
                {reviewError}
              </div>
            )}

            {/* Submit / Cancel Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-3 border border-[#E6EEFF] text-slate-500 font-extrabold rounded-2xl hover:bg-slate-50 text-xs transition active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="flex-1 py-3 bg-slate-900 text-white font-extrabold rounded-2xl hover:bg-slate-800 text-xs transition active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {submittingReview ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Submit Review</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
