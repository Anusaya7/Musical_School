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

export default function StudentDashboard() {
  const router = useRouter()
  const { addItem } = useCart()

  // Tab State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'workshops' | 'recorded' | 'schedule' | 'profile' | 'settings'>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Database Driven States
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [recordedSessions, setRecordedSessions] = useState<RecordedSession[]>([])

  const handleNotification = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  // Load backend database records on mount
  const loadStudentDashboardData = async () => {
    setLoading(true)
    try {
      const [workshopsRes, videosRes] = await Promise.all([
        fetch('/api/workshops').then(r => r.json()).catch(() => []),
        fetch('/api/recorded-sessions').then(r => r.json()).catch(() => [])
      ])

      if (Array.isArray(workshopsRes) && workshopsRes.length > 0) {
        setWorkshops(workshopsRes)
      } else {
        setWorkshops([
          { id: 'w1', title: 'Vocal Performance Masterclass', instructor: 'Dr. Sarah Chen', date: 'June 25, 2026', time: '11:00 AM', price: 1500, description: 'Learn breath control, performance delivery, and pitch correction guidelines.' },
          { id: 'w2', title: 'Piano Techniques & Posture', instructor: 'Ajinkya Amrule', date: 'June 28, 2026', time: '2:00 PM', price: 1200, description: 'Correct hand positioning and chord transitions for classical songs.' }
        ])
      }

      if (Array.isArray(videosRes) && videosRes.length > 0) {
        setRecordedSessions(videosRes)
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
                  KP
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight text-[#0F1E4A]">Kritika Patil</h4>
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
            KP
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
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">Welcome Back, Kritika 👋</h1>
                      <p className="text-sm text-white/90 font-medium max-w-md">
                        Continue your musical journey and track your courses from one place.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl shadow-sm relative z-10">
                      <span className="text-xs font-bold text-white">
                        {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white text-[#5EA8FF] flex items-center justify-center font-extrabold text-xs shadow-sm">
                        KP
                      </div>
                    </div>
                  </div>

                  {/* OVERVIEW CARDS (Only 4) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Courses Enrolled */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)] hover:-translate-y-1 transition-all duration-300">
                      <span className="text-2xl select-none mb-3 block">📚</span>
                      <span className="block text-2xl font-black text-[#0F1E4A] tracking-tight">2</span>
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider mt-1 block">Courses Enrolled</span>
                    </div>

                    {/* Recorded Lessons */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)] hover:-translate-y-1 transition-all duration-300">
                      <span className="text-2xl select-none mb-3 block">🎥</span>
                      <span className="block text-2xl font-black text-[#0F1E4A] tracking-tight">11</span>
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
                          {/* Course 1 */}
                          <div className="border border-[#E6EEFF] rounded-[20px] p-4 bg-[#FAFBFF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl p-2 bg-white rounded-xl border border-[#E6EEFF] shadow-sm select-none">🎹</span>
                              <div>
                                <h4 className="font-extrabold text-xs text-[#0F1E4A]">Piano Fundamentals</h4>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Instructor: Sarah Johnson</p>
                                <div className="flex items-center gap-2 mt-2 w-28 sm:w-36">
                                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#5EA8FF] h-full" style={{ width: '75%' }}></div>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-500">75%</span>
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

                          {/* Course 2 */}
                          <div className="border border-[#E6EEFF] rounded-[20px] p-4 bg-[#FAFBFF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl p-2 bg-white rounded-xl border border-[#E6EEFF] shadow-sm select-none">🎸</span>
                              <div>
                                <h4 className="font-extrabold text-xs text-[#0F1E4A]">Guitar Mastery</h4>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Instructor: Mike Wilson</p>
                                <div className="flex items-center gap-2 mt-2 w-28 sm:w-36">
                                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#5EA8FF] h-full" style={{ width: '45%' }}></div>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-500">45%</span>
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
                        </div>
                      </div>

                      {/* Upcoming Classes */}
                      <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.06)]">
                        <h3 className="font-extrabold text-[#0F1E4A] text-base mb-6">📅 Upcoming Classes</h3>
                        
                        <div className="space-y-4">
                          {/* Class 1 */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FAFBFF] border border-[#E6EEFF] rounded-2xl hover:border-[#5EA8FF] transition-all gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl p-2 bg-white rounded-xl border border-[#E6EEFF] shadow-sm select-none">🎹</span>
                              <div>
                                <h4 className="text-xs font-extrabold text-[#0F1E4A]">Piano Session</h4>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Today • 3:00 PM</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleNotification('Redirecting to virtual classroom for Piano Session...')}
                              className="px-4 py-2 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-md text-white text-[10px] font-black rounded-xl transition-all self-end sm:self-center shrink-0"
                            >
                              Join Class →
                            </button>
                          </div>

                          {/* Class 2 */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#FAFBFF] border border-[#E6EEFF] rounded-2xl hover:border-[#FF6FAF] transition-all gap-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl p-2 bg-white rounded-xl border border-[#E6EEFF] shadow-sm select-none">🎸</span>
                              <div>
                                <h4 className="text-xs font-extrabold text-[#0F1E4A]">Guitar Workshop</h4>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Tomorrow • 4:00 PM</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleNotification('Class starts tomorrow at 4:00 PM')}
                              className="px-4 py-2 bg-slate-200 text-slate-500 text-[10px] font-black rounded-xl transition-all self-end sm:self-center shrink-0 cursor-not-allowed"
                            >
                              Upcoming
                            </button>
                          </div>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Course 1 */}
                    <div className="border-2 border-[#E6EEFF] bg-[#FAFBFF] rounded-[24px] overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <div className="h-40 w-full relative bg-slate-100">
                        <img src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=400&auto=format&fit=crop" alt="Piano Fundamentals" className="w-full h-full object-cover" />
                        <span className="absolute top-3 right-3 text-[10px] bg-green-100 text-green-800 border border-green-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                          Active
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-[#0F1E4A] mb-1 leading-snug">Piano Fundamentals</h4>
                          <p className="text-xs text-slate-500">Instructor: Sarah Johnson</p>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#5EA8FF] h-full" style={{ width: '75%' }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>Progress: 75%</span>
                            <span>Level: Beginner</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('recorded')}
                          className="w-full bg-[#5EA8FF] hover:bg-[#2563EB] text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm"
                        >
                          Continue Learning
                        </button>
                      </div>
                    </div>

                    {/* Course 2 */}
                    <div className="border-2 border-[#E6EEFF] bg-[#FAFBFF] rounded-[24px] overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                      <div className="h-40 w-full relative bg-slate-100">
                        <img src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=400&auto=format&fit=crop" alt="Guitar Mastery" className="w-full h-full object-cover" />
                        <span className="absolute top-3 right-3 text-[10px] bg-green-100 text-green-800 border border-green-200 px-2.5 py-0.5 rounded-full font-bold uppercase">
                          Active
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-[#0F1E4A] mb-1 leading-snug">Guitar Mastery</h4>
                          <p className="text-xs text-slate-500">Instructor: Mike Wilson</p>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-[#5EA8FF] h-full" style={{ width: '45%' }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                            <span>Progress: 45%</span>
                            <span>Level: Intermediate</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab('recorded')}
                          className="w-full bg-[#5EA8FF] hover:bg-[#2563EB] text-white py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm"
                        >
                          Continue Learning
                        </button>
                      </div>
                    </div>
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

    </div>
  )
}
