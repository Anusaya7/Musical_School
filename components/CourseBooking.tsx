'use client'

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useSession } from 'next-auth/react'
import { useTheme } from '@/contexts/ThemeContext'
import { openRazorpayCheckout, reportCheckoutClosed, verifyCheckoutPayment } from '@/lib/razorpay-checkout'
import { bookingReturnPath, readBookingSelection } from '@/lib/booking-selection'
import { Calendar, Clock, User, Mail, X, CreditCard, Smartphone, Building, Star, CheckCircle2, Loader2 } from 'lucide-react'
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
  const { data: session, status: authStatus } = useSession()
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedBatch, setSelectedBatch] = useState<'morning' | 'evening' | ''>('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPhone, setStudentPhone] = useState('')
  const [isBooking, setIsBooking] = useState(false)
  const [showProcessingOverlay, setShowProcessingOverlay] = useState(false)
  const [currentProgressStep, setCurrentProgressStep] = useState(0)

  // API State
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [schedules, setSchedules] = useState<BatchSchedule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user) return
    if (session.user.email) setStudentEmail(session.user.email)
    if (session.user.name) setStudentName(session.user.name)
  }, [session])

  useEffect(() => {
    const restored = readBookingSelection(window.location.search, course.id)
    if (!restored) return
    setSelectedDate(restored.date)
    setSelectedBatch(restored.batch)
    setSelectedTimeSlot(restored.slot)
    setShowPayment(true)
  }, [course.id])

  const goToLoginToPay = () => {
    const next = bookingReturnPath(window.location.pathname, {
      courseId: course.id,
      date: selectedDate,
      batch: selectedBatch,
      slot: selectedTimeSlot,
    })
    window.location.href = `/login?callbackUrl=${encodeURIComponent(next)}`
  }

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

  const [formError, setFormError] = useState<string | null>(null)

  const handleBookTimeSlot = () => {
    setFormError(null)
    if (!selectedDate || !selectedBatch || !selectedTimeSlot) {
      setFormError('Please select date, batch timing, and time slot')
      return
    }
    setShowPayment(true)
  }

  const startProcessingAndVerify = async (verifyParams: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => {
    setShowProcessingOverlay(true)
    setCurrentProgressStep(0)

    let apiDone = false
    let apiSuccess = false
    let verifyResult: any = null
    let apiError: string | null = null

    // 1. Trigger backend verification API
    const apiPromise = verifyCheckoutPayment(verifyParams)
    .then((data) => {
      apiDone = true
      apiSuccess = true
      verifyResult = data
    })
    .catch((err) => {
      apiDone = true
      apiSuccess = false
      apiError = err.message || 'Payment verification failed'
    })

    // 2. Animate the progress steps sequentially (500ms per step)
    for (let step = 0; step < 5; step++) {
      setCurrentProgressStep(step)
      // If the API call finished with an error, abort early
      if (apiDone && !apiSuccess) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // 3. Pause if animation completed but API is still running
    if (!apiDone) {
      setCurrentProgressStep(5)
      await apiPromise
    }

    // 4. Redirect on failure
    if (!apiSuccess || apiError) {
      setShowProcessingOverlay(false)
      window.location.href = `/payment/failed?reason=failed&courseUrl=${encodeURIComponent(window.location.pathname)}`
      return
    }

    // 5. Complete all progress steps (sets progress bar to 100%)
    setCurrentProgressStep(6)
    await new Promise((resolve) => setTimeout(resolve, 800)) // visual pause on full check state

    // Clear local inputs
    setSelectedDate('')
    setSelectedBatch('')
    setSelectedTimeSlot('')
    setStudentName('')
    setStudentEmail('')
    setStudentPhone('')
    setShowPayment(false)
    setShowBookingModal(false)
    setShowProcessingOverlay(false)

    // Redirect to Success Page with full parameters
    window.location.href = `/payment/success?orderId=${encodeURIComponent(verifyParams.razorpay_order_id)}`
  }

  const handlePayment = async () => {
    setFormError(null)
    if (authStatus !== 'authenticated') {
      goToLoginToPay()
      return
    }
    setIsBooking(true)

    // Form Validation
    if (!studentName || !studentName.trim()) {
      setFormError('Please enter your full name')
      setIsBooking(false)
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!studentEmail || !emailRegex.test(studentEmail)) {
      setFormError('Please enter a valid email address')
      setIsBooking(false)
      return
    }
    const phoneClean = studentPhone.replace(/\D/g, '')
    if (!studentPhone || phoneClean.length < 10) {
      setFormError('Please enter a valid phone number (at least 10 digits)')
      setIsBooking(false)
      return
    }
    if (!course || !course.id) {
      setFormError('Course information is missing')
      setIsBooking(false)
      return
    }
    if (!course.price || course.price <= 0) {
      setFormError('Course tuition fee is invalid')
      setIsBooking(false)
      return
    }

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currency: 'INR',
          purchaseType: 'booking',
          courseId: course.id,
          booking: {
            date: selectedDate,
            timeSlot: selectedTimeSlot,
            batchTiming: selectedBatch,
            instructor: course.instructor,
            phone: studentPhone
          }
        })
      })

      const orderData = await res.json()
      if (res.status === 401) {
        goToLoginToPay()
        return
      }
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order')
      }

      openRazorpayCheckout({
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        description: `Class booking: ${course.title}`,
        orderId: orderData.id,
        prefill: {
          name: session?.user?.name || studentName,
          email: session?.user?.email || studentEmail,
          contact: studentPhone
        },
        color: '#FF6FAF',
        onSuccess: async (response) => {
          await startProcessingAndVerify(response)
        },
        onDismiss: () => {
          reportCheckoutClosed(orderData.id, 'CANCELLED')
          setIsBooking(false)
          window.location.href = '/payment/failed?reason=cancelled'
        },
        onFailed: (message) => {
          reportCheckoutClosed(orderData.id, 'FAILED', message)
          setIsBooking(false)
          window.location.href = '/payment/failed?reason=failed'
        }
      })
    } catch (err: any) {
      console.error('Booking payment error:', err)
      setFormError(err.message || 'Could not process booking payment request.')
      setIsBooking(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowBookingModal(true)}
        className="btn-premium-base btn-premium-gradient w-full py-4 text-sm font-bold text-white"
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
                            className={`btn-premium-base py-3 px-4 text-xs font-semibold ${
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
                            className={`btn-premium-base py-3 px-4 text-xs font-semibold ${
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
                              className={`btn-premium-base rounded-full !important py-2 px-4 text-xs font-semibold ${
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                            readOnly={!!session?.user?.email}
                            placeholder="Email Address"
                            className={`w-full px-4 py-3 rounded-[20px] border-[1.5px] border-gray-200 text-sm focus:outline-none focus:ring-2 ${style.activeRing}`}
                          />
                          <input
                            type="tel"
                            value={studentPhone}
                            onChange={(e) => setStudentPhone(e.target.value)}
                            placeholder="Phone Number"
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
                        className={
                          !selectedDate || !selectedBatch || !selectedTimeSlot
                            ? 'w-full h-12 rounded-[20px] text-xs font-bold text-gray-400 bg-gray-200 cursor-not-allowed shadow-none border-none'
                            : 'btn-premium-base btn-premium-submit w-full h-12 text-xs font-bold text-white'
                        }
                      >
                        Book Time Slot
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowBookingModal(false)}
                        className="btn-premium-base btn-premium-secondary w-full py-2 text-xs font-bold"
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

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
                  {formError}
                </div>
              )}

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
                <label className="block text-xs font-bold text-slate-500">Phone Number</label>
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 rounded-[20px] border-[1.5px] border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6FAF]"
                />
              </div>

              <div className="space-y-2">
                <button
                  onClick={handlePayment}
                  disabled={isBooking || !studentName || !studentEmail || !studentPhone}
                  className={
                    isBooking || !studentName || !studentEmail || !studentPhone
                      ? 'w-full h-12 rounded-[20px] text-xs font-bold text-gray-400 bg-gray-200 cursor-not-allowed shadow-none border-none flex items-center justify-center gap-2'
                      : 'btn-premium-base btn-premium-submit w-full h-12 text-xs font-bold text-white flex items-center justify-center gap-2'
                  }
                >
                  {isBooking && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                  {isBooking ? 'Processing...' : authStatus === 'authenticated' ? `Pay ₹${course.price.toLocaleString('en-IN')} Securely` : 'Log in to Pay'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="btn-premium-base btn-premium-secondary w-full py-2 text-xs font-bold"
                >
                  Back to Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Premium Full-Screen Processing Overlay */}
      {showProcessingOverlay && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md text-white animate-fadeIn">
          <div className="max-w-md w-full text-center space-y-8 animate-scaleUp">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative flex items-center justify-center w-24 h-24">
                {/* Spinning premium outer ring */}
                <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-pink-500 border-b-purple-500 border-l-transparent animate-spin" />
                <Loader2 className="w-10 h-10 text-blue-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">Finalizing Your Booking...</h2>
              <p className="text-sm text-slate-400 font-medium">Please wait while we verify your payment and confirm your booking.</p>
            </div>

            {/* Premium progress bar */}
            <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out" 
                style={{ width: `${Math.min(100, Math.round((currentProgressStep / 6) * 100))}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="bg-[#0F1E4A] border border-blue-500/20 rounded-3xl p-6 text-left space-y-4 shadow-xl">
              {[
                'Verifying Payment',
                'Confirming Booking',
                'Generating Receipt',
                'Sending Confirmation Email',
                'Updating Student Dashboard',
                'Notifying Admin'
              ].map((step, idx) => {
                const isCompleted = currentProgressStep > idx
                const isActive = currentProgressStep === idx

                return (
                  <div key={idx} className="flex items-center justify-between text-sm transition-all duration-300">
                    <span className={`font-semibold transition-colors duration-300 ${isCompleted ? 'text-blue-400 line-through decoration-blue-500/30' : isActive ? 'text-white font-bold' : 'text-slate-400'}`}>
                      {step}
                    </span>
                    <div className="flex items-center justify-center w-5 h-5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-400 animate-scaleUp" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-pink-500 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
