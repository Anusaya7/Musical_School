'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Settings,
  LogOut,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  Video,
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Header from '@/components/Header'

// Default mock data in case API is empty during initial load
const defaultRevenueData = [
  { name: 'Jan', revenue: 40000, enrollments: 12 },
  { name: 'Feb', revenue: 35000, enrollments: 15 },
  { name: 'Mar', revenue: 50000, enrollments: 18 },
  { name: 'Apr', revenue: 75000, enrollments: 22 },
  { name: 'May', revenue: 60000, enrollments: 20 },
  { name: 'Jun', revenue: 85000, enrollments: 28 },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

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
    
    // Generate timeslots hourly based on starts & ends
    const generateSlots = (startStr: string, endStr: string) => {
      // Basic slot generation logic (morning/evening defaults)
      if (startStr.includes("04:00") && endStr.includes("12:00")) {
        return ["04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
      }
      if (startStr.includes("03:00") && endStr.includes("09:00")) {
        return ["03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"]
      }
      
      // Dynamic fallback based on input
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

    // Clean YouTube embed URLs
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

  // Total Earnings & Stats calculations
  const totalBookingsCount = bookings.length
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 4999), 0)
  const activeHolidaysCount = holidays.length
  const workshopsCount = workshops.length

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <div className="flex flex-1 pt-20">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              School Panel
            </h1>
            <p className="text-xs text-gray-400 mt-1">Adjust timings, holidays & courses</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'courses', label: 'Manage Courses', icon: BookOpen },
              { id: 'timings', label: 'Batch Timings', icon: Clock },
              { id: 'holidays', label: 'Holidays Planner', icon: Calendar },
              { id: 'workshops', label: 'Special Workshops', icon: Plus },
              { id: 'recorded', label: 'Recorded Sessions', icon: Video },
              { id: 'bookings', label: 'Student Bookings', icon: Users },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === item.id 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Back to Site</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {/* Tab: Dashboard */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Total Revenue</span>
                        <DollarSign className="w-5 h-5 text-green-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Total Bookings</span>
                        <Users className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{totalBookingsCount}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Holidays Set</span>
                        <Calendar className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{activeHolidaysCount}</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-gray-500 uppercase">Workshops</span>
                        <Plus className="w-5 h-5 text-purple-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{workshopsCount}</p>
                    </div>
                  </div>

                  {/* Analytics Graph */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Enrollment & Revenue Trends</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={defaultRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Courses */}
              {activeTab === 'courses' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Course Listing & Pricing</h2>
                    <p className="text-sm text-gray-500">Double click or click the edit icon to modify pricing parameters</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm font-semibold">
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
                          <tr key={course.id} className="border-b hover:bg-gray-50 text-sm text-gray-700">
                            <td className="p-4 font-bold">{course.title}</td>
                            <td className="p-4 capitalize">{course.category}</td>
                            <td className="p-4">{course.level}</td>
                            <td className="p-4 text-purple-700 font-bold">₹{course.price.toLocaleString('en-IN')}</td>
                            <td className="p-4">{course.instructor}</td>
                            <td className="p-4">{course.duration}</td>
                            <td className="p-4">
                              <button
                                onClick={() => {
                                  setEditingCourse(course)
                                  setNewPrice(course.price)
                                }}
                                className="text-purple-600 hover:text-purple-900 flex items-center space-x-1"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Change Price</span>
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
                      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Course Price</h3>
                        <p className="text-sm text-gray-600 mb-4">Update price for: <strong>{editingCourse.title}</strong></p>
                        
                        <form onSubmit={handleUpdatePrice} className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Price (INR)</label>
                            <input
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(Number(e.target.value))}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                              required
                            />
                          </div>

                          <div className="flex space-x-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingCourse(null)}
                              className="flex-1 py-2 px-4 border rounded-lg hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
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

              {/* Tab: Timings */}
              {activeTab === 'timings' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900">Manage Class Batch Timings</h2>
                    <p className="text-sm text-gray-500">Configure standard operating hours for Morning and Evening sessions.</p>
                  </div>

                  <form onSubmit={handleUpdateTimings} className="max-w-2xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-200 space-y-4">
                        <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Morning Batch Configuration
                        </h3>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                          <input
                            type="text"
                            value={morningStart}
                            onChange={(e) => setMorningStart(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">End Time</label>
                          <input
                            type="text"
                            value={morningEnd}
                            onChange={(e) => setMorningEnd(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-4">
                        <h3 className="font-bold text-purple-800 flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          Evening Batch Configuration
                        </h3>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">Start Time</label>
                          <input
                            type="text"
                            value={eveningStart}
                            onChange={(e) => setEveningStart(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1">End Time</label>
                          <input
                            type="text"
                            value={eveningEnd}
                            onChange={(e) => setEveningEnd(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition-colors"
                    >
                      Update Operating Hours
                    </button>
                  </form>
                </div>
              )}

              {/* Tab: Holidays */}
              {activeTab === 'holidays' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Holiday form */}
                  <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-gray-200 h-fit space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Mark a Holiday</h2>
                    
                    <form onSubmit={handleAddHoliday} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="weekly"
                          checked={isWeeklyHoliday}
                          onChange={(e) => setIsWeeklyHoliday(e.target.checked)}
                          className="w-4 h-4 rounded text-purple-600"
                        />
                        <label htmlFor="weekly" className="text-sm font-semibold text-gray-700">Weekly Recurring Holiday</label>
                      </div>

                      {isWeeklyHoliday ? (
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Day</label>
                          <select
                            value={weeklyDay}
                            onChange={(e) => setWeeklyDay(Number(e.target.value))}
                            className="w-full px-4 py-2 border rounded-lg"
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
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Date</label>
                          <input
                            type="date"
                            value={holidayDate}
                            onChange={(e) => setHolidayDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reason / Label</label>
                        <input
                          type="text"
                          value={holidayReason}
                          onChange={(e) => setHolidayReason(e.target.value)}
                          placeholder="e.g. Independence Day"
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-md transition-colors"
                      >
                        Add Holiday
                      </button>
                    </form>
                  </div>

                  {/* Holiday List */}
                  <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Active School Holidays</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
                            <th className="p-3">Type</th>
                            <th className="p-3">Date / Day</th>
                            <th className="p-3">Reason</th>
                            <th className="p-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holidays.map(h => (
                            <tr key={h.id} className="border-b text-sm text-gray-700 hover:bg-gray-50">
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  h.isRecurringWeekly ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {h.isRecurringWeekly ? 'Weekly' : 'Single Date'}
                                </span>
                              </td>
                              <td className="p-3 font-semibold">
                                {h.isRecurringWeekly 
                                  ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][h.dayOfWeek || 0]
                                  : h.date}
                              </td>
                              <td className="p-3">{h.reason}</td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleDeleteHoliday(h.id)}
                                  className="text-red-500 hover:text-red-900"
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

              {/* Tab: Workshops */}
              {activeTab === 'workshops' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-gray-200 h-fit space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Add Special Workshop</h2>
                    
                    <form onSubmit={handleAddWorkshop} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input
                          type="text"
                          value={workshopTitle}
                          onChange={(e) => setWorkshopTitle(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Instructor</label>
                        <input
                          type="text"
                          value={workshopInstructor}
                          onChange={(e) => setWorkshopInstructor(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                        <input
                          type="date"
                          value={workshopDate}
                          onChange={(e) => setWorkshopDate(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                        <input
                          type="text"
                          value={workshopTime}
                          onChange={(e) => setWorkshopTime(e.target.value)}
                          placeholder="e.g. 10:00 AM - 12:00 PM"
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (INR)</label>
                        <input
                          type="number"
                          value={workshopPrice}
                          onChange={(e) => setWorkshopPrice(Number(e.target.value))}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                        <textarea
                          value={workshopDesc}
                          onChange={(e) => setWorkshopDesc(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          rows={3}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-md transition-colors"
                      >
                        Create Workshop
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Upcoming Workshops</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {workshops.map(w => (
                        <div key={w.id} className="p-4 border rounded-xl bg-gray-50 space-y-2">
                          <h3 className="font-bold text-md text-gray-800">{w.title}</h3>
                          <p className="text-xs text-gray-500">Instructor: {w.instructor}</p>
                          <div className="flex justify-between text-xs font-medium text-gray-600">
                            <span>{w.date}</span>
                            <span>{w.time}</span>
                          </div>
                          <p className="text-sm font-bold text-purple-700">₹{w.price.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-600 mt-2">{w.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Recorded */}
              {activeTab === 'recorded' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-gray-200 h-fit space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Upload YouTube Video</h2>
                    
                    <form onSubmit={handleAddVideo} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Video Title</label>
                        <input
                          type="text"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">YouTube URL</label>
                        <input
                          type="text"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="e.g. https://www.youtube.com/watch?v=..."
                          className="w-full px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Instrument Category</label>
                        <select
                          value={videoInstrument}
                          onChange={(e) => setVideoInstrument(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
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
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brief Description</label>
                        <textarea
                          value={videoDesc}
                          onChange={(e) => setVideoDesc(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg"
                          rows={3}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-md transition-colors"
                      >
                        Publish Video
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Recorded Sessions Directory</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recordedSessions.map(v => (
                        <div key={v.id} className="border rounded-xl overflow-hidden bg-white shadow-sm">
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
                              <h4 className="font-bold text-md text-gray-800">{v.title}</h4>
                              <span className="bg-purple-100 text-purple-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                                {v.instrument}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{v.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Bookings */}
              {activeTab === 'bookings' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 border-b pb-2">All Student Bookings</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 text-xs font-bold uppercase">
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
                          <tr key={b.id} className="border-b text-sm text-gray-700 hover:bg-gray-50">
                            <td className="p-4 font-semibold">{b.studentName}</td>
                            <td className="p-4">{b.studentEmail}</td>
                            <td className="p-4 font-semibold text-gray-900">{b.courseName}</td>
                            <td className="p-4">{b.instructor}</td>
                            <td className="p-4">{b.date}</td>
                            <td className="p-4 capitalize">{b.batchTiming}</td>
                            <td className="p-4">{b.timeSlot}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
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
            </>
          )}
        </main>
      </div>
    </div>
  )
}
