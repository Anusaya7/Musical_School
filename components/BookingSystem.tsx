'use client'

import { useState, useEffect } from 'react'

interface BookingSystemProps {
  selectedClass: string | null
}

export default function BookingSystem({ selectedClass }: BookingSystemProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classId: selectedClass || '',
    message: ''
  })
  const [coursesList, setCoursesList] = useState<any[]>([])
  const [selectedCourseInfo, setSelectedCourseInfo] = useState<any | null>(null)

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCoursesList(data.filter((c: any) => !c.isDisabled))
        }
      })
      .catch(err => console.error('Failed to fetch courses for booking:', err))
  }, [])

  useEffect(() => {
    if (selectedClass) {
      setFormData(prev => ({ ...prev, classId: selectedClass }))
    }
  }, [selectedClass])

  // Sync selectedCourseInfo when coursesList or formData.classId changes
  useEffect(() => {
    const course = coursesList.find((c: any) => c.id === formData.classId)
    if (course) {
      setSelectedCourseInfo({
        courseId: course.id,
        courseTitle: course.title,
        instrumentId: course.category,
        instrumentName: course.instrumentName || course.category,
        level: course.level,
        price: course.price
      })
    } else {
      setSelectedCourseInfo(null)
    }
  }, [formData.classId, coursesList])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    if (!formData.name || !formData.email || !formData.phone || !formData.classId) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    setIsSubmitting(true)
    const selectedCourse = selectedCourseInfo || coursesList.find((c: any) => c.id === formData.classId)
    const amount = selectedCourse ? selectedCourse.price * 100 : 350000

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `rcpt_bk_${Date.now()}`,
          notes: {
            purchaseType: 'booking',
            studentName: formData.name,
            studentEmail: formData.email,
            studentPhone: formData.phone,
            courseId: selectedCourse?.courseId || formData.classId,
            courseName: selectedCourse?.courseTitle || selectedCourse?.title || 'Music Course Session',
            courseTitle: selectedCourse?.courseTitle || selectedCourse?.title || 'Music Course Session',
            instrumentId: selectedCourse?.instrumentId || selectedCourse?.category || '',
            instrumentName: selectedCourse?.instrumentName || '',
            level: selectedCourse?.level || '',
            price: selectedCourse?.price || 0,
            date: new Date().toISOString().split('T')[0],
            timeSlot: '10:00 AM - 11:00 AM',
            batchTiming: 'Morning'
          }
        })
      })

      const orderData = await res.json()
      if (!orderData.success) {
        const errStr = typeof orderData.error === 'object' ? JSON.stringify(orderData.error) : (orderData.error || 'Failed to create payment order.')
        setErrorMessage(errStr)
        setIsSubmitting(false)
        return
      }

      const Razorpay = (window as any).Razorpay
      if (!Razorpay) {
        setErrorMessage('Razorpay Checkout SDK is loading. Please try again in a moment.')
        setIsSubmitting(false)
        return
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: '2nd Inversion Musical School',
        description: `Class Booking: ${selectedCourse?.title || 'Music Session'}`,
        order_id: orderData.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: '#5EA8FF' },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  amount: selectedCourse?.price || 3500,
                  notes: {
                    purchaseType: 'booking',
                    studentName: formData.name,
                    studentEmail: formData.email,
                    studentPhone: formData.phone,
                    courseId: selectedCourse?.courseId || selectedCourse?.id || formData.classId,
                    courseName: selectedCourse?.courseTitle || selectedCourse?.title || 'Music Course Session',
                    date: new Date().toISOString().split('T')[0],
                    timeSlot: '10:00 AM - 11:00 AM',
                    batchTiming: 'Morning'
                  }
                }
              })
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              window.location.href = `/payment-success?paymentId=${response.razorpay_payment_id}&orderId=${response.razorpay_order_id}`
            } else {
              setErrorMessage(verifyData.error || 'Payment verification failed.')
              setIsSubmitting(false)
            }
          } catch (vErr: any) {
            setErrorMessage(vErr.message || 'Payment verification failed.')
            setIsSubmitting(false)
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false)
          }
        }
      }

      const rzp = new Razorpay(options)
      rzp.open()
    } catch (err: any) {
      console.error('Booking payment error:', err)
      setErrorMessage(err.message || 'Payment processing error. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="booking" className="py-24 bg-gradient-to-b from-[#FAFBFF] to-white relative overflow-hidden font-sans">
      {/* Soft Top/Bottom Pastel Accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#DCEEFF]/20 rounded-br-full opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FFD6E8]/20 rounded-tl-full opacity-60 pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-[1200px] relative z-10">

        {/* Hero Section */}
        <div className="text-center pb-12 mb-16 border-b-2 border-[#DCEEFF]">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#E6EEFF] text-[#5EA8FF] border border-[#5EA8FF]/20 shadow-sm">
              🎵 Music School Enrollment
            </span>
          </div>
          <h2 className="text-3xl md:text-[48px] font-extrabold text-[#0F1E4A] leading-tight mb-4">
            Start Your Musical <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]">Journey</span> Today
          </h2>
          <p className="text-sm md:text-base text-slate-500 max-w-[700px] mx-auto leading-relaxed font-medium">
            Book your preferred class and begin learning from expert instructors. Choose your instrument, select a time slot, and start your musical journey.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto mb-16">
          <div className="bg-white rounded-[20px] p-6 text-center shadow-[0_10px_25px_rgba(94,168,255,0.12)] border-2 border-[#C7DBFF] transition-all duration-300 hover:border-[#5EA8FF] hover:-translate-y-1 hover:shadow-lg">
            <div className="text-3xl mb-3">🎹</div>
            <h3 className="text-base font-bold text-[#0F1E4A] mb-1">Expert Teachers</h3>
            <p className="text-xs text-slate-400 font-medium">Learn from experienced instructors</p>
          </div>

          <div className="bg-white rounded-[20px] p-6 text-center shadow-[0_10px_25px_rgba(94,168,255,0.12)] border-2 border-[#C7DBFF] transition-all duration-300 hover:border-[#5EA8FF] hover:-translate-y-1 hover:shadow-lg">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="text-base font-bold text-[#0F1E4A] mb-1">Flexible Scheduling</h3>
            <p className="text-xs text-slate-400 font-medium">Choose dates and time slots easily</p>
          </div>

          <div className="bg-white rounded-[20px] p-6 text-center shadow-[0_10px_25px_rgba(94,168,255,0.12)] border-2 border-[#C7DBFF] transition-all duration-300 hover:border-[#5EA8FF] hover:-translate-y-1 hover:shadow-lg">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-base font-bold text-[#0F1E4A] mb-1">Certified Courses</h3>
            <p className="text-xs text-slate-400 font-medium">Structured learning path</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-[760px] mx-auto bg-white rounded-[24px] p-8 md:p-10 border-2 border-[#B8D4FF] hover:border-[#5EA8FF] shadow-[0_12px_40px_rgba(15,30,74,0.08)] transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-[#0F1E4A] mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="h-[56px] w-full px-4 border-2 border-[#B8D4FF] hover:border-[#5EA8FF] rounded-[14px] bg-white text-[#0F1E4A] placeholder-[#94A3B8] font-medium text-sm transition-all duration-300 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-bold text-[#0F1E4A] mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-[56px] w-full px-4 border-2 border-[#B8D4FF] hover:border-[#5EA8FF] rounded-[14px] bg-white text-[#0F1E4A] placeholder-[#94A3B8] font-medium text-sm transition-all duration-300 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-[#0F1E4A] mb-2 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="h-[56px] w-full px-4 border-2 border-[#B8D4FF] hover:border-[#5EA8FF] rounded-[14px] bg-white text-[#0F1E4A] placeholder-[#94A3B8] font-medium text-sm transition-all duration-300 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12"
                />
              </div>

              <div>
                <label htmlFor="classId" className="block text-xs font-bold text-[#0F1E4A] mb-2 uppercase tracking-wider">
                  Select Class
                </label>
                <div className="relative">
                  <select
                    id="classId"
                    name="classId"
                    value={formData.classId}
                    onChange={handleChange}
                    required
                    className="h-[56px] w-full px-4 pr-10 border-2 border-[#B8D4FF] hover:border-[#5EA8FF] rounded-[14px] bg-white text-[#0F1E4A] font-medium text-sm transition-all duration-300 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12 appearance-none cursor-pointer"
                  >
                    {coursesList.length === 0 ? (
                      <option value="">No published classes available.</option>
                    ) : (
                      <>
                        <option value="">Choose a class...</option>
                        {coursesList.map((c) => {
                          const displayInstrument = c.instrumentName || c.category || ''
                          const formattedInstrument = displayInstrument
                            .split('-')
                            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')

                          return (
                            <option key={c.id} value={c.id}>
                              {formattedInstrument} - {c.level}
                            </option>
                          )
                        })}
                      </>
                    )}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#94A3B8]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold text-[#0F1E4A] mb-2 uppercase tracking-wider">
                Additional Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your musical experience and what you'd like to learn..."
                value={formData.message}
                onChange={handleChange}
                className="h-[180px] w-full p-4 border-2 border-[#B8D4FF] hover:border-[#5EA8FF] rounded-[14px] bg-white text-[#0F1E4A] placeholder-[#94A3B8] font-medium text-sm transition-all duration-300 focus:outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/12 resize-none"
              />
            </div>

            {errorMessage && (
              <div className="p-4 rounded-[14px] bg-red-50 border border-red-200 text-red-600 text-sm font-semibold text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-premium-base btn-premium-submit w-full h-[60px] text-white font-bold text-[18px] tracking-[0.3px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />}
              <span className="relative z-10">{isSubmitting ? 'Processing...' : 'Submit Booking Request'}</span>
              {!isSubmitting && (
                <svg
                  className="w-5 h-5 relative z-10 transition-transform duration-300 ease-out group-hover/btn:translate-x-[6px] text-current"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>

            {/* Trust Section */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs md:text-sm font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#5EA8FF]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Secure Booking
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#5EA8FF]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Instant Confirmation
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#5EA8FF]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Professional Support
              </span>
            </div>

            {/* Admin Info */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-medium">
                Questions? Contact Admin: <strong className="text-slate-600 font-bold">Ajinkya Amrule</strong>
              </p>
            </div>

          </form>
        </div>
      </div>
    </section>
  )
}
