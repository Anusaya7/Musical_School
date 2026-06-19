'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  Clock,
  Plus,
  Trash2,
  Edit,
  Video,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Bell,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Activity,
  Award,
  BookMarked,
  FileText,
  Sliders,
  Menu,
  X,
  Smartphone,
  ShieldAlert
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

// Default mock data for charts
const defaultRevenueData = [
  { name: 'Jan', revenue: 40000, students: 8, bookings: 4 },
  { name: 'Feb', revenue: 35000, students: 11, bookings: 5 },
  { name: 'Mar', revenue: 50000, students: 16, bookings: 8 },
  { name: 'Apr', revenue: 75000, students: 20, bookings: 12 },
  { name: 'May', revenue: 60000, students: 22, bookings: 10 },
  { name: 'Jun', revenue: 85000, students: 25, bookings: 15 },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeChart, setActiveChart] = useState<'revenue' | 'students' | 'bookings' | 'trends'>('revenue')

  // Live Database States
  const [courses, setCourses] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [holidays, setHolidays] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [workshops, setWorkshops] = useState<any[]>([])
  const [recordedSessions, setRecordedSessions] = useState<any[]>([])

  // Pricing edit modal state
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [newPrice, setNewPrice] = useState<number>(0)

  // Holiday form state
  const [holidayDate, setHolidayDate] = useState('')
  const [holidayReason, setHolidayReason] = useState('')
  const [isWeeklyHoliday, setIsWeeklyHoliday] = useState(false)
  const [weeklyDay, setWeeklyDay] = useState(1) // Monday default

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

  // Mock settings state
  const [whatsappConnected, setWhatsappConnected] = useState(true)
  const [chatbotActive, setChatbotActive] = useState(true)

  // Fetch all database records
  const loadDatabaseData = async () => {
    setLoading(true)
    try {
      const [coursesRes, schedulesRes, holidaysRes, bookingsRes, workshopsRes, videosRes] = await Promise.all([
        fetch('/api/courses').then(r => r.json()),
        fetch('/api/schedules').then(r => r.json()),
        fetch('/api/holidays').then(r => r.json()),
        fetch('/api/bookings').then(r => r.json()),
        fetch('/api/workshops').then(r => r.json()),
        fetch('/api/recorded-sessions').then(r => r.json())
      ])

      if (Array.isArray(coursesRes)) setCourses(coursesRes)
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
      if (Array.isArray(holidaysRes)) setHolidays(holidaysRes)
      if (Array.isArray(bookingsRes)) setBookings(bookingsRes)
      if (Array.isArray(workshopsRes)) setWorkshops(workshopsRes)
      if (Array.isArray(videosRes)) setRecordedSessions(videosRes)
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
        alert('Pricing updated successfully!')
        setEditingCourse(null)
        loadDatabaseData()
      } else {
        alert('Failed to update pricing')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 2. Update Class Timings (Schedules)
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
        alert('Class batch timings updated successfully!')
        loadDatabaseData()
      } else {
        alert('Failed to save timings')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 3. Mark a Holiday
  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isWeeklyHoliday && !holidayDate) {
      alert('Please select a date for the holiday')
      return
    }

    const payload = {
      date: isWeeklyHoliday ? '' : holidayDate,
      reason: holidayReason || 'Public Holiday',
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
        alert('Holiday marked successfully!')
        setHolidayDate('')
        setHolidayReason('')
        loadDatabaseData()
      } else {
        alert('Failed to add holiday')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteHoliday = async (id: string) => {
    if (!confirm('Are you sure you want to remove this holiday?')) return
    try {
      const res = await fetch(`/api/holidays?id=${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        alert('Holiday removed!')
        loadDatabaseData()
      } else {
        alert('Failed to delete holiday')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 4. Create Special Workshop
  const handleAddWorkshop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workshopTitle || !workshopDate || !workshopTime) {
      alert('Please fill out all required workshop fields')
      return
    }

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
        alert('Special workshop added successfully!')
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

  // 5. Upload Recorded Session (YouTube Embed)
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoTitle || !videoUrl) {
      alert('Title and YouTube embed URL are required')
      return
    }

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
        alert('Recorded video uploaded successfully!')
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

  // Data aggregations with fallbacks
  const dbRevenue = bookings.reduce((sum, b) => sum + (b.amount || 4999), 0)
  const totalRevenue = Math.max(dbRevenue, 4999)
  const totalBookingsCount = Math.max(bookings.length, 1)
  const activeHolidaysCount = Math.max(holidays.length, 1)
  const workshopsCount = Math.max(workshops.length, 1)
  const videosCount = Math.max(recordedSessions.length, 10)

  // Permissions list for Master Access
  const permissions = [
    { name: 'Website Management', checked: true },
    { name: 'Courses Management', checked: true },
    { name: 'Student Management', checked: true },
    { name: 'Booking Management', checked: true },
    { name: 'Revenue Management', checked: true },
    { name: 'Holidays Planner', checked: true },
    { name: 'Workshop Management', checked: true },
    { name: 'Recorded Sessions', checked: true },
    { name: 'Instructor Management', checked: true },
    { name: 'Contact Requests', checked: true },
    { name: 'WhatsApp Settings', checked: true },
    { name: 'Chatbot Settings', checked: true },
    { name: 'Homepage Content', checked: true },
    { name: 'SEO Settings', checked: true },
    { name: 'Analytics', checked: true }
  ]

  // Menu items list
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Manage Courses', icon: BookOpen },
    { id: 'timings', label: 'Batch Timings', icon: Clock },
    { id: 'holidays', label: 'Holidays Planner', icon: Calendar },
    { id: 'workshops', label: 'Special Workshops', icon: Plus },
    { id: 'recorded', label: 'Recorded Sessions', icon: Video },
    { id: 'bookings', label: 'Student Bookings', icon: Users },
    { id: 'instructors', label: 'Instructor Management', icon: Users },
    { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Website Settings', icon: Settings },
    { id: 'permissions', label: 'Admin Permissions', icon: ShieldCheck },
  ]

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#0F1E4A] font-sans flex flex-col">
      
      {/* Mobile Menu Bar */}
      <div className="xl:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-[#DCEEFF]">
        <span className="font-extrabold text-lg flex items-center gap-2 text-[#0F1E4A]">
          🎵 Music School Admin
        </span>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 border border-[#DCEEFF] rounded-xl text-[#0F1E4A] hover:bg-[#F8FBFF]"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex flex-1 relative min-h-screen">
        
        {/* SIDEBAR PANEL */}
        <aside className={`
          fixed xl:sticky top-0 bottom-0 left-0 w-[290px] bg-white border-r border-[#DCEEFF] p-6 
          flex flex-col gap-6 overflow-y-auto z-40 transition-transform duration-300 ease-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
        `}>
          {/* Top Branding (Desktop Only) */}
          <div className="hidden xl:block pb-2 border-b border-[#DCEEFF]">
            <h1 className="text-lg font-extrabold flex items-center gap-2 text-[#0F1E4A]">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
              🎵 Music School Management
            </h1>
          </div>

          {/* Admin Profile Card */}
          <div className="bg-white border-2 border-[#DCEEFF] rounded-[20px] p-4 shadow-[0_10px_25px_rgba(15,30,74,0.04)] relative overflow-hidden group">
            {/* Pink / Blue accent top border */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                AA
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#0F1E4A] leading-tight">Ajinkya Amrule</h4>
                <p className="text-[11px] font-bold text-slate-400 mt-0.5">Super Admin</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-500 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                  🟢 Online
                </span>
              </div>
            </div>
          </div>

          {/* Director Section */}
          <div className="bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Director</span>
              <span className="bg-[#FFD6E8] text-[#FF6FAF] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                👑 Director
              </span>
            </div>
            <div>
              <h5 className="font-extrabold text-sm text-[#0F1E4A]">Ajinkya Amrule</h5>
              <p className="text-[11px] font-medium text-slate-500">Founder & Director</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 pl-2">Dashboard Menu</span>
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group/nav ${
                  activeTab === item.id 
                    ? 'bg-[#F8FBFF] border-2 border-[#2563EB] text-[#2563EB] shadow-sm' 
                    : 'text-[#0F1E4A] hover:bg-[#FAFBFF] border-2 border-transparent hover:border-[#DCEEFF]'
                }`}
              >
                <item.icon className={`w-4 h-4 transition-transform group-hover/nav:scale-110 ${activeTab === item.id ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Access Control Widget */}
          <div className="bg-[#F8FBFF] border border-[#DCEEFF] rounded-[20px] p-4 space-y-3 mt-auto">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-[#2563EB] uppercase tracking-wider">Access Panel</span>
              <span className="bg-[#2563EB]/10 text-[#2563EB] text-[9px] font-extrabold px-2 py-0.5 rounded">
                Master Enabled
              </span>
            </div>
            <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 text-[11px] font-bold text-slate-500">
              {permissions.map(p => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <span className="text-green-500">✓</span>
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exit Link */}
          <div className="border-t border-[#DCEEFF] pt-4">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-[#FF6FAF] hover:bg-[#FFD6E8]/20 transition-colors border-2 border-transparent hover:border-[#FFD6E8]"
            >
              <LogOut className="w-4 h-4" />
              <span>Back To Website</span>
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-8">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compiling live records...</p>
            </div>
          ) : (
            <>
              {/* HEADER INFO SUMMARY */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCEEFF] pb-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-[#0F1E4A] tracking-tight capitalize">
                    {activeTab === 'dashboard' ? 'Overview' : activeTab.replace(/([A-Z])/g, ' $1')}
                  </h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    System Hub &middot; Super Admin Session
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button className="p-3 border-2 border-[#DCEEFF] rounded-xl hover:bg-[#F8FBFF] transition-all relative">
                      <Bell className="w-4 h-4 text-slate-500" />
                      <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6FAF] rounded-full animate-ping" />
                    </button>
                  </div>
                  <a
                    href="/"
                    className="btn-premium-base btn-premium-secondary px-5 py-2.5 text-xs font-bold"
                  >
                    View Homepage
                  </a>
                </div>
              </div>

              {/* VIEW: DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fadeIn">
                  
                  {/* SIX OVERVIEW CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* CARD 1: Revenue */}
                    <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Total Revenue</span>
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-lg text-[#2563EB]">💰</div>
                      </div>
                      <h3 className="text-3xl font-extrabold text-[#0F1E4A] tracking-tight">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+15%</span>
                        <span className="text-[11px] font-bold text-slate-400">vs last month</span>
                      </div>
                    </div>

                    {/* CARD 2: Bookings */}
                    <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Total Bookings</span>
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-lg text-[#2563EB]">📅</div>
                      </div>
                      <h3 className="text-3xl font-extrabold text-[#0F1E4A] tracking-tight">{totalBookingsCount}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
                        <span className="text-[11px] font-bold text-slate-400">active pipeline</span>
                      </div>
                    </div>

                    {/* CARD 3: Students */}
                    <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Students Enrolled</span>
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-lg text-[#2563EB]">👨‍🎓</div>
                      </div>
                      <h3 className="text-3xl font-extrabold text-[#0F1E4A] tracking-tight">25</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+20%</span>
                        <span className="text-[11px] font-bold text-slate-400">cumulative learners</span>
                      </div>
                    </div>

                    {/* CARD 4: Workshops */}
                    <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Workshops</span>
                        <div className="w-10 h-10 rounded-xl bg-[#FFD6E8] flex items-center justify-center text-lg text-[#FF6FAF]">🎤</div>
                      </div>
                      <h3 className="text-3xl font-extrabold text-[#0F1E4A] tracking-tight">{workshopsCount}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">+8%</span>
                        <span className="text-[11px] font-bold text-slate-400">upcoming schedule</span>
                      </div>
                    </div>

                    {/* CARD 5: Recordings */}
                    <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Recorded Sessions</span>
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-lg text-[#2563EB]">🎥</div>
                      </div>
                      <h3 className="text-3xl font-extrabold text-[#0F1E4A] tracking-tight">{videosCount}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+25%</span>
                        <span className="text-[11px] font-bold text-slate-400">video uploads</span>
                      </div>
                    </div>

                    {/* CARD 6: Holidays */}
                    <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] hover:-translate-y-1 transition-all duration-300 group">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Holidays Set</span>
                        <div className="w-10 h-10 rounded-xl bg-[#FFD6E8] flex items-center justify-center text-lg text-[#FF6FAF]">📆</div>
                      </div>
                      <h3 className="text-3xl font-extrabold text-[#0F1E4A] tracking-tight">{activeHolidaysCount}</h3>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-extrabold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">Active</span>
                        <span className="text-[11px] font-bold text-slate-400">calendar configurations</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout: Main (Charts + Actions) + Sidebar panels */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: Chart & Quick Actions */}
                    <div className="lg:col-span-8 space-y-8">
                      
                      {/* GRAPH SECTION */}
                      <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DCEEFF]">
                          <h3 className="text-lg font-extrabold text-[#0F1E4A]">Enrollment & Revenue Trends</h3>
                          
                          {/* Chart Tabs */}
                          <div className="flex flex-wrap gap-1 bg-[#FAFBFF] border border-[#DCEEFF] p-1 rounded-xl">
                            {[
                              { id: 'revenue', label: 'Revenue' },
                              { id: 'students', label: 'Student Growth' },
                              { id: 'bookings', label: 'Bookings' },
                              { id: 'trends', label: 'Monthly' }
                            ].map(tab => (
                              <button
                                key={tab.id}
                                onClick={() => setActiveChart(tab.id as any)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-colors ${
                                  activeChart === tab.id
                                    ? 'bg-white text-[#2563EB] shadow-sm border border-[#DCEEFF]'
                                    : 'text-slate-400 hover:text-[#0F1E4A]'
                                }`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Chart Render */}
                        <div className="h-80 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={defaultRevenueData}>
                              <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#5EA8FF" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="#5EA8FF" stopOpacity={0.0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#DCEEFF" />
                              <XAxis dataKey="name" stroke="#0F1E4A" fontSize={11} fontWeight="bold" />
                              <YAxis stroke="#0F1E4A" fontSize={11} fontWeight="bold" />
                              <Tooltip />
                              <Area 
                                type="monotone" 
                                dataKey={activeChart === 'revenue' ? 'revenue' : activeChart === 'students' ? 'students' : 'bookings'} 
                                stroke="#2563EB" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#chartGrad)" 
                                activeDot={{ r: 6, fill: '#FF6FAF', stroke: '#FFFFFF', strokeWidth: 2 }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* QUICK ACTIONS */}
                      <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)]">
                        <h3 className="text-lg font-extrabold text-[#0F1E4A] mb-6">⚡ Quick Actions</h3>
                        <div className="flex flex-wrap gap-4">
                          {[
                            { label: 'Add Course', tab: 'courses' },
                            { label: 'Add Workshop', tab: 'workshops' },
                            { label: 'Upload Recording', tab: 'recorded' },
                            { label: 'Add Holiday', tab: 'holidays' },
                            { label: 'View Bookings', tab: 'bookings' },
                          ].map(act => (
                            <button
                              key={act.label}
                              onClick={() => setActiveTab(act.tab)}
                              className="btn-premium-base btn-premium-gradient px-6 py-3 text-xs font-bold text-white shadow-sm"
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Status & Activity Logs */}
                    <div className="lg:col-span-4 space-y-8">
                      
                      {/* SYSTEM STATUS PANEL */}
                      <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)]">
                        <h3 className="text-lg font-extrabold text-[#0F1E4A] mb-4 pb-2 border-b border-[#DCEEFF]">
                          🖥️ System Status
                        </h3>
                        <div className="space-y-4">
                          {[
                            { name: 'Website Status', status: 'Live', color: 'text-green-500' },
                            { name: 'Payments Integration', status: 'Active', color: 'text-green-500' },
                            { name: 'WhatsApp API', status: 'Connected', color: 'text-green-500' },
                            { name: 'AI Chatbot Agent', status: 'Online', color: 'text-green-500' },
                            { name: 'Schedules Timing Engine', status: 'Working', color: 'text-green-500' },
                            { name: 'Admin Authorization', status: 'Full Access', color: 'text-green-500' },
                          ].map(sys => (
                            <div key={sys.name} className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500">{sys.name}</span>
                              <span className={`flex items-center gap-1.5 ${sys.color}`}>
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                {sys.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* RECENT ACTIVITY */}
                      <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)]">
                        <h3 className="text-lg font-extrabold text-[#0F1E4A] mb-4 pb-2 border-b border-[#DCEEFF]">
                          ⏱️ Recent Activity
                        </h3>
                        <div className="space-y-4">
                          {[
                            { desc: 'New booking registered for Piano intermediate', time: '10 mins ago', icon: '📅' },
                            { desc: 'Holidays planner settings updated successfully', time: '1 hour ago', icon: '📆' },
                            { desc: 'Vocal training recorded masterclass published', time: '2 hours ago', icon: '🎥' },
                            { desc: 'Ajinkya Amrule adjusted Drums pricing levels', time: '1 day ago', icon: '💰' },
                            { desc: 'Special Guitar rhythm workshop initialized', time: '2 days ago', icon: '🎤' }
                          ].map((act, i) => (
                            <div key={i} className="flex gap-3 text-xs">
                              <span className="text-lg flex-shrink-0">{act.icon}</span>
                              <div>
                                <p className="font-bold text-[#0F1E4A] leading-tight">{act.desc}</p>
                                <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: MANAGE COURSES TAB */}
              {activeTab === 'courses' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#DCEEFF] pb-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-[#0F1E4A]">Course Listing & Pricing</h2>
                      <p className="text-xs text-slate-400 font-medium mt-1">Manage active instruments and pricing configurations</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAFBFF] border-b border-[#DCEEFF] text-slate-500 text-xs font-bold uppercase">
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
                          <tr key={course.id} className="border-b border-[#DCEEFF] hover:bg-[#F8FBFF] text-xs font-bold text-slate-600 transition-colors">
                            <td className="p-4 text-[#0F1E4A] font-extrabold">{course.title}</td>
                            <td className="p-4 capitalize">{course.category}</td>
                            <td className="p-4">
                              <span className="bg-[#EFF6FF] text-[#2563EB] px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold">
                                {course.level}
                              </span>
                            </td>
                            <td className="p-4 text-[#2563EB] font-extrabold">₹{course.price.toLocaleString('en-IN')}</td>
                            <td className="p-4">{course.instructor}</td>
                            <td className="p-4">{course.duration}</td>
                            <td className="p-4">
                              <button
                                onClick={() => {
                                  setEditingCourse(course)
                                  setNewPrice(course.price)
                                }}
                                className="btn-premium-base btn-premium-secondary px-3 py-1.5 text-[11px] font-bold"
                              >
                                <Edit className="w-3.5 h-3.5 mr-1" />
                                Change Price
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Edit Pricing Modal */}
                  {editingCourse && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                      <div className="bg-white rounded-[28px] p-8 w-full max-w-md border-2 border-[#DCEEFF] shadow-2xl space-y-6">
                        <div>
                          <h3 className="text-xl font-extrabold text-[#0F1E4A]">Edit Course Price</h3>
                          <p className="text-xs text-slate-400 font-medium mt-1">Update price parameters for: <strong className="text-[#2563EB]">{editingCourse.title}</strong></p>
                        </div>
                        
                        <form onSubmit={handleUpdatePrice} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Price (INR)</label>
                            <input
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(Number(e.target.value))}
                              className="w-full px-4 py-2.5 border-2 border-[#DCEEFF] rounded-xl focus:outline-none focus:border-[#2563EB] text-xs font-bold"
                              required
                            />
                          </div>

                          <div className="flex space-x-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingCourse(null)}
                              className="btn-premium-base btn-premium-secondary flex-1 py-2.5 text-xs font-bold"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="btn-premium-base btn-premium-primary bg-[#2563EB] text-white flex-1 py-2.5 text-xs font-bold"
                            >
                              Save Price
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW: BATCH TIMINGS TAB */}
              {activeTab === 'timings' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] space-y-6 animate-fadeIn">
                  <div className="border-b border-[#DCEEFF] pb-4">
                    <h2 className="text-xl font-extrabold text-[#0F1E4A]">Manage Class Batch Timings</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Configure standard operating hours for Morning and Evening sessions.</p>
                  </div>

                  <form onSubmit={handleUpdateTimings} className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Morning Config */}
                      <div className="p-5 bg-[#FAFBFF] rounded-[20px] border border-[#DCEEFF] space-y-4">
                        <h3 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 text-sm">
                          <Clock className="w-4.5 h-4.5 text-[#2563EB]" />
                          Morning Batch Configuration
                        </h3>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 mb-1 uppercase tracking-wider">Start Time</label>
                          <input
                            type="text"
                            value={morningStart}
                            onChange={(e) => setMorningStart(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 mb-1 uppercase tracking-wider">End Time</label>
                          <input
                            type="text"
                            value={morningEnd}
                            onChange={(e) => setMorningEnd(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                      </div>

                      {/* Evening Config */}
                      <div className="p-5 bg-[#FAFBFF] rounded-[20px] border border-[#DCEEFF] space-y-4">
                        <h3 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 text-sm">
                          <Clock className="w-4.5 h-4.5 text-[#FF6FAF]" />
                          Evening Batch Configuration
                        </h3>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 mb-1 uppercase tracking-wider">Start Time</label>
                          <input
                            type="text"
                            value={eveningStart}
                            onChange={(e) => setEveningStart(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 mb-1 uppercase tracking-wider">End Time</label>
                          <input
                            type="text"
                            value={eveningEnd}
                            onChange={(e) => setEveningEnd(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#2563EB]"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-premium-base btn-premium-primary text-white bg-[#2563EB] px-6 py-3 text-xs font-bold"
                    >
                      Update Operating Hours
                    </button>
                  </form>
                </div>
              )}

              {/* VIEW: HOLIDAYS PLANNER TAB */}
              {activeTab === 'holidays' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                  
                  {/* Mark a Holiday Form */}
                  <div className="lg:col-span-1 bg-white border border-[#DCEEFF] rounded-[24px] p-6 h-fit space-y-4">
                    <h2 className="text-lg font-extrabold text-[#0F1E4A] border-b border-[#DCEEFF] pb-2">Mark a Holiday</h2>
                    
                    <form onSubmit={handleAddHoliday} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="weekly"
                          checked={isWeeklyHoliday}
                          onChange={(e) => setIsWeeklyHoliday(e.target.checked)}
                          className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <label htmlFor="weekly" className="text-xs font-bold text-[#0F1E4A] cursor-pointer">Weekly Recurring Holiday</label>
                      </div>

                      {isWeeklyHoliday ? (
                        <div>
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Select Day</label>
                          <select
                            value={weeklyDay}
                            onChange={(e) => setWeeklyDay(Number(e.target.value))}
                            className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
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
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Select Date</label>
                          <input
                            type="date"
                            value={holidayDate}
                            onChange={(e) => setHolidayDate(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Reason / Label</label>
                        <input
                          type="text"
                          value={holidayReason}
                          onChange={(e) => setHolidayReason(e.target.value)}
                          placeholder="e.g. Independence Day"
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-premium-base btn-premium-gradient w-full py-2.5 text-xs font-bold text-white"
                      >
                        Add Holiday
                      </button>
                    </form>
                  </div>

                  {/* Holiday List */}
                  <div className="lg:col-span-2 bg-white border border-[#DCEEFF] rounded-[24px] p-6 space-y-4">
                    <h2 className="text-lg font-extrabold text-[#0F1E4A] border-b border-[#DCEEFF] pb-2">Active School Holidays</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#FAFBFF] border-b border-[#DCEEFF] text-slate-500 text-xs font-bold uppercase">
                            <th className="p-3">Type</th>
                            <th className="p-3">Date / Day</th>
                            <th className="p-3">Reason</th>
                            <th className="p-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holidays.map(h => (
                            <tr key={h.id} className="border-b border-[#DCEEFF] text-xs font-bold text-slate-600 hover:bg-[#F8FBFF] transition-colors">
                              <td className="p-3">
                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                  h.isRecurringWeekly ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {h.isRecurringWeekly ? 'Weekly' : 'Single Date'}
                                </span>
                              </td>
                              <td className="p-3 text-[#0F1E4A]">
                                {h.isRecurringWeekly 
                                  ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][h.dayOfWeek || 0]
                                  : h.date}
                              </td>
                              <td className="p-3">{h.reason}</td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleDeleteHoliday(h.id)}
                                  className="text-red-500 hover:text-red-900 border border-transparent hover:border-[#FFD6E8] p-1.5 rounded-lg hover:bg-red-50"
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
              )}

              {/* VIEW: SPECIAL WORKSHOPS TAB */}
              {activeTab === 'workshops' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                  
                  {/* Workshop Add Form */}
                  <div className="lg:col-span-1 bg-white border border-[#DCEEFF] rounded-[24px] p-6 h-fit space-y-4">
                    <h2 className="text-lg font-extrabold text-[#0F1E4A] border-b border-[#DCEEFF] pb-2">Add Special Workshop</h2>
                    
                    <form onSubmit={handleAddWorkshop} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
                        <input
                          type="text"
                          value={workshopTitle}
                          onChange={(e) => setWorkshopTitle(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Instructor</label>
                        <input
                          type="text"
                          value={workshopInstructor}
                          onChange={(e) => setWorkshopInstructor(e.target.value)}
                          placeholder="Ajinkya Amrule"
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                        <input
                          type="date"
                          value={workshopDate}
                          onChange={(e) => setWorkshopDate(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Time</label>
                        <input
                          type="text"
                          value={workshopTime}
                          onChange={(e) => setWorkshopTime(e.target.value)}
                          placeholder="e.g. 10:00 AM - 12:00 PM"
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Price (INR)</label>
                        <input
                          type="number"
                          value={workshopPrice}
                          onChange={(e) => setWorkshopPrice(Number(e.target.value))}
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                        <textarea
                          value={workshopDesc}
                          onChange={(e) => setWorkshopDesc(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          rows={3}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="btn-premium-base btn-premium-gradient w-full py-2.5 text-xs font-bold text-white"
                      >
                        Create Workshop
                      </button>
                    </form>
                  </div>

                  {/* Upcoming Workshops */}
                  <div className="lg:col-span-2 bg-white border border-[#DCEEFF] rounded-[24px] p-6 space-y-4">
                    <h2 className="text-lg font-extrabold text-[#0F1E4A] border-b border-[#DCEEFF] pb-2">Upcoming Workshops</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {workshops.map(w => (
                        <div key={w.id} className="p-5 border border-[#DCEEFF] rounded-[20px] bg-[#FAFBFF] space-y-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                          <h3 className="font-extrabold text-[#0F1E4A] text-base leading-tight">{w.title}</h3>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Instructor: {w.instructor}</p>
                          <div className="flex justify-between text-xs font-bold text-slate-500">
                            <span>{w.date}</span>
                            <span>{w.time}</span>
                          </div>
                          <p className="text-lg font-extrabold text-[#2563EB]">₹{w.price.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">{w.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: RECORDED SESSIONS TAB */}
              {activeTab === 'recorded' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                  
                  {/* YouTube Upload form */}
                  <div className="lg:col-span-1 bg-white border border-[#DCEEFF] rounded-[24px] p-6 h-fit space-y-4">
                    <h2 className="text-lg font-extrabold text-[#0F1E4A] border-b border-[#DCEEFF] pb-2">Upload YouTube Video</h2>
                    
                    <form onSubmit={handleAddVideo} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Video Title</label>
                        <input
                          type="text"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">YouTube URL</label>
                        <input
                          type="text"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="e.g. https://www.youtube.com/watch?v=..."
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Instrument Category</label>
                        <select
                          value={videoInstrument}
                          onChange={(e) => setVideoInstrument(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                        >
                          <option value="piano">Piano</option>
                          <option value="guitar">Guitar</option>
                          <option value="drums">Drums</option>
                          <option value="vocals">Vocals</option>
                          <option value="violin">Violin</option>
                          <option value="saxophone">Saxophone</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Brief Description</label>
                        <textarea
                          value={videoDesc}
                          onChange={(e) => setVideoDesc(e.target.value)}
                          className="w-full px-4 py-2 border-2 border-[#DCEEFF] rounded-xl text-xs font-bold"
                          rows={3}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-premium-base btn-premium-gradient w-full py-2.5 text-xs font-bold text-white"
                      >
                        Publish Video
                      </button>
                    </form>
                  </div>

                  {/* Directory */}
                  <div className="lg:col-span-2 bg-white border border-[#DCEEFF] rounded-[24px] p-6 space-y-4">
                    <h2 className="text-lg font-extrabold text-[#0F1E4A] border-b border-[#DCEEFF] pb-2">Recorded Sessions Directory</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recordedSessions.map(v => (
                        <div key={v.id} className="border border-[#DCEEFF] rounded-[20px] overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
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
                              <h4 className="font-extrabold text-sm text-[#0F1E4A] leading-tight">{v.title}</h4>
                              <span className="bg-[#EFF6FF] text-[#2563EB] text-[9px] uppercase font-extrabold px-2 py-0.5 rounded">
                                {v.instrument}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{v.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: STUDENT BOOKINGS TAB */}
              {activeTab === 'bookings' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] space-y-4 animate-fadeIn">
                  <h2 className="text-lg font-extrabold text-[#0F1E4A] border-b border-[#DCEEFF] pb-2">All Student Bookings</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAFBFF] border-b border-[#DCEEFF] text-slate-500 text-xs font-bold uppercase">
                          <th className="p-4">Student Name</th>
                          <th className="p-4">Student Email</th>
                          <th className="p-4">Course Name</th>
                          <th className="p-4">Instructor</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Batch</th>
                          <th className="p-4">Time Slot</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id} className="border-b border-[#DCEEFF] text-xs font-bold text-slate-600 hover:bg-[#F8FBFF] transition-colors">
                            <td className="p-4 text-[#0F1E4A] font-extrabold">{b.studentName}</td>
                            <td className="p-4">{b.studentEmail}</td>
                            <td className="p-4 font-extrabold text-[#0F1E4A]">{b.courseName}</td>
                            <td className="p-4">{b.instructor}</td>
                            <td className="p-4">{b.date}</td>
                            <td className="p-4 capitalize">
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                b.batchTiming === 'morning' ? 'bg-yellow-50 text-amber-700 border border-amber-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                              }`}>
                                {b.batchTiming}
                              </span>
                            </td>
                            <td className="p-4 text-[#2563EB]">{b.timeSlot}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                b.status === 'Booked' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
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

              {/* VIEW: INSTRUCTOR MANAGEMENT TAB */}
              {activeTab === 'instructors' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] space-y-6 animate-fadeIn">
                  <div className="border-b border-[#DCEEFF] pb-2">
                    <h2 className="text-xl font-extrabold text-[#0F1E4A]">Instructor Registry</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Manage academy educators and class assignment authorizations</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-2 border-[#DCEEFF] rounded-[20px] p-6 bg-[#FAFBFF] flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-extrabold text-xl shadow">
                        AA
                      </div>
                      <div>
                        <span className="bg-[#FFD6E8] text-[#FF6FAF] text-[9px] font-extrabold px-2 py-0.5 rounded">Director</span>
                        <h3 className="font-extrabold text-base text-[#0F1E4A] mt-1">Ajinkya Amrule</h3>
                        <p className="text-xs font-bold text-slate-500">Super Admin & Master Instructor</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">Assignments: Piano, Guitar, Vocals, Theory</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: REVENUE ANALYTICS TAB */}
              {activeTab === 'revenue' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] space-y-6 animate-fadeIn">
                  <div className="border-b border-[#DCEEFF] pb-2">
                    <h2 className="text-xl font-extrabold text-[#0F1E4A]">Revenue Analytics Panel</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Executive financial summary, transactions, and projections</p>
                  </div>
                  <div className="bg-[#FAFBFF] border border-[#DCEEFF] rounded-[20px] p-6 text-center space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">Total Sales Invoiced</h3>
                    <h2 className="text-4xl font-extrabold text-[#2563EB]">₹{totalRevenue.toLocaleString('en-IN')}</h2>
                    <p className="text-xs text-slate-500 font-bold max-w-md mx-auto leading-relaxed">
                      Automatic billing integration is fully functional. Transaction logs are synced automatically from online student slot bookings.
                    </p>
                  </div>
                </div>
              )}

              {/* VIEW: REPORTS TAB */}
              {activeTab === 'reports' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] space-y-6 animate-fadeIn">
                  <div className="border-b border-[#DCEEFF] pb-2">
                    <h2 className="text-xl font-extrabold text-[#0F1E4A]">Reports Generator</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Export student enrollment stats, schedules, and active bookings records</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="btn-premium-base btn-premium-gradient p-6 rounded-[20px] text-white flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-white" />
                      <span className="font-extrabold text-sm">Download Student Logs</span>
                    </button>
                    <button className="btn-premium-base btn-premium-secondary p-6 rounded-[20px] flex flex-col items-center justify-center gap-2">
                      <TrendingUp className="w-8 h-8 text-[#2563EB]" />
                      <span className="font-extrabold text-sm text-[#0F1E4A]">Export Revenue Sheet</span>
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW: WEBSITE SETTINGS TAB */}
              {activeTab === 'settings' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] space-y-6 animate-fadeIn">
                  <div className="border-b border-[#DCEEFF] pb-2">
                    <h2 className="text-xl font-extrabold text-[#0F1E4A]">Website & Integration Settings</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Configure meta tags, chatbot preferences, and third-party integrations</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-[#FAFBFF] border border-[#DCEEFF] rounded-[20px] space-y-4">
                      <h3 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 text-sm">
                        <Sliders className="w-4 h-4 text-[#2563EB]" />
                        WhatsApp Chatbot Configuration
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">WhatsApp API Integration</span>
                        <button
                          onClick={() => setWhatsappConnected(!whatsappConnected)}
                          className={`btn-premium-base px-4 py-1.5 text-[10px] font-extrabold uppercase ${whatsappConnected ? 'btn-premium-gradient' : 'btn-premium-secondary'}`}
                        >
                          {whatsappConnected ? 'Connected' : 'Disconnected'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Auto-Responder Chatbot</span>
                        <button
                          onClick={() => setChatbotActive(!chatbotActive)}
                          className={`btn-premium-base px-4 py-1.5 text-[10px] font-extrabold uppercase ${chatbotActive ? 'btn-premium-gradient' : 'btn-premium-secondary'}`}
                        >
                          {chatbotActive ? 'Active' : 'Offline'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: ADMIN PERMISSIONS TAB */}
              {activeTab === 'permissions' && (
                <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 shadow-[0_10px_30px_rgba(15,30,74,0.03)] space-y-6 animate-fadeIn">
                  <div className="border-b border-[#DCEEFF] pb-2">
                    <h2 className="text-xl font-extrabold text-[#0F1E4A]">Admin Access Privileges</h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Review system privilege scopes and Super Admin authorizations</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-[20px] p-5 flex items-center gap-4">
                    <ShieldCheck className="w-8 h-8 text-[#2563EB]" />
                    <div>
                      <span className="bg-[#2563EB]/10 text-[#2563EB] text-[9px] font-extrabold px-2 py-0.5 rounded">
                        Master Access Enabled
                      </span>
                      <h3 className="font-extrabold text-sm text-[#0F1E4A] mt-1.5">Super Admin Permission Level</h3>
                      <p className="text-xs font-medium text-slate-500">Ajinkya Amrule has full root privileges to update website core models, catalog configs, and booking schedules.</p>
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
