'use client'

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Calendar, Clock, User, Mail, X, CreditCard, Smartphone, Building, Star } from 'lucide-react'
import CalendarDatePicker from '@/components/CalendarDatePicker'

interface CourseBookingProps {
  course: {
    id: string
    title: string
    instructor: string
    price: number
    category: string
  }
  onBookingComplete: (booking: any) => void
}

interface Holiday {
  id: string
  date: string
  reason: string
  isRecurringWeekly: boolean
  dayOfWeek?: number
}

interface BatchSchedule {
  id: string
  name: string
  startTime: string
  endTime: string
  timeSlots: string[]
}

// Custom SVG Note Components
const SingleNote = memo(({ className, color }: { className?: string; color: string }) => (
  <svg className={`${className} w-3 h-4`} viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 12.5c0 1.38-1.12 2.5-2.5 2.5S3 13.88 3 12.5s1.12-2.5 2.5-2.5c.34 0 .66.07.96.19V2h5v3H8v7.5z"
      fill={color}
    />
  </svg>
))
SingleNote.displayName = 'SingleNote'

const DoubleNote = memo(({ className, color }: { className?: string; color: string }) => (
  <svg className={`${className} w-4 h-4`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 11.5c0 1.1.9 2 2 2s2-.9 2-2v-8l7-1.75V9.5c0 1.1.9 2 2 2s2-.9 2-2v-9L5 2.5v9z"
      fill={color}
    />
  </svg>
))
DoubleNote.displayName = 'DoubleNote'

// Custom 3D Grand Piano vector SVG
const PianoSVG = memo(({ color }: { color: 'pink' | 'blue' | 'purple' }) => {
  const themes = {
    pink: {
      baseGrad: ['#FFD6E8', '#FF6FAF'],
      highlight: '#FFF0F6',
      shadow: '#FF3B8E',
      noteColor: '#FF6FAF'
    },
    blue: {
      baseGrad: ['#DCEEFF', '#5EA8FF'],
      highlight: '#F0F7FF',
      shadow: '#2B8CFF',
      noteColor: '#5EA8FF'
    },
    purple: {
      baseGrad: ['#F4D9FF', '#DFA7FF'],
      highlight: '#FAF0FF',
      shadow: '#C37DFF',
      noteColor: '#DFA7FF'
    }
  }

  const active = themes[color]
  const gradId = `piano-booking-grad-${color}`
  const glossyId = `glossy-booking-grad-${color}`

  return (
    <div className="relative w-28 h-20 flex-shrink-0 select-none">
      <svg width="100%" height="100%" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradId} x1="20" y1="15" x2="100" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={active.baseGrad[0]} />
            <stop offset="50%" stopColor={active.baseGrad[1]} />
            <stop offset="100%" stopColor={active.shadow} />
          </linearGradient>
          <linearGradient id={glossyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="72" rx="42" ry="7" fill="black" fillOpacity="0.08" />
        <path
          d="M15 48 C15 28, 40 28, 55 18 C68 8, 100 8, 108 18 C115 26, 115 56, 108 60 C98 65, 35 65, 15 58 Z"
          fill={`url(#${gradId})`}
          stroke={active.baseGrad[1]}
          strokeWidth="0.5"
        />
        <path d="M16 45 C20 28, 42 28, 55 19 C66 10, 98 10, 106 19 C111 25, 111 50, 106 54 Z" fill={`url(#${glossyId})`} />
        <path d="M48 15 L92 5 L102 18 L58 22 Z" fill={active.highlight} opacity="0.95" stroke={active.baseGrad[1]} strokeWidth="0.5" />
        <line x1="88" y1="5" x2="88" y2="20" stroke="#555" strokeWidth="2" />
        <rect x="20" y="48" width="70" height="12" rx="2" fill="white" stroke={active.baseGrad[1]} strokeWidth="1.2" />
        <line x1="26" y1="48" x2="26" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="32" y1="48" x2="32" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="38" y1="48" x2="38" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="44" y1="48" x2="44" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="50" y1="48" x2="50" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="56" y1="48" x2="56" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="62" y1="48" x2="62" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="68" y1="48" x2="68" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="74" y1="48" x2="74" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="80" y1="48" x2="80" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <line x1="86" y1="48" x2="86" y2="60" stroke="#E2E8F0" strokeWidth="0.7" />
        <rect x="24" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="30" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="42" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="48" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="54" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="66" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="72" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="78" y="48" width="2" height="7" fill="#0F172A" />
        <rect x="22" y="60" width="3.5" height="13" fill={active.baseGrad[1]} />
        <rect x="84.5" y="60" width="3.5" height="13" fill={active.baseGrad[1]} />
        <rect x="53" y="61" width="3.5" height="11" fill={active.shadow} />
      </svg>
      <DoubleNote className="absolute -top-1 -right-3 opacity-60 animate-bounce" color={active.noteColor} />
      <SingleNote className="absolute top-8 -left-4 opacity-50 animate-pulse" color={active.noteColor} />
    </div>
  )
})
PianoSVG.displayName = 'PianoSVG'

export default function CourseBooking({ course, onBookingComplete }: CourseBookingProps) {
  const { theme } = useTheme()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedBatch, setSelectedBatch] = useState<'morning' | 'evening' | ''>('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [isBooking, setIsBooking] = useState(false)

  // API State
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [schedules, setSchedules] = useState<BatchSchedule[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch schedules & holidays
  useEffect(() => {
    if (!showBookingModal) return

    async function loadConfig() {
      try {
        const [holidayRes, scheduleRes] = await Promise.all([
          fetch('/api/holidays').then(r => r.json()),
          fetch('/api/schedules').then(r => r.json())
        ])
        
        if (Array.isArray(holidayRes)) setHolidays(holidayRes)
        if (Array.isArray(scheduleRes)) setSchedules(scheduleRes)
      } catch (error) {
        console.error("Failed to load booking configurations", error)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [showBookingModal])

  // Determine theme styling based on course title
  const getThemeConfig = useCallback(() => {
    const t = course.title?.toLowerCase() || ''
    if (t.includes('intermediate')) {
      return {
        themeColor: 'blue' as const,
        badgeText: 'INTERMEDIATE',
        badge: 'bg-[#DCEEFF]/30 text-[#5EA8FF] border-[#DCEEFF]/60',
        label: 'text-[#5EA8FF]',
        instructorIcon: 'text-[#5EA8FF]',
        pillBg: 'bg-[#DCEEFF]/20',
        iconColor: '#5EA8FF',
        price: 'text-[#5EA8FF]',
        gradient: 'from-[#5EA8FF] to-[#7EB8FF] hover:from-[#7EB8FF] hover:to-[#5EA8FF]',
        selectedPill: 'bg-[#5EA8FF] border-[#5EA8FF] text-white',
        unselectedPill: 'bg-white border-[#5EA8FF] text-[#5EA8FF] hover:bg-[#DCEEFF]/20',
        activeRing: 'focus:ring-[#5EA8FF]/40',
        accentBg: 'bg-[#5EA8FF]'
      }
    }
    if (t.includes('advanced')) {
      return {
        themeColor: 'purple' as const,
        badgeText: 'ADVANCED',
        badge: 'bg-[#F4D9FF]/30 text-[#DFA7FF] border-[#F4D9FF]/60',
        label: 'text-[#DFA7FF]',
        instructorIcon: 'text-[#DFA7FF]',
        pillBg: 'bg-[#F4D9FF]/20',
        iconColor: '#DFA7FF',
        price: 'text-[#DFA7FF]',
        gradient: 'from-[#FF6FAF] to-[#DFA7FF] hover:from-[#DFA7FF] hover:to-[#FF6FAF]',
        selectedPill: 'bg-[#DFA7FF] border-[#DFA7FF] text-white',
        unselectedPill: 'bg-white border-[#DFA7FF] text-[#DFA7FF] hover:bg-[#F4D9FF]/20',
        activeRing: 'focus:ring-[#DFA7FF]/40',
        accentBg: 'bg-[#DFA7FF]'
      }
    }
    // Beginner/Default
    return {
      themeColor: 'pink' as const,
      badgeText: 'BEGINNER',
      badge: 'bg-[#FFD6E8]/30 text-[#FF6FAF] border-[#FFD6E8]/60',
      label: 'text-[#FF6FAF]',
      instructorIcon: 'text-[#FF6FAF]',
      pillBg: 'bg-[#FFD6E8]/20',
      iconColor: '#FF6FAF',
      price: 'text-[#FF6FAF]',
      gradient: 'from-[#FF6FAF] to-[#FF8EBF] hover:from-[#FF8EBF] hover:to-[#FF6FAF]',
      selectedPill: 'bg-[#FF6FAF] border-[#FF6FAF] text-white',
      unselectedPill: 'bg-white border-[#FF6FAF] text-[#FF6FAF] hover:bg-[#FFD6E8]/20',
      activeRing: 'focus:ring-[#FF6FAF]/40',
      accentBg: 'bg-[#FF6FAF]'
    }
  }, [course.title])

  const style = useMemo(() => getThemeConfig(), [getThemeConfig])

  // Get active timeslots based on selected batch
  const getActiveTimeSlots = () => {
    if (!selectedBatch) return []
    const batch = schedules.find(s => s.id === selectedBatch)
    if (batch) return batch.timeSlots

    if (selectedBatch === 'morning') {
      return ["04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
    } else {
      return ["03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"]
    }
  }

  const activeTimeSlots = getActiveTimeSlots()

  const handleBookTimeSlot = () => {
    if (!selectedDate || !selectedBatch || !selectedTimeSlot) {
      alert('Please select date, batch timing, and time slot')
      return
    }
    setShowPayment(true)
  }

  const handlePayment = () => {
    if (!studentName || !studentEmail) {
      alert('Please fill in your details')
      return
    }
    setShowPaymentOptions(true)
  }

  const processPayment = async (paymentMethod: string) => {
    setIsBooking(true)

    try {
      const payload = {
        courseId: course.id,
        courseName: course.title,
        instructor: course.instructor,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        batchTiming: selectedBatch,
        studentName,
        studentEmail,
        amount: course.price,
        paymentMethod
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit booking')
      }

      onBookingComplete(result.booking)
      
      alert(`Booking confirmed for ${course.title}! Payment method: ${paymentMethod}`)
      
      // Reset states
      setShowPaymentOptions(false)
      setShowPayment(false)
      setShowBookingModal(false)
      setSelectedDate('')
      setSelectedBatch('')
      setSelectedTimeSlot('')
      setStudentName('')
      setStudentEmail('')
    } catch (error: any) {
      console.error('Booking failed:', error)
      alert(error.message || 'Booking failed. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowBookingModal(true)}
        className={`w-full py-4 text-white text-sm font-bold rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-md hover:shadow-lg bg-gradient-to-r ${style.gradient}`}
      >
        Book Time Slot
      </button>

      {/* Time Slots Modal - Split Premium Screen */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-[24px] bg-white text-[#0F1E4A] shadow-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
            
            {/* Close Button */}
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* LEFT SIDE: Course summary card */}
              <div className="lg:col-span-2 bg-[#FAFBFF] border border-gray-100 p-6 rounded-[24px] flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-wider uppercase ${style.badge}`}>
                      {style.badgeText}
                    </span>
                    <PianoSVG color={style.themeColor} />
                  </div>

                  <div className="space-y-4">
                    <p className={`text-[11px] font-extrabold tracking-widest uppercase ${style.label}`}>
                      {course.category.replace('-', ' ').toUpperCase()}
                    </p>
                    <h3 className="text-xl font-bold text-[#0F1E4A] leading-tight">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm pt-1">
                      <User className={`w-4 h-4 ${style.instructorIcon}`} />
                      <span className="text-[#0F1E4A] font-semibold opacity-90">{course.instructor}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200/60 space-y-4">
                  <div className="flex gap-2">
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-[10px] ${style.pillBg}`}>
                      <Clock className="w-3 h-3" style={{ color: style.iconColor }} />
                      <span className="text-[#0F1E4A]">
                        {course.title.toLowerCase().includes('intermediate') ? '4 M' : course.title.toLowerCase().includes('advanced') ? '6 M' : '3 M'}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-[10px] ${style.pillBg}`}>
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-[#0F1E4A]">
                        {course.title.toLowerCase().includes('intermediate') ? '4.85' : course.title.toLowerCase().includes('advanced') ? '4.9' : '4.8'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Course Fee</p>
                      <p className={`text-xl font-black ${style.price}`}>
                        ₹{course.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase ${style.badge}`}>
                      {course.title.toLowerCase().includes('intermediate') ? 'Intermediate' : course.title.toLowerCase().includes('advanced') ? 'Advanced' : 'Beginner'}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Modern Calendar Card */}
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#0F1E4A] mb-1">
                    Select Date & Time
                  </h2>
                  <p className="text-sm text-slate-500 font-medium">
                    Schedule your batch and hourly slots
                  </p>
                </div>

                {loading ? (
                  <div className="text-center py-6">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-[#FF6FAF] border-t-transparent rounded-full mb-2"></div>
                    <p className="text-gray-500 text-sm">Loading schedule...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Step 1: Calendar Selection */}
                    <div>
                      <label className="block text-sm font-bold text-slate-500 mb-2.5">
                        1. Select Date (Tuesday to Sunday)
                      </label>
                      <CalendarDatePicker
                        selectedDate={selectedDate}
                        onChange={(dateStr) => {
                          setSelectedDate(dateStr)
                          setSelectedTimeSlot('')
                        }}
                        holidays={holidays}
                        accentColor={style.themeColor}
                        theme="light"
                      />
                    </div>

                    {/* Step 2: Batch Timing Selection */}
                    {selectedDate && (
                      <div className="space-y-2.5">
                        <label className="block text-sm font-bold text-slate-500">
                          2. Select Batch Timing
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBatch('morning')
                              setSelectedTimeSlot('')
                            }}
                            className={`py-3 px-4 rounded-[20px] border-[1.5px] font-semibold text-xs transition-all duration-300 ${
                              selectedBatch === 'morning' ? style.selectedPill : style.unselectedPill
                            }`}
                          >
                            <span className="block font-bold">Morning Batch</span>
                            <span className="text-[10px] opacity-80">04:00 AM - 12:00 PM</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBatch('evening')
                              setSelectedTimeSlot('')
                            }}
                            className={`py-3 px-4 rounded-[20px] border-[1.5px] font-semibold text-xs transition-all duration-300 ${
                              selectedBatch === 'evening' ? style.selectedPill : style.unselectedPill
                            }`}
                          >
                            <span className="block font-bold">Evening Batch</span>
                            <span className="text-[10px] opacity-80">03:00 PM - 09:00 PM</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Hourly Pills */}
                    {selectedBatch && (
                      <div className="space-y-2.5">
                        <label className="block text-sm font-bold text-slate-500">
                          3. Select Hourly Time Slot
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {activeTimeSlots.map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`py-2 px-4 rounded-full border-[1.5px] font-semibold text-xs transition-all duration-300 ${
                                selectedTimeSlot === slot ? style.selectedPill : style.unselectedPill
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 4: Details input fields */}
                    {selectedTimeSlot && (
                      <div className="space-y-3 pt-2">
                        <label className="block text-sm font-bold text-slate-500">
                          4. Enter Student Information
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Full Name"
                            className={`w-full px-4 py-3 rounded-[20px] border-[1.5px] border-gray-200 text-sm focus:outline-none focus:ring-2 ${style.activeRing}`}
                          />
                          <input
                            type="email"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="Email Address"
                            className={`w-full px-4 py-3 rounded-[20px] border-[1.5px] border-gray-200 text-sm focus:outline-none focus:ring-2 ${style.activeRing}`}
                          />
                        </div>
                      </div>
                    )}

                    {/* Final Action Button */}
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      <button
                        onClick={handleBookTimeSlot}
                        disabled={!selectedDate || !selectedBatch || !selectedTimeSlot}
                        className={`w-full h-12 rounded-[20px] text-xs font-bold text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center ${
                          !selectedDate || !selectedBatch || !selectedTimeSlot
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                            : `bg-gradient-to-r ${style.gradient} hover:shadow-lg`
                        }`}
                      >
                        Continue to Payment
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingModal(false)}
                        className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors text-center"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Confirmation Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[24px] bg-white text-[#0F1E4A] shadow-2xl p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold mb-1">
                  Confirm Booking Details
                </h2>
                <p className="text-xs text-slate-500 font-semibold">Please verify your selection</p>
              </div>

              <div className="p-5 rounded-[20px] bg-[#FAFBFF] border border-gray-100">
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">COURSE:</span>
                    <span className="font-extrabold text-[#0F1E4A]">{course.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">DATE:</span>
                    <span className="font-extrabold text-[#0F1E4A]">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">BATCH:</span>
                    <span className="font-extrabold text-[#0F1E4A] capitalize">{selectedBatch} Batch</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">TIME SLOT:</span>
                    <span className="font-extrabold text-[#0F1E4A]">{selectedTimeSlot}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3.5 text-sm">
                    <span className="text-slate-400 font-bold">TOTAL FEE:</span>
                    <span className={`font-black text-lg ${style.price}`}>₹{course.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handlePayment}
                  disabled={isBooking || !studentName || !studentEmail}
                  className={`w-full h-12 rounded-[20px] text-xs font-bold text-white transition-all shadow-md active:scale-[0.98] flex items-center justify-center ${
                    isBooking || !studentName || !studentEmail
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : `bg-gradient-to-r ${style.gradient} hover:shadow-lg`
                  }`}
                >
                  {isBooking ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors text-center"
                >
                  Back to Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Options Modal */}
      {showPaymentOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-[24px] bg-white text-[#0F1E4A] shadow-2xl p-6">
            <button
              onClick={() => setShowPaymentOptions(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold mb-1">
                  Select Payment Method
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Complete your enrollment below
                </p>
              </div>

              <div className="space-y-3">
                {/* Credit/Debit Card */}
                <button
                  onClick={() => processPayment('Credit/Debit Card')}
                  disabled={isBooking}
                  className="w-full p-4 rounded-[20px] border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-4 bg-white active:scale-[0.99]"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.pillBg}`}>
                    <CreditCard className="w-5 h-5" style={{ color: style.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-[#0F1E4A] text-sm">Credit/Debit Card</div>
                    <div className="text-[11px] text-gray-400 font-semibold">Visa, Mastercard, RuPay</div>
                  </div>
                </button>

                {/* UPI */}
                <button
                  onClick={() => processPayment('UPI')}
                  disabled={isBooking}
                  className="w-full p-4 rounded-[20px] border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-4 bg-white active:scale-[0.99]"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.pillBg}`}>
                    <Smartphone className="w-5 h-5" style={{ color: style.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-[#0F1E4A] text-sm">UPI (BHIM)</div>
                    <div className="text-[11px] text-gray-400 font-semibold">GPay, PhonePe, Paytm</div>
                  </div>
                </button>

                {/* Net Banking */}
                <button
                  onClick={() => processPayment('Net Banking')}
                  disabled={isBooking}
                  className="w-full p-4 rounded-[20px] border border-gray-200 hover:border-gray-300 transition-all flex items-center gap-4 bg-white active:scale-[0.99]"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.pillBg}`}>
                    <Building className="w-5 h-5" style={{ color: style.iconColor }} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-[#0F1E4A] text-sm">Net Banking</div>
                    <div className="text-[11px] text-gray-400 font-semibold">All major banks supported</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
