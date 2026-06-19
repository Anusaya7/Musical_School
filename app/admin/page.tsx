'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Plus,
  Video,
  Settings,
  LogOut,
  Clock,
  Trash2,
  Edit,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Bell,
  Sparkles,
  UserCheck,
  CalendarDays,
  PlusCircle,
  TrendingUp
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Live Database States
  const [courses, setCourses] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [workshops, setWorkshops] = useState<any[]>([])
  const [recordedSessions, setRecordedSessions] = useState<any[]>([])
  const [holidays, setHolidays] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])

  // Modal Toggles
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [isAddWorkshopOpen, setIsAddWorkshopOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [newPrice, setNewPrice] = useState<number>(0)

  // Add Course simulated form state
  const [courseTitle, setCourseTitle] = useState('')
  const [courseCategory, setCourseCategory] = useState('piano')
  const [courseLevel, setCourseLevel] = useState('Beginner')
  const [coursePrice, setCoursePrice] = useState<number>(4999)
  const [courseDuration, setCourseDuration] = useState('3 Months')

  // Workshop form state
  const [workshopTitle, setWorkshopTitle] = useState('')
  const [workshopInstructor, setWorkshopInstructor] = useState('')
  const [workshopDate, setWorkshopDate] = useState('')
  const [workshopTime, setWorkshopTime] = useState('')
  const [workshopPrice, setWorkshopPrice] = useState<number>(0)
  const [workshopDesc, setWorkshopDesc] = useState('')

  // Recorded session form state
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDesc, setVideoDesc] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoInstrument, setVideoInstrument] = useState('piano')

  // Timings edit state
  const [morningStart, setMorningStart] = useState('04:00 AM')
  const [morningEnd, setMorningEnd] = useState('12:00 PM')
  const [eveningStart, setEveningStart] = useState('03:00 PM')
  const [eveningEnd, setEveningEnd] = useState('09:00 PM')

  // Holiday form state
  const [holidayDate, setHolidayDate] = useState('')
  const [holidayReason, setHolidayReason] = useState('')
  const [isWeeklyHoliday, setIsWeeklyHoliday] = useState(false)
  const [weeklyDay, setWeeklyDay] = useState(1) // Monday default

  // Integrations states
  const [whatsappConnected, setWhatsappConnected] = useState(true)
  const [chatbotActive, setChatbotActive] = useState(true)

  // Fetch data
  const loadDatabaseData = async () => {
    setLoading(true)
    try {
      const [coursesRes, bookingsRes, workshopsRes, videosRes, holidaysRes, schedulesRes] = await Promise.all([
        fetch('/api/courses').then(r => r.json()),
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/workshops').then(r => r.json()),
        fetch('/api/recorded-sessions').then(r => r.json()),
        fetch('/api/holidays').then(r => r.json()),
        fetch('/api/schedules').then(r => r.json())
      ])

      if (Array.isArray(coursesRes)) setCourses(coursesRes)
      if (Array.isArray(bookingsRes)) setBookings(bookingsRes)
      if (Array.isArray(workshopsRes)) setWorkshops(workshopsRes)
      if (Array.isArray(videosRes)) setRecordedSessions(videosRes)
      if (Array.isArray(holidaysRes)) setHolidays(holidaysRes)
      if (Array.isArray(schedulesRes)) {
        setSchedules(schedulesRes)
        const morning = schedulesRes.find(s => s.id === 'morning')
        if (morning) {
          setMorningStart(morning.startTime)
          setMorningEnd(morning.endTime)
        }
        const evening = schedulesRes.find(s => s.id === 'evening')
        if (evening) {
          setEveningStart(evening.startTime)
          setEveningEnd(evening.endTime)
        }
      }
    } catch (error) {
      console.error("Failed to load admin dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDatabaseData()
  }, [])

  // 1. Update Course Price
  const handleUpdatePrice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCourse) return
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCourse.id, price: Number(newPrice) })
      })
      if (res.ok) {
        setEditingCourse(null)
        loadDatabaseData()
      } else {
        alert('Failed to update pricing')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 2. Add Simulated Course
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseTitle) return

    const simulatedCourse = {
      id: `course-${Date.now()}`,
      title: courseTitle,
      category: courseCategory,
      level: courseLevel,
      price: Number(coursePrice),
      instructor: 'Ajinkya Amrule',
      duration: courseDuration
    }

    setCourses(prev => [simulatedCourse, ...prev])
    setIsAddCourseOpen(false)
    setCourseTitle('')
    setCoursePrice(4999)
  }

  // 3. Create Workshop
  const handleAddWorkshop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workshopTitle || !workshopDate || !workshopTime) return

    const payload = {
      title: workshopTitle,
      instructor: workshopInstructor || 'Ajinkya Amrule',
      date: workshopDate,
      time: workshopTime,
      price: Number(workshopPrice),
      description: workshopDesc
    }

    try {
      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setIsAddWorkshopOpen(false)
        setWorkshopTitle('')
        setWorkshopInstructor('')
        setWorkshopDate('')
        setWorkshopTime('')
        setWorkshopPrice(0)
        setWorkshopDesc('')
        loadDatabaseData()
      } else {
        alert('Failed to create workshop')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 4. Upload Recording (YouTube embed link)
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoTitle || !videoUrl) return

    let embedUrl = videoUrl
    if (videoUrl.includes("watch?v=")) {
      const videoId = videoUrl.split("v=")[1]?.split("&")[0]
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0]
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
    }

    const payload = {
      title: videoTitle,
      description: videoDesc,
      url: embedUrl,
      instrument: videoInstrument
    }

    try {
      const res = await fetch('/api/recorded-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setVideoTitle('')
        setVideoDesc('')
        setVideoUrl('')
        loadDatabaseData()
      } else {
        alert('Failed to upload video')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 5. Update Class Timings
  const handleUpdateTimings = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const generateSlots = (startStr: string, endStr: string) => {
      if (startStr.includes("04:00") && endStr.includes("12:00")) {
        return ["04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
      }
      if (startStr.includes("03:00") && endStr.includes("09:00")) {
        return ["03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"]
      }
      return [startStr, "08:00 AM", "10:00 AM", endStr]
    }

    const payload = [
      {
        id: 'morning',
        name: 'Morning Batch',
        startTime: morningStart,
        endTime: morningEnd,
        timeSlots: generateSlots(morningStart, morningEnd)
      },
      {
        id: 'evening',
        name: 'Evening Batch',
        startTime: eveningStart,
        endTime: eveningEnd,
        timeSlots: generateSlots(eveningStart, eveningEnd)
      }
    ]

    try {
      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        alert('Class timings updated successfully!')
        loadDatabaseData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 6. Add Holiday
  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isWeeklyHoliday && !holidayDate) return

    const payload = {
      date: isWeeklyHoliday ? '' : holidayDate,
      reason: holidayReason || 'School Holiday',
      isRecurringWeekly: isWeeklyHoliday,
      dayOfWeek: isWeeklyHoliday ? Number(weeklyDay) : undefined
    }

    try {
      const res = await fetch('/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setHolidayDate('')
        setHolidayReason('')
        loadDatabaseData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 7. Delete Holiday
  const handleDeleteHoliday = async (id: string) => {
    if (!confirm('Are you sure you want to remove this holiday?')) return
    try {
      const res = await fetch(`/api/holidays?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadDatabaseData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 8. Logout Security
  const handleLogout = async () => {
    localStorage.removeItem('user')
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  // Unique list of students derived from bookings + mock data
  const enrolledStudents = [
    { name: 'Aarav Mehta', email: 'aarav.mehta@gmail.com', course: 'Piano Beginner', joined: '2026-05-10', status: 'Active' },
    { name: 'Isha Sharma', email: 'isha.sharma@yahoo.com', course: 'Guitar Mastery', joined: '2026-05-15', status: 'Active' },
    { name: 'Kabir Kapoor', email: 'kabir.k@gmail.com', course: 'Vocal Training', joined: '2026-05-20', status: 'Active' },
    { name: 'Diya Patel', email: 'diya.patel@outlook.com', course: 'Piano Intermediate', joined: '2026-06-01', status: 'Active' },
    { name: 'Rohan Sen', email: 'rohan.sen@gmail.com', course: 'Guitar Beginner', joined: '2026-06-05', status: 'Active' },
    ...Array.from(new Map(bookings.map(b => [b.studentEmail, { name: b.studentName, email: b.studentEmail, course: b.courseName, joined: b.createdAt ? b.createdAt.substring(0, 10) : '2026-06-18', status: 'Active' }])).values())
  ]

  // Menu Navigation configuration
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'instructors', label: 'Instructors', icon: UserCheck },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'workshops', label: 'Workshops', icon: Sparkles },
    { id: 'recorded', label: 'Recorded Sessions', icon: Video },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#0F1E4A] font-sans flex flex-col xl:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="xl:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-[#E6EEFF] z-30">
        <span className="font-extrabold text-base flex items-center gap-2 text-[#0F1E4A] select-none">
          🎵 Music School Management
        </span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 border-2 border-[#DCEEFF] rounded-xl text-[#0F1E4A] hover:bg-[#FAFBFF] focus:outline-none"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* SIDEBAR PANEL */}
      <aside className={`
        fixed xl:sticky top-0 bottom-0 left-0 w-[280px] bg-white border-r border-[#E6EEFF] p-6 
        flex flex-col justify-between overflow-y-auto z-40 transition-transform duration-300 ease-out h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Header Branding */}
          <div className="pb-3 border-b border-[#E6EEFF]">
            <h1 className="text-base font-extrabold flex items-center gap-2 text-[#0F1E4A]">
              <span>🎵</span> Music School Management
            </h1>
          </div>

          {/* Admin Profiler */}
          <div className="bg-white border-2 border-[#E6EEFF] rounded-[20px] p-4 shadow-[0_10px_30px_rgba(94,168,255,0.04)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-black text-sm shadow-sm select-none">
                AA
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#0F1E4A] leading-tight">Ajinkya Amrule</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Super Admin</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-[#5EA8FF] mt-1 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  🟢 Online
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all border border-transparent ${
                  activeTab === item.id 
                    ? 'bg-[#FAFBFF] border-[#E6EEFF] text-[#5EA8FF] shadow-sm font-extrabold' 
                    : 'text-[#0F1E4A] hover:bg-[#FAFBFF] hover:border-[#E6EEFF]'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#5EA8FF]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="border-t border-[#E6EEFF] pt-4 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold text-[#FF6FAF] hover:bg-red-50/50 hover:border-red-100 border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4 text-[#FF6FAF]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col gap-8 bg-[#FAFBFF]">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#5EA8FF] border-t-transparent"></div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Syncing database data...</p>
          </div>
        ) : (
          <>
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6EEFF] pb-6">
              <div>
                <h1 className="text-2xl font-black text-[#0F1E4A] tracking-tight">
                  Welcome Back, Ajinkya 👋
                </h1>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Manage your music school from one place.
                </p>
              </div>
              <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md border border-[#E6EEFF] px-4 py-2.5 rounded-2xl shadow-sm">
                <span className="text-xs font-extrabold text-slate-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
                  AA
                </div>
              </div>
            </div>

            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* 4 OVERVIEW CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Card 1: Courses */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">📚 Courses</span>
                    </div>
                    <h3 className="text-3xl font-black text-[#0F1E4A] tracking-tight">25</h3>
                  </div>

                  {/* Card 2: Students */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">👨‍🎓 Students</span>
                    </div>
                    <h3 className="text-3xl font-black text-[#0F1E4A] tracking-tight">120</h3>
                  </div>

                  {/* Card 3: Bookings */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">📅 Bookings</span>
                    </div>
                    <h3 className="text-3xl font-black text-[#0F1E4A] tracking-tight">35</h3>
                  </div>

                  {/* Card 4: Workshops */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">🎤 Workshops</span>
                    </div>
                    <h3 className="text-3xl font-black text-[#0F1E4A] tracking-tight">8</h3>
                  </div>
                </div>

                {/* QUICK ACTIONS & RECENT ACTIVITY */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Quick Actions */}
                  <div className="lg:col-span-6 bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0F1E4A] mb-2">⚡ Quick Actions</h3>
                      <p className="text-xs text-slate-400 font-medium mb-6">Shortcuts to common administrative operations.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setIsAddCourseOpen(true)}
                        className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                      >
                        <PlusCircle className="w-5 h-5" />
                        <span className="text-[11px] font-extrabold">Add Course</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('students')}
                        className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                      >
                        <Users className="w-5 h-5" />
                        <span className="text-[11px] font-extrabold">View Students</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                      >
                        <Calendar className="w-5 h-5" />
                        <span className="text-[11px] font-extrabold">Manage Bookings</span>
                      </button>
                      <button
                        onClick={() => setIsAddWorkshopOpen(true)}
                        className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span className="text-[11px] font-extrabold">Create Workshop</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="lg:col-span-6 bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                    <h3 className="text-base font-extrabold text-[#0F1E4A] mb-2">⏱️ Recent Activity</h3>
                    <p className="text-xs text-slate-400 font-medium mb-6">Latest events in the music school.</p>
                    <div className="space-y-4">
                      {[
                        { desc: 'New Piano Booking registered', detail: 'Aarav Mehta booked Piano Beginner', time: '10 mins ago', icon: '📅' },
                        { desc: 'Workshop Created successfully', detail: 'Classical Piano Masterclass initialized', time: '1 hour ago', icon: '🎤' },
                        { desc: 'Recording Uploaded to library', detail: 'Piano Posture alignment video published', time: '3 hours ago', icon: '🎥' },
                        { desc: 'New Student Registered', detail: 'Kabir Kapoor registered for Vocals', time: '1 day ago', icon: '👨‍🎓' },
                        { desc: 'Course Price Updated', detail: 'Guitar Beginner price adjusted to ₹4,999', time: '2 days ago', icon: '💰' }
                      ].map((act, i) => (
                        <div key={i} className="flex gap-4 items-start text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                          <span className="text-base shrink-0 bg-slate-50 p-2.5 rounded-xl">{act.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-[#0F1E4A] leading-tight">{act.desc}</p>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{act.detail}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold text-right shrink-0 mt-0.5">{act.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COURSES */}
            {activeTab === 'courses' && (
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-[#E6EEFF] pb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#0F1E4A]">Active Instruments & Pricing</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Manage active instruments and pricing configurations</p>
                  </div>
                  <button
                    onClick={() => setIsAddCourseOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1E4A] text-white hover:bg-[#1a2d61] active:scale-[0.98] transition-all text-xs font-bold rounded-2xl shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Course
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="p-4">Course Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Level</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Instructor</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id} className="border-b border-slate-50 hover:bg-[#FAFBFF] text-xs font-bold text-slate-600 transition-colors">
                          <td className="p-4 text-[#0F1E4A] font-extrabold">{course.title}</td>
                          <td className="p-4 capitalize">{course.category}</td>
                          <td className="p-4">
                            <span className="bg-[#EFF6FF] text-[#5EA8FF] px-2.5 py-0.5 rounded-lg text-[9px] uppercase font-black">
                              {course.level}
                            </span>
                          </td>
                          <td className="p-4 text-[#5EA8FF] font-black">₹{course.price.toLocaleString('en-IN')}</td>
                          <td className="p-4">{course.instructor}</td>
                          <td className="p-4 text-slate-400">{course.duration}</td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setEditingCourse(course)
                                setNewPrice(course.price)
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-[#E6EEFF] border border-[#E6EEFF] rounded-xl text-[11px] font-extrabold text-[#0F1E4A] transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" /> Edit Price
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: STUDENTS */}
            {activeTab === 'students' && (
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0F1E4A]">Student Registry</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Directory of all currently enrolled learners</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Course Enrolled</th>
                        <th className="p-4">Date Joined</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudents.map((stud, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-[#FAFBFF] text-xs font-bold text-slate-600 transition-colors">
                          <td className="p-4 text-[#0F1E4A] font-extrabold">{stud.name}</td>
                          <td className="p-4 text-slate-500">{stud.email}</td>
                          <td className="p-4 text-[#0F1E4A]">{stud.course}</td>
                          <td className="p-4 text-slate-400">{stud.joined}</td>
                          <td className="p-4">
                            <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black">
                              {stud.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: INSTRUCTORS */}
            {activeTab === 'instructors' && (
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0F1E4A]">Instructor Registry</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Assigned educators and course directors</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-[#E6EEFF] rounded-[20px] p-6 bg-[#FAFBFF] flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-extrabold text-lg shadow">
                      AA
                    </div>
                    <div>
                      <span className="bg-[#FFD6E8] text-[#FF6FAF] text-[9px] font-black px-2 py-0.5 rounded-lg">Director</span>
                      <h3 className="font-extrabold text-base text-[#0F1E4A] mt-1">Ajinkya Amrule</h3>
                      <p className="text-xs font-bold text-slate-500">Super Admin & Master Instructor</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2">Specialties: Piano, Guitar, Vocals</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0F1E4A]">Student Bookings</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Track and authorize demo slots and regular batch bookings</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Instructor</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Batch</th>
                        <th className="p-4">Time Slot</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id} className="border-b border-slate-50 hover:bg-[#FAFBFF] text-xs font-bold text-slate-600 transition-colors">
                          <td className="p-4 text-[#0F1E4A] font-extrabold">{b.studentName}</td>
                          <td className="p-4 text-[#0F1E4A]">{b.courseName}</td>
                          <td className="p-4">{b.instructor}</td>
                          <td className="p-4 text-slate-400">{b.date}</td>
                          <td className="p-4 capitalize">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              b.batchTiming === 'morning' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                            }`}>
                              {b.batchTiming}
                            </span>
                          </td>
                          <td className="p-4 text-[#5EA8FF]">{b.timeSlot}</td>
                          <td className="p-4">
                            <span className="bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: WORKSHOPS */}
            {activeTab === 'workshops' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                {/* Add Workshop Form */}
                <div className="lg:col-span-1 bg-white border border-[#E6EEFF] rounded-[24px] p-6 h-fit space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                  <h2 className="text-base font-extrabold text-[#0F1E4A] border-b border-[#E6EEFF] pb-2">Add Special Workshop</h2>
                  <form onSubmit={handleAddWorkshop} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Workshop Title</label>
                      <input
                        type="text"
                        value={workshopTitle}
                        onChange={(e) => setWorkshopTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Instructor Name</label>
                      <input
                        type="text"
                        value={workshopInstructor}
                        onChange={(e) => setWorkshopInstructor(e.target.value)}
                        placeholder="Ajinkya Amrule"
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                        <input
                          type="date"
                          value={workshopDate}
                          onChange={(e) => setWorkshopDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Price (INR)</label>
                        <input
                          type="number"
                          value={workshopPrice}
                          onChange={(e) => setWorkshopPrice(Number(e.target.value))}
                          className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Time Duration</label>
                      <input
                        type="text"
                        value={workshopTime}
                        onChange={(e) => setWorkshopTime(e.target.value)}
                        placeholder="e.g. 10:00 AM - 12:00 PM"
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea
                        value={workshopDesc}
                        onChange={(e) => setWorkshopDesc(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        rows={3}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-xs font-extrabold rounded-xl"
                    >
                      Create Workshop
                    </button>
                  </form>
                </div>

                {/* Upcoming Workshops */}
                <div className="lg:col-span-2 bg-white border border-[#E6EEFF] rounded-[24px] p-6 space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                  <h2 className="text-base font-extrabold text-[#0F1E4A] border-b border-[#E6EEFF] pb-2">Upcoming Special Workshops</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workshops.map(w => (
                      <div key={w.id} className="p-5 border border-[#E6EEFF] bg-[#FAFBFF] rounded-[20px] space-y-3 hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
                        <h3 className="font-extrabold text-[#0F1E4A] text-sm leading-tight">{w.title}</h3>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Instructor: {w.instructor}</p>
                        <div className="flex justify-between text-[11px] font-bold text-slate-500">
                          <span>{w.date}</span>
                          <span>{w.time}</span>
                        </div>
                        <p className="text-base font-black text-[#5EA8FF]">₹{w.price.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">{w.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RECORDED SESSIONS */}
            {activeTab === 'recorded' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                {/* YouTube Link Form */}
                <div className="lg:col-span-1 bg-white border border-[#E6EEFF] rounded-[24px] p-6 h-fit space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                  <h2 className="text-base font-extrabold text-[#0F1E4A] border-b border-[#E6EEFF] pb-2">Upload YouTube Video</h2>
                  <form onSubmit={handleAddVideo} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Video Title</label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">YouTube Link / URL</label>
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Instrument Category</label>
                      <select
                        value={videoInstrument}
                        onChange={(e) => setVideoInstrument(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                      >
                        <option value="piano">Piano</option>
                        <option value="guitar">Guitar</option>
                        <option value="drums">Drums</option>
                        <option value="vocals">Vocals</option>
                        <option value="violin">Violin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Brief Description</label>
                      <textarea
                        value={videoDesc}
                        onChange={(e) => setVideoDesc(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        rows={2}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-xs font-extrabold rounded-xl"
                    >
                      Publish Video
                    </button>
                  </form>
                </div>

                {/* Video Directory Grid */}
                <div className="lg:col-span-2 bg-white border border-[#E6EEFF] rounded-[24px] p-6 space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                  <h2 className="text-base font-extrabold text-[#0F1E4A] border-b border-[#E6EEFF] pb-2">Recorded Sessions Library</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recordedSessions.map(v => (
                      <div key={v.id} className="border border-[#E6EEFF] rounded-[20px] overflow-hidden bg-[#FAFBFF] shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-video">
                          <iframe
                            src={v.url}
                            title={v.title}
                            className="w-full h-full border-none"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-4 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-sm text-[#0F1E4A] leading-tight truncate mr-2">{v.title}</h4>
                            <span className="bg-[#EFF6FF] text-[#5EA8FF] text-[8px] uppercase font-black px-2 py-0.5 rounded-lg shrink-0">
                              {v.instrument}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{v.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS (Includes Integrations, Operating Hours, and Holidays Planner) */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* WhatsApp Connection Toggles */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-4">
                    <h3 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 text-sm pb-2 border-b border-[#E6EEFF]">
                      <Sliders className="w-4 h-4 text-[#5EA8FF]" /> WhatsApp & Chatbot Prefs
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">WhatsApp Notification API</span>
                      <button
                        onClick={() => setWhatsappConnected(!whatsappConnected)}
                        className={`px-4 py-2 text-[10px] font-extrabold uppercase rounded-xl transition-all ${
                          whatsappConnected ? 'bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {whatsappConnected ? 'Connected' : 'Disconnected'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">AI Student Assistant Chatbot</span>
                      <button
                        onClick={() => setChatbotActive(!chatbotActive)}
                        className={`px-4 py-2 text-[10px] font-extrabold uppercase rounded-xl transition-all ${
                          chatbotActive ? 'bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {chatbotActive ? 'Active' : 'Offline'}
                      </button>
                    </div>
                  </div>

                  {/* Batch operating Hours */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-4">
                    <h3 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 text-sm pb-2 border-b border-[#E6EEFF]">
                      <Clock className="w-4.5 h-4.5 text-[#5EA8FF]" /> Operating Hours Configuration
                    </h3>
                    <form onSubmit={handleUpdateTimings} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Morning Start</label>
                          <input
                            type="text"
                            value={morningStart}
                            onChange={(e) => setMorningStart(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Morning End</label>
                          <input
                            type="text"
                            value={morningEnd}
                            onChange={(e) => setMorningEnd(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Evening Start</label>
                          <input
                            type="text"
                            value={eveningStart}
                            onChange={(e) => setEveningStart(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Evening End</label>
                          <input
                            type="text"
                            value={eveningEnd}
                            onChange={(e) => setEveningEnd(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Update Timings
                      </button>
                    </form>
                  </div>
                </div>

                {/* Holiday Planner Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Mark holiday */}
                  <div className="lg:col-span-1 bg-white border border-[#E6EEFF] rounded-[24px] p-6 h-fit space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                    <h3 className="font-extrabold text-[#0F1E4A] text-sm pb-2 border-b border-[#E6EEFF]">
                      Mark School Holiday
                    </h3>
                    <form onSubmit={handleAddHoliday} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="weekly"
                          checked={isWeeklyHoliday}
                          onChange={(e) => setIsWeeklyHoliday(e.target.checked)}
                          className="w-4 h-4 rounded text-[#5EA8FF] focus:ring-[#5EA8FF]"
                        />
                        <label htmlFor="weekly" className="text-xs font-bold text-[#0F1E4A] cursor-pointer">Weekly Recurring Holiday</label>
                      </div>

                      {isWeeklyHoliday ? (
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Select Day</label>
                          <select
                            value={weeklyDay}
                            onChange={(e) => setWeeklyDay(Number(e.target.value))}
                            className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          >
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                            <option value={0}>Sunday</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Select Date</label>
                          <input
                            type="date"
                            value={holidayDate}
                            onChange={(e) => setHolidayDate(e.target.value)}
                            className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Reason</label>
                        <input
                          type="text"
                          value={holidayReason}
                          onChange={(e) => setHolidayReason(e.target.value)}
                          placeholder="e.g. Christmas Day"
                          className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white font-extrabold text-xs rounded-xl"
                      >
                        Add Holiday
                      </button>
                    </form>
                  </div>

                  {/* Active holidays list */}
                  <div className="lg:col-span-2 bg-white border border-[#E6EEFF] rounded-[24px] p-6 space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                    <h3 className="font-extrabold text-[#0F1E4A] text-sm pb-2 border-b border-[#E6EEFF]">
                      Active Holidays Calendar
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                            <th className="p-3">Type</th>
                            <th className="p-3">Date / Day</th>
                            <th className="p-3">Reason</th>
                            <th className="p-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holidays.map(h => (
                            <tr key={h.id} className="border-b border-slate-50 text-xs font-bold text-slate-600 hover:bg-[#FAFBFF] transition-colors">
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                  h.isRecurringWeekly ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                  {h.isRecurringWeekly ? 'Weekly' : 'Single'}
                                </span>
                              </td>
                              <td className="p-3 text-[#0F1E4A]">
                                {h.isRecurringWeekly 
                                  ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][h.dayOfWeek || 0]
                                  : h.date}
                              </td>
                              <td className="p-3 text-slate-400">{h.reason}</td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleDeleteHoliday(h.id)}
                                  className="text-red-400 hover:text-red-600 border border-transparent p-1.5 rounded-xl hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL: ADD SIMULATED COURSE */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-md border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Add New Course</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Register a new instrument and starting price parameters.</p>
            </div>
            
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Drums Intermediate"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                  >
                    <option value="piano">Piano</option>
                    <option value="guitar">Guitar</option>
                    <option value="drums">Drums</option>
                    <option value="vocals">Vocals</option>
                    <option value="violin">Violin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Level</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Price (INR)</label>
                  <input
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Duration</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddCourseOpen(false)}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE WORKSHOP */}
      {isAddWorkshopOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-md border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Create New Workshop</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Register a special upcoming masterclass session.</p>
            </div>
            
            <form onSubmit={handleAddWorkshop} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Workshop Title</label>
                <input
                  type="text"
                  value={workshopTitle}
                  onChange={(e) => setWorkshopTitle(e.target.value)}
                  placeholder="e.g. Blues Rhythm Masterclass"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Instructor Name</label>
                <input
                  type="text"
                  value={workshopInstructor}
                  onChange={(e) => setWorkshopInstructor(e.target.value)}
                  placeholder="Ajinkya Amrule"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={workshopDate}
                    onChange={(e) => setWorkshopDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Price (INR)</label>
                  <input
                    type="number"
                    value={workshopPrice}
                    onChange={(e) => setWorkshopPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Time Duration</label>
                <input
                  type="text"
                  value={workshopTime}
                  onChange={(e) => setWorkshopTime(e.target.value)}
                  placeholder="e.g. 02:00 PM - 04:00 PM"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  value={workshopDesc}
                  onChange={(e) => setWorkshopDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddWorkshopOpen(false)}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Create Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE COURSE PRICE */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-md border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Edit Course Price</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Update pricing parameters for: <strong className="text-[#5EA8FF]">{editingCourse.title}</strong></p>
            </div>
            
            <form onSubmit={handleUpdatePrice} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Price (INR)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white text-xs font-bold rounded-xl transition-all"
                >
                  Save Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
